import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        console.log('Token received:', token);
        console.log('JWT_SECRET being used:', JWT_SECRET);

        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token decoded successfully:', decoded);

        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        req.user = user;

        next();

    } catch (error) {
        console.log('Auth error:', error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

export default authorize;