import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'User name needed'],
        trim:true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type:String,
        required:[true, 'User mail needed'],
        trim:true,
        unique:true,
        lowercase:true,
        match:[/.+@.+\..+/,'Enter valid email'],
    },
    password:{
        type:String,
        required:[true, 'User password needed'], 
        minLength:6, 
    }
},{timestamps:true});

const User=mongoose.model('User',userSchema);
export default User;