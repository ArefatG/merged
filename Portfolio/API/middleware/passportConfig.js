import express from 'express';
import passport from 'passport';
import { register, login, logout, getUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/jwt.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, getUser);

// Google OAuth routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/'); // Redirect to your desired route after successful login
    }
);

export default router;