import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import { isValidPassword } from "../utils/validator.js";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewars/error.js";
import validator from "validator";


export const login = async (req,res, next)=>{
    try {
        const { email , password} = req.body;
        
    const user = await User.findOne({ email }).select("+password");
     
    if(!user) return next(new ErrorHandler('invalid Email or Password', 400));
 
   
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return next(new ErrorHandler('invalid Email or Password', 400));
   

    sendCookie(user, res, `welcome back ${user.name}`, 200);

    } catch (error) {
        next(error);    
    }
};



export const registerUser = async(req,res,next)=>{
   try {
    const {name, email, password}= req.body;
    if (!validator.isEmail(email)) {
        return next(new ErrorHandler('invalid email format',400))
    }
    if (!isValidPassword(password)) {
        return next(new ErrorHandler('please type at least 8 characters, containing both letters and numbers',400))
    }

    let user = await User.findOne({email}).maxTimeMS(20000);
   
if(user) return next(new ErrorHandler('user already exist',404));
const hashedPassword = await bcrypt.hash(password, 10);
 
    user= await User.create({name, email, password: hashedPassword}); 
 
   sendCookie(user,res,'Registered Succesfully',201);
   
   } catch (error) {
    next(error);
   }
};
   
 

export const getUserProfile =  (req,res)=>{
    
    res.status(200).json({
        success: true,
        user : req.user,
    });
};

    


export const logout =(req,res)=>{
    res.status(200).cookie('token','',{expires : new Date(Date.now()),
        sameSite: process.env.NODE_ENV=== "Development" ? "lax" : "none", 
        secure : process.env.NODE_ENV=== "Development" ? false :true,}).json({
        success: true,
        user : req.user,
    });
}
