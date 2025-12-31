import cron from 'node-cron';
import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';
import { sendRenewalReminder } from './emailService.js';

// Check for upcoming renewals and send reminders
const checkRenewals = async () => {
    try {
        console.log('🔍 Checking for upcoming renewals...');
        
        // Get subscriptions renewing in next 3 days
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        
        const upcomingRenewals = await Subscription.find({
            renewalDate: { 
                $gte: new Date(), 
                $lte: threeDaysFromNow 
            },
            status: 'active'
        }).populate('userId', 'name email');
        
        console.log(`📧 Found ${upcomingRenewals.length} upcoming renewals`);
        
        // Send reminder emails
        for (const subscription of upcomingRenewals) {
            if (subscription.userId && subscription.userId.email) {
                await sendRenewalReminder(
                    subscription.userId.email,
                    subscription.userId.name,
                    subscription
                );
            }
        }
        
    } catch (error) {
        console.error('❌ Error in renewal check:', error);
    }
};

// Update expired subscriptions
const updateExpiredSubscriptions = async () => {
    try {
        console.log('🔄 Updating expired subscriptions...');
        
        const result = await Subscription.updateMany(
            { 
                renewalDate: { $lt: new Date() },
                status: 'active'
            },
            { status: 'expired' }
        );
        
        console.log(`📊 Updated ${result.modifiedCount} expired subscriptions`);
        
    } catch (error) {
        console.error('❌ Error updating expired subscriptions:', error);
    }
};

// Start cron jobs
export const startCronJobs = () => {
    console.log('⏰ Starting cron jobs...');
    
    // Check renewals every day at 9 AM
    cron.schedule('0 9 * * *', () => {
        console.log('🕘 Daily renewal check started');
        checkRenewals();
    });
    
    // Update expired subscriptions every hour
    cron.schedule('0 * * * *', () => {
        console.log('🕐 Hourly expired subscription update');
        updateExpiredSubscriptions();
    });
    
    // For testing - check every 5 minutes (remove in production)
    // cron.schedule('*/5 * * * *', () => {
    //     console.log('🧪 Test renewal check');
    //     checkRenewals();
    // });
    
    console.log('✅ Cron jobs started successfully');
};