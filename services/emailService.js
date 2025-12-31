import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } from '../config/env.js';

// Create transporter
const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Send renewal reminder email
export const sendRenewalReminder = async (userEmail, userName, subscription) => {
    try {
        // Skip if email not configured
        if (!EMAIL_USER || !EMAIL_PASS) {
            console.log('Email not configured - skipping renewal reminder');
            return;
        }

        const renewalDate = new Date(subscription.renewalDate).toLocaleDateString();
        
        const mailOptions = {
            from: EMAIL_FROM,
            to: userEmail,
            subject: `🔔 Subscription Renewal Reminder - ${subscription.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Hi ${userName}! 👋</h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #007bff; margin-top: 0;">Subscription Renewal Reminder</h3>
                        
                        <p><strong>Service:</strong> ${subscription.name}</p>
                        <p><strong>Price:</strong> ${subscription.currency} ${subscription.price}</p>
                        <p><strong>Renewal Date:</strong> ${renewalDate}</p>
                        <p><strong>Frequency:</strong> ${subscription.frequency}</p>
                        <p><strong>Category:</strong> ${subscription.category}</p>
                    </div>
                    
                    <p>Your subscription will renew soon. Make sure you have sufficient balance in your account.</p>
                    
                    <div style="margin: 30px 0;">
                        <p style="color: #666; font-size: 14px;">
                            This is an automated reminder from your Subscription Tracker.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Renewal reminder sent to ${userEmail} for ${subscription.name}`);
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Send welcome email
export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        // Skip if email not configured
        if (!EMAIL_USER || !EMAIL_PASS) {
            console.log('Email not configured - skipping welcome email');
            return;
        }

        const mailOptions = {
            from: EMAIL_FROM,
            to: userEmail,
            subject: '🎉 Welcome to Subscription Tracker!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome ${userName}! 🎉</h2>
                    
                    <p>Thank you for joining Subscription Tracker! We're excited to help you manage your subscriptions.</p>
                    
                    <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #28a745; margin-top: 0;">What you can do:</h3>
                        <ul>
                            <li>📝 Add and manage your subscriptions</li>
                            <li>🔔 Get renewal reminders</li>
                            <li>📊 Track your spending</li>
                            <li>⏰ Never miss a payment again</li>
                        </ul>
                    </div>
                    
                    <p>Start by adding your first subscription and let us handle the rest!</p>
                    
                    <p style="color: #666; font-size: 14px;">
                        Happy tracking! 🚀<br>
                        The Subscription Tracker Team
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${userEmail}`);
        
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};