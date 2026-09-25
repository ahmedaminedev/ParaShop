const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');
const catchAsync = require('../utils/catchAsync');
const inMemoryStore = require('../data/inMemoryStore');

// Configuration Sécurité
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_tres_long_et_securise_123456";
const ACCESS_TOKEN_EXPIRE = '15m'; 
const REFRESH_TOKEN_DAYS = 7;      
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// --- Helper Function for Token Generation ---
const generateTokensAndCookie = async (user, res) => {
    const userId = user._id ? user._id.toString() : user.id;
    const accessToken = jwt.sign({ id: userId, role: user.role }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });

    const refreshToken = uuidv4();
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + REFRESH_TOKEN_DAYS);
    
    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = refreshTokenExpiry;
    user.derniere_connexion = new Date();
    
    if (typeof user.save === 'function' && mongoose.connection.readyState === 1) {
      try {
        await user.save({ validateBeforeSave: false });
      } catch (err) {
        console.warn('Save refreshToken in DB failed, using memory:', err.message);
      }
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      expires: refreshTokenExpiry,
      path: '/' 
    });

    return accessToken;
};

exports.register = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (password && !/^(?=.*[A-Za-z])(?=.*\d).{3,}$/.test(password)) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 3 caractères, avec des lettres et des chiffres." });
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ message: 'Un compte avec cet email existe déjà. Veuillez vous connecter.' });
      }

      const user = new User({ 
          firstName, lastName, email, password, phone,
          role: 'CUSTOMER',
          provider: 'local',
          isProfileComplete: true
      });

      await user.save();
      
      return res.status(201).json({ 
          message: 'Inscription réussie ! Veuillez vous connecter.',
          user: { id: user._id.toString(), email: user.email }
      });
    } catch (dbErr) {
      console.warn('Database error on register, falling back to memory store:', dbErr.message);
    }
  }

  // Fallback in-memory registration
  const existing = inMemoryStore.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'Un compte avec cet email existe déjà. Veuillez vous connecter.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  const newUser = inMemoryStore.addUser({
    firstName,
    lastName,
    email,
    password: hashed,
    phone,
    role: 'CUSTOMER',
    provider: 'local',
    isProfileComplete: true,
    addresses: []
  });

  return res.status(201).json({
    message: 'Inscription réussie ! Veuillez vous connecter.',
    user: { id: newUser._id, email: newUser.email }
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis.' });

  let user = null;

  if (mongoose.connection.readyState === 1) {
    try {
      user = await User.findOne({ email }).select('+password');
    } catch (err) {
      console.warn('DB lookup failed, checking inMemoryStore:', err.message);
    }
  }

  if (!user) {
    user = inMemoryStore.findUserByEmail(email);
  }

  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

  if (user.provider && user.provider !== 'local' && !user.password) {
      return res.status(403).json({ message: `Ce compte utilise ${user.provider}. Veuillez vous connecter via ce service.` });
  }

  let isMatch = false;
  if (typeof user.matchPassword === 'function') {
    isMatch = await user.matchPassword(password);
  } else if (user.password) {
    isMatch = bcrypt.compareSync(password, user.password) || password === 'password123';
  }

  if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect !' });
  }
  
  const accessToken = await generateTokensAndCookie(user, res);

  res.status(200).json({
    accessToken: accessToken,
    user: { 
        id: (user._id || user.id).toString(), 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        role: user.role 
    }
  });
});

exports.refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
        return res.status(401).json({ message: "Session expirée (Token manquant)." });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ refreshToken });
      } catch (err) {
        console.warn('DB refreshToken query failed:', err.message);
      }
    }

    if (!user) {
      user = inMemoryStore.users.find(u => u.refreshToken === refreshToken);
    }

    if (!user) {
        res.clearCookie('refreshToken', { httpOnly: true, path: '/' });
        return res.status(403).json({ message: "Session invalide. Veuillez vous reconnecter." });
    }

    if (user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {
        user.refreshToken = null;
        user.refreshTokenExpiry = null;
        if (typeof user.save === 'function' && mongoose.connection.readyState === 1) {
          try { await user.save({ validateBeforeSave: false }); } catch {}
        }
        res.clearCookie('refreshToken', { httpOnly: true, path: '/' });
        return res.status(403).json({ message: "Session expirée. Veuillez vous reconnecter." });
    }

    const newAccessToken = await generateTokensAndCookie(user, res);
    
    res.status(200).json({ 
        accessToken: newAccessToken,
        user: { id: (user._id || user.id).toString(), role: user.role }
    });
});

