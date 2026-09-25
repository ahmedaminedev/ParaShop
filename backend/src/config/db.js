const mongoose = require('mongoose');

// Fail fast when MongoDB is disconnected - do not hang queries
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[AI Studio] No MONGO_URI provided — using in-memory store fallback.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connecté: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[AI Studio] MongoDB connexion non établie: ${error.message} — Mode mémoire actif.`);
  }
};

module.exports = connectDB;
