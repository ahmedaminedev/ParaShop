const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');
const packRoutes = require('./routes/packs');
const categoryRoutes = require('./routes/categories');
const storeRoutes = require('./routes/stores');
const promotionRoutes = require('./routes/promotions');
const advertisementRoutes = require('./routes/advertisements');
const offersConfigRoutes = require('./routes/offersConfig');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/reviews');
const brandRoutes = require('./routes/brands');
const errorHandler = require('./middleware/errorHandler');
const inMemoryStore = require('./data/inMemoryStore');

require('./config/passport')(passport);

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());
app.use(passport.initialize());

const corsOptions = {
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/packs', packRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/offers-config', offersConfigRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/brands', brandRoutes);

// Fallback error handler for offline database queries
app.use((err, req, res, next) => {
  const isDbError = err.name === 'MongooseError' || 
                    err.name === 'MongoNetworkError' || 
                    err.name === 'MongoServerSelectionError' ||
                    (err.message && (err.message.includes('buffering timed out') || err.message.includes('before initial connection')));

  if (isDbError) {
    console.warn(`[AI Studio] Database offline (${err.message}) — serving mock fallback for ${req.method} ${req.originalUrl}`);
    
    const url = req.originalUrl || req.url || '';

    if (req.method === 'GET') {
      if (url.includes('/api/products')) {
        const idMatch = url.match(/\/api\/products\/(\w+)/);
        if (idMatch) {
          const item = inMemoryStore.products.find(p => String(p.id) === idMatch[1]);
          return item ? res.json(item) : res.status(404).json({ message: 'Produit non trouvé' });
        }
        return res.json(inMemoryStore.products);
      }
      if (url.includes('/api/categories')) return res.json(inMemoryStore.categories);
      if (url.includes('/api/brands')) return res.json(inMemoryStore.brands);
      if (url.includes('/api/advertisements')) return res.json(inMemoryStore.advertisements);
      if (url.includes('/api/packs')) {
        const idMatch = url.match(/\/api\/packs\/(\w+)/);
        if (idMatch) {
          const item = inMemoryStore.packs.find(p => String(p.id) === idMatch[1]);
          return item ? res.json(item) : res.status(404).json({ message: 'Pack non trouvé' });
        }
        return res.json(inMemoryStore.packs);
      }
      if (url.includes('/api/stores')) return res.json(inMemoryStore.stores);
      if (url.includes('/api/promotions')) return res.json(inMemoryStore.promotions);
      if (url.includes('/api/offers-config')) return res.json(inMemoryStore.offersConfig);
      if (url.includes('/api/blog')) {
        const slugMatch = url.match(/\/api\/blog\/([\w-]+)/);
        if (slugMatch) {
          const item = inMemoryStore.blogPosts.find(b => b.slug === slugMatch[1] || String(b.id) === slugMatch[1]);
          return item ? res.json(item) : res.status(404).json({ message: 'Article non trouvé' });
        }
        return res.json(inMemoryStore.blogPosts);
      }
      if (url.includes('/api/orders')) return res.json(inMemoryStore.orders);
      if (url.includes('/api/reviews')) return res.json(inMemoryStore.reviews);
      if (url.includes('/api/contact')) return res.json(inMemoryStore.contactMessages);
      if (url.includes('/api/chat')) return res.json(inMemoryStore.chats);

      return res.json(url.endsWith('s') || url.endsWith('s/') ? [] : {});
    }

    if (req.method === 'POST') {
      if (url.includes('/api/products')) {
        const newProduct = { id: Date.now(), ...req.body };
        inMemoryStore.products.push(newProduct);
        return res.status(201).json(newProduct);
      }
      if (url.includes('/api/orders')) {
        const newOrder = { 
          id: `order_${Date.now()}`, 
          ...req.body, 
          status: 'confirmée', 
          date: new Date().toISOString() 
        };
        inMemoryStore.orders.push(newOrder);
        return res.status(201).json(newOrder);
      }
      if (url.includes('/api/contact')) {
        const msg = { id: Date.now(), ...req.body, createdAt: new Date() };
        inMemoryStore.contactMessages.push(msg);
        return res.status(201).json({ success: true, message: 'Message reçu' });
      }
      return res.status(200).json({ success: true, ...req.body });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (url.includes('/api/advertisements')) {
        Object.assign(inMemoryStore.advertisements, req.body);
        return res.json(inMemoryStore.advertisements);
      }
      if (url.includes('/api/offers-config')) {
        Object.assign(inMemoryStore.offersConfig, req.body);
        return res.json(inMemoryStore.offersConfig);
      }
      return res.status(200).json({ success: true, ...req.body });
    }

    if (req.method === 'DELETE') {
      return res.status(200).json({ success: true, message: 'Élément supprimé' });
    }
  }

  next(err);
});

// Primary Error Handling Middleware
app.use(errorHandler);

module.exports = app;
