import {Router} from 'express';
import authorize from '../middleswares/auth.middleware.js';
import { 
    getSubscriptions, 
    getSubscription, 
    createSubscription, 
    updateSubscription, 
    deleteSubscription, 
    getUpcomingRenewals, 
    cancelSubscription,
    getAnalytics 
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

// Apply authentication to all routes
subscriptionRouter.use(authorize);

// Main CRUD routes
subscriptionRouter.get('/', getSubscriptions);
subscriptionRouter.get('/analytics', getAnalytics);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);
subscriptionRouter.get('/:id', getSubscription);
subscriptionRouter.post('/', createSubscription);
subscriptionRouter.put('/:id', updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);
subscriptionRouter.patch('/:id/cancel', cancelSubscription);

export default subscriptionRouter;