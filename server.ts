import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = require('./backend/src/app');
const connectDB = require('./backend/src/config/db');
const seedData = require('./backend/src/utils/seeder');

async function startServer() {
  const PORT = 3000;
  const HOST = '0.0.0.0';

  // Connect to database if MONGO_URI is configured
  try {
    await connectDB();
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      await seedData().catch(() => {});
    }
  } catch (err: any) {
    console.warn('[AI Studio] Seed/DB setup skipped:', err?.message || err);
  }

  const server = http.createServer(app);

  // Setup Socket.io for live chat and notifications
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  let isAdminOnline = false;

  io.on('connection', (socket) => {
    socket.on('join_room', (userId) => {
      socket.join(userId);
    });

    socket.on('admin_join', () => {
      socket.join('admin_room');
      isAdminOnline = true;
      io.emit('admin_status', { online: true });
    });

    socket.on('admin_leave', () => {
      isAdminOnline = false;
      io.emit('admin_status', { online: false });
    });

    socket.on('check_admin_status', () => {
      socket.emit('admin_status', { online: isAdminOnline });
    });

    socket.on('send_message', async (data) => {
      const { userId, sender, content, type } = data;
      const newMessage = {
        sender,
        content,
        type: type || 'text',
        timestamp: new Date(),
        read: false
      };
      io.to(userId).emit('receive_message', newMessage);
      io.to('admin_room').emit('refresh_chats', { userId, lastMessage: newMessage });
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any, next: any) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, HOST, () => {
    console.log(`PharmaNature server running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
