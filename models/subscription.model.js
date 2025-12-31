import mongoose from 'mongoose';
const subscriptionSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Subscription name needed'],
        trim:true,
        minLength:2,
        maxLength:50,
    }, 
    price:{
        type:Number,
        required:[true, 'Subscription price needed'], 
        min:[0,' Price must be greater than 0'],
        max:[10000, 'Price must be smaller than 10000']  
    },
    currency:{
        type:String,
        enum:['INR','EUR','USD'],
        default:'USD'
    },
    frequency:{
        type:String,
        enum:['daily','monthly','yearly'],
        required:true
    },
    category:{
        type:String,
        enum:['sports','news','tech','entertainment','productivity','health','finance'], 
        required:true
    },
    payment:{
        type:String,
        required:true,
        trim:true 
    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default:'active' 
    },
    startDate:{
        type:Date,
        required:true
    },
    renewalDate:{
        type:Date
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required:true,
        index:true,
    }
},{timestamps:true});

subscriptionSchema.pre('save', async function() {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
});

const Subscription=mongoose.model('Subscription',subscriptionSchema);
export default Subscription;