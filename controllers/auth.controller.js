import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import { sendWelcomeEmail } from '../services/emailService.js';

export const signUp=async(req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();

    try{     //logic to create new user
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email});

        if(existingUser){
            const error=new Error('User already exists');
            error.statusCode=409;
            throw error;
        }

    // hash password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser=await User.create([{name,email,password:hashedPassword}],{session});
    const token=jwt.sign({userId:newUser[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
        await session.commitTransaction();
        session.endSession();   

        // Send welcome email (don't wait for it)
        sendWelcomeEmail(email, name).catch(err => 
            console.error('Welcome email failed:', err)
        );

        res.status(201).json({
            success:true,
            message:'User created successfully',
            data:{
                token,
                user:{
                    _id: newUser[0]._id,
                    name: newUser[0].name,
                    email: newUser[0].email,
                    createdAt: newUser[0].createdAt,
                    updatedAt: newUser[0].updatedAt
                },
            }
        });

    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

         return res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
        });

    } catch (error) {
        next(error);
    }
}
export const signOut=async(req,res,next)=>{

}