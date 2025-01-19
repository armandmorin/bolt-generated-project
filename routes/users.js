import express from 'express';
    import jwt from 'jsonwebtoken';
    import bcrypt from 'bcryptjs';
    import User from '../models/User.js';

    const router = express.Router();

    // Register
    router.post('/register', async (req, res) => {
      // Registration logic
    });

    // Login
    router.post('/login', async (req, res) => {
      // Login logic
    });

    export default router;
