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
        max:[1000, 'Price must be smaller than 1000']  
    },
    currency:{
        type:String,
        enum:['INR','EUR','USD'],
        default:'INR'
    },
    frequency:{
        type:String,
        enum:['daily','monthly','yearly']
    },
    category:{
        type:String,
        enum:['sports','news','tech'], 
        required:true
    },
    payment:{
        type:String,
        required:true,
        trim:true 
    },
    status:{
        type:String,
        enum:['active','cancle','expired'],
        default:'active' 
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator:(val)=>val<=new Date(),
            message:'Start date must be in the past',
        }
    },
    renewalDate:{
        type:Date,
        required:true,
        validate:{
            validator:function(val){
                return val>this.startDate;
            }, 
            message:'Renewal date must be in the past',
        }
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required:true,
        index:true,
    }
},{timestamps:true});

subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriods={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        };
        this.renewalDate=new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriods[this.frequency]);
    }
    if(this.renewalDate<new Date()){
        this.status='expired';
    }
    next();
})
const Subscription=mongoose.model('Subscription',subscriptionSchema);
export default Subscription;