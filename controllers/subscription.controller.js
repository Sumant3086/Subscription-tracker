import Subscription from '../models/subscription.model.js';

// Get all subscriptions with analytics
export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user._id }).populate('userId', 'name email');
        
        // Calculate analytics
        const analytics = {
            total: subscriptions.length,
            active: subscriptions.filter(sub => sub.status === 'active').length,
            expired: subscriptions.filter(sub => sub.status === 'expired').length,
            cancelled: subscriptions.filter(sub => sub.status === 'cancelled').length,
            totalMonthlySpend: subscriptions
                .filter(sub => sub.status === 'active')
                .reduce((total, sub) => {
                    if (sub.frequency === 'monthly') return total + sub.price;
                    if (sub.frequency === 'yearly') return total + (sub.price / 12);
                    if (sub.frequency === 'daily') return total + (sub.price * 30);
                    return total;
                }, 0)
        };
        
        return res.status(200).json({ 
            success: true, 
            data: subscriptions,
            analytics
        });
    } catch (error) {
        next(error);
    }
}

// Get single subscription
export const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        }).populate('userId', 'name email');
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }
        
        return res.status(200).json({ 
            success: true, 
            data: subscription 
        });
    } catch (error) {
        next(error);
    }
}

// Create subscription
export const createSubscription = async (req, res, next) => {
    try {
        const { name, price, currency, frequency, category, payment, startDate } = req.body;
        
        const subscription = await Subscription.create({
            name,
            price,
            currency,
            frequency,
            category,
            payment,
            startDate,
            userId: req.user._id
        });
        
        return res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

// Update subscription
export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }
        
        return res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

// Delete subscription
export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }
        
        return res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

// Get upcoming renewals
export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const subscriptions = await Subscription.find({
            userId: req.user._id,
            renewalDate: { $lte: nextWeek },
            status: 'active'
        }).sort({ renewalDate: 1 });
        
        return res.status(200).json({
            success: true,
            message: `${subscriptions.length} subscriptions renewing in next 7 days`,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
}

// Cancel subscription
export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status: 'cancelled' },
            { new: true }
        );
        
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }
        
        return res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

// Get subscription analytics
export const getAnalytics = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user._id });
        
        const analytics = {
            totalSubscriptions: subscriptions.length,
            activeSubscriptions: subscriptions.filter(sub => sub.status === 'active').length,
            expiredSubscriptions: subscriptions.filter(sub => sub.status === 'expired').length,
            cancelledSubscriptions: subscriptions.filter(sub => sub.status === 'cancelled').length,
            
            // Spending analytics
            monthlySpend: subscriptions
                .filter(sub => sub.status === 'active')
                .reduce((total, sub) => {
                    if (sub.frequency === 'monthly') return total + sub.price;
                    if (sub.frequency === 'yearly') return total + (sub.price / 12);
                    if (sub.frequency === 'daily') return total + (sub.price * 30);
                    return total;
                }, 0),
                
            yearlySpend: subscriptions
                .filter(sub => sub.status === 'active')
                .reduce((total, sub) => {
                    if (sub.frequency === 'yearly') return total + sub.price;
                    if (sub.frequency === 'monthly') return total + (sub.price * 12);
                    if (sub.frequency === 'daily') return total + (sub.price * 365);
                    return total;
                }, 0),
                
            // Category breakdown
            categoryBreakdown: subscriptions.reduce((acc, sub) => {
                acc[sub.category] = (acc[sub.category] || 0) + 1;
                return acc;
            }, {}),
            
            // Currency breakdown
            currencyBreakdown: subscriptions.reduce((acc, sub) => {
                acc[sub.currency] = (acc[sub.currency] || 0) + sub.price;
                return acc;
            }, {})
        };
        
        return res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        next(error);
    }
}