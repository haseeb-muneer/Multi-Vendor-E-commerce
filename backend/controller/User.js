const express=require('express');
const path=require("path");
const router=express.Router();
const {upload}=require("../multer");
const ErrorHandler=require("../utils/ErrorHandler");
const User=require("../model/UserModel");
const jwt=require("jsonwebtoken");
const fs = require('fs');
const sendMail=require("../utils/sendMail");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken=require("../utils/sendToken");
const { isAuthenticated } = require('../middleware/auth');
const cloudinary = require("cloudinary");
router.post("/create-user" , upload.single("file") , async (req,res , next)=>{
    console.log(req.body);
    console.log(req.file);
    console.log(process.env.ACTIVATION_SECRET);
    const {name , email , password}=req.body;
    const userEmail=await User.findOne({email});
    console.log(userEmail);
    if(userEmail){
        const filename=req.file.filename;
        const filePath=`uploads/${filename}`;
        fs.unlink(filePath , (err)=>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error deleting file"});
            }
        })
        return next(new ErrorHandler("User already exist" , 400));
        
    }
    const filename=req.file.filename;
    const fileurl=path.join(filename);
    console.log(fileurl);
    const user={
        fullName:name,
        email:email,
        password:password,
        avatar:fileurl,
    }
    const createActivationToken=(user)=>{  //create activation token
   return jwt.sign(user , process.env.ACTIVATION_SECRET,{
        expiresIn:"5m",
    })
}
  const activationToken=createActivationToken(user);
  const activationurl=`${process.env.FRONTEND_URL}/activation/${activationToken}`;
  try{
    await sendMail({
        email:user.email,
        subject:"Activate your account",
        message:`Hello ${user.fullName}.please click on the link to activate your account: ${activationurl}`,
    })
    res.status(201).json({
        success:true,
        message:`please check your email ${user.email} to activate your account`,
    })
  }catch(err){
    next(new ErrorHandler(err.message , 500));
  }
  
})
router.post("/activation",catchAsyncErrors(async (req,res,next)=>{
 try{
  const {activation_token}=req.body;
  console.log(`token received = ${activation_token}`);
  const newUser=jwt.verify(activation_token , process.env.ACTIVATION_SECRET);
  if(!newUser){
      return next(new ErrorHandler("Invalid token" , 400));
  }
  const {fullName , email , password , avatar}=newUser;
  console.log(newUser);
  const existedUser=await User.findOne({email});
  console.log(`user existed : ${existedUser}`);
  if(existedUser){
    
    return next(new ErrorHandler("User already exist" , 400));
  }
  try{
  const user=await User.create({
      fullName , 
      email , 
      password , 
      avatar,
  })
  console.log(`user is created in adatabase :${user}`);
  sendToken(user , 201 , res);
}catch(error){
    console.log(error);
}
 }catch(error){
   return next(new ErrorHandler(error.message , 500));
 }
}))
router.post("/login-user",catchAsyncErrors(async(req,res,next)=>{
    try{
    const {email , password}=req.body;
    if(!email || !password){
        return next(new ErrorHandler("please provide the all fields!" , 400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User does not exist!" , 400));
    }
    const isPasswordValid=await user.comparePassword(password);
    if(!isPasswordValid){
        return next(new ErrorHandler("please provide the correct information!" , 400));
    }
    sendToken(user , 201 , res)
    }catch(error){
        return next(new ErrorHandler(error.message , 500));
    }
}))
router.get("/getuser" , isAuthenticated , catchAsyncErrors(async (req,res ,next)=>{
    try{
        console.log(req.user);
        const user=await User.findById(req.user.id);
        console.log(user);
    if(!user){
        return next(new ErrorHandler("User does not exist" , 400));
    }
    return res.status(200).json({
        success:true , 
        user,
    })
    }catch(error){
        return next(new ErrorHandler(error.message , 500));
    }
}))
router.get("/logout" , isAuthenticated , catchAsyncErrors(async (req,res,next)=>{
    try{
    res.cookie("token" , null , {
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(201).json({
        success:true,
        message:"Log out successfull!",
    })
    }catch(error){
        return next(new ErrorHandler(error.message , 500))
    }
}));
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, fullName } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
        // console.log("user does not exist");
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next( new ErrorHandler("Please provide the correct information", 400) );
        // console.log("password is not correct");
      }

      user.fullName = fullName;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
     return next(new ErrorHandler(error.message, 500));
//    console.log(error);
    }
  })
);
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    const existUser = await User.findById(req.user.id);
    
    // Delete old avatar from Cloudinary if exists
    if (existUser.avatar && existUser.avatar.includes("cloudinary")) {
      const publicId = existUser.avatar.split("/").pop().split(".")[0];
      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting old avatar:", error.message);
      }
    }

    // Upload new avatar to Cloudinary
    if (!req.file) {
      return next(new ErrorHandler("No file provided", 400));
    }

    const fileString = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${fileString}`;

    const myCloud = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "E-Shop/avatars",
      resource_type: "auto",
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: myCloud.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  })
);
// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find( 
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
 
// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports=router;