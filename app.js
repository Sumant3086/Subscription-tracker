import express from 'express';
import cookieParser from 'cookie-parser';

import {PORT} from './config/env.js';

import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.route.js';
import userRouter from './routes/user.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middleswares/error.middleware.js';
import { generalLimiter } from './middleswares/rateLimiter.middleware.js';
import { startCronJobs } from './services/cronService.js';

const app = express();

// Apply rate limiting to all requests
app.use(generalLimiter);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subscriptionRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Tracker API!');
});

// 404 handler - must be after all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error middleware must be last
app.use(errorMiddleware);

console.log('PORT from env:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);;

app.listen(PORT, async() => {
  console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
  await connectToDatabase();
  
  // Start cron jobs for email reminders
  startCronJobs();
});

export default app;