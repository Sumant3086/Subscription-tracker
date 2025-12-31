import mongoose from "mongoose";
import {DB_URI, NODE_ENV} from '../config/env.js';
if(!DB_URI){
    throw new Error('Please provide correct MongoDB_Url');
}
const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI); 
    }catch(error){
        console.error('Error connect Db: ',error);
        process.exit(1);
    }
}
export default connectToDatabase;