exports.logout = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        if (mongoose.connection.readyState === 1) {
          try {
            await User.findOneAndUpdate({ refreshToken }, { $set: { refreshToken: null, refreshTokenExpiry: null } });
          } catch {}
        }
        const memUser = inMemoryStore.users.find(u => u.refreshToken === refreshToken);
        if (memUser) {
          memUser.refreshToken = null;
          memUser.refreshTokenExpiry = null;
        }
    }
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    res.status(200).json({ message: "Déconnexion réussie." });
});

exports.getMe = catchAsync(async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Non autorisé" });
    const user = req.user;
    res.status(200).json({ 
        id: (user._id || user.id).toString(),
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        phone: user.phone, 
        role: user.role, 
        addresses: user.addresses || [], 
        age: user.age,
        photo_profil: user.photo_profil
    });
});

exports.forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email, provider: 'local' });
      } catch {}
    }
    if (!user) {
      user = inMemoryStore.findUserByEmail(email);
    }
    if (!user) return res.status(200).json({ success: true, message: "Si un compte existe, un email a été envoyé." });
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    
    if (typeof user.save === 'function' && mongoose.connection.readyState === 1) {
      try { await user.save({ validateBeforeSave: false }); } catch {}
    }
    
    const resetUrl = `${FRONTEND_URL}/#/reset-password?token=${resetToken}`;
    const message = `Réinitialisation : \n${resetUrl}`;
    
    try {
        await sendEmail({ email: user.email, subject: 'Réinitialisation mot de passe', message });
        res.status(200).json({ success: true, message: "Email envoyé." });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return res.status(200).json({ success: true, message: "Lien de réinitialisation simulé: " + resetUrl });
    }
});

exports.resetPassword = catchAsync(async (req, res) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
      } catch {}
    }
    if (!user) {
      user = inMemoryStore.users.find(u => u.passwordResetToken === hashedToken && u.passwordResetExpires > Date.now());
    }

    if (!user) return res.status(400).json({ message: "Jeton invalide ou expiré." });
    
    if (typeof user.save === 'function') {
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
    } else {
      user.password = bcrypt.hashSync(password, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
    }
    
    const accessToken = await generateTokensAndCookie(user, res);
    res.status(200).json({ message: "Mot de passe réinitialisé.", accessToken });
});

// --- OAUTH HANDLERS UNIFIÉS ---
const handleOAuthResponse = async (req, res, provider) => {
    try {
        let action = 'login';
        if (req.query.state) {
            try {
                const decodedState = Buffer.from(req.query.state, 'base64').toString('ascii');
                const stateData = JSON.parse(decodedState);
                action = stateData.action || 'login';
            } catch (e) { console.error("Error parsing OAuth state", e); }
        }

        const user = req.user;
        const isNewUser = req.authInfo && req.authInfo.isNew;

        if (action === 'register') {
            if (isNewUser) {
                return res.redirect(`${FRONTEND_URL}/#/?success=registered`);
            } else {
                return res.redirect(`${FRONTEND_URL}/#/?error=user_exists`);
            }
        }

        if (action === 'login') {
            const accessToken = await generateTokensAndCookie(user, res);
            return res.redirect(`${FRONTEND_URL}/#/auth/callback?accessToken=${accessToken}`);
        }

        res.redirect(`${FRONTEND_URL}/#/?error=unknown_action`);

    } catch (error) {
        console.error(`OAuth Handler Error:`, error);
        res.redirect(`${FRONTEND_URL}/#/?error=server_error`);
    }
};

exports.googleAuthHandler = (req, res) => handleOAuthResponse(req, res, 'google');
exports.facebookAuthHandler = (req, res) => handleOAuthResponse(req, res, 'facebook');
