import Subscription from '../models/subscription.model.js';

// Get all subscriptions
export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user._id }).populate('userId', 'name email');
        
        return res.status(200).json({ 
            success: true, 
            data: subscriptions 
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
            { status: 'cancle' },
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