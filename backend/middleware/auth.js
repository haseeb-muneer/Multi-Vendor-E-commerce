const ErrorHandler=require("../utils/ErrorHandler");
const catchAsyncErrors=require("./catchAsyncErrors");
const jwt=require("jsonwebtoken");
const User=require("../model/UserModel");
const Shop=require("../model/ShopModel");

exports.isAuthenticated=catchAsyncErrors(async (req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("please login to continue!" , 401));
    }
    const decode= jwt.verify(token , process.env.JWT_SECRET);
     req.user=await User.findById(decode.id);
    if(!req.user){
        return next(new ErrorHandler("User does not exist" ,400 ));
    }
    next();
})
exports.isSeller=catchAsyncErrors(async (req,res,next)=>{
    const {seller_token}=req.cookies;
    if(!seller_token){
        return next(new ErrorHandler("please login to continue!" , 401));
    }
    const decode= jwt.verify(seller_token , process.env.JWT_SECRET);
     req.seller=await Shop.findById(decode.id);
    if(!req.seller){
        return next(new ErrorHandler("User does not exist" ,400 ));
    }
    next();
})