const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const inMemoryStore = require('../data/inMemoryStore');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_tres_long_et_securise_123456";

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // On privilégie le Bearer Token dans le header Authorization pour l'Access Token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ message: 'Non autorisé, token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (mongoose.connection.readyState === 1) {
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch {
        req.user = inMemoryStore.findUserById(decoded.id);
      }
    } else {
      req.user = inMemoryStore.findUserById(decoded.id);
    }
    
    if (!req.user) {
      // Create minimal user from decoded payload if id matched standard token
      if (decoded.id && decoded.role) {
        req.user = {
          _id: decoded.id,
          role: decoded.role,
          email: decoded.role === 'ADMIN' ? 'admin@cosmeticsshop.com' : 'client@cosmeticsshop.com',
          firstName: decoded.role === 'ADMIN' ? 'Super' : 'Client',
          lastName: decoded.role === 'ADMIN' ? 'Admin' : 'Nature'
        };
      } else {
        console.error(`[AUTH ERROR] User not found for ID from token: ${decoded.id}`);
        return res.status(401).json({ message: 'Utilisateur non trouvé.' });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
});

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs.' });
  }
};
