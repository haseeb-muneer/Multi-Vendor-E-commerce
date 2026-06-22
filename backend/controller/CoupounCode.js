const express = require("express");
const router=express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Shop=require("../model/ShopModel");
const { isSeller } = require("../middleware/auth");
const CoupounCode=require("../model/CoupounModel");
router.post("/create-coupoun-code",catchAsyncErrors(async (req,res,next)=>{
   try{
     const isCoupounExist=await CoupounCode.find({
        name:req.body.name,
    });
    if(isCoupounExist.length!==0){
        return next(new ErrorHandler("Coupone Code already exist" , 400));
    }
    const coupounCode=await CoupounCode.create(req.body);
    console.log(`coupoun code is ${coupounCode}`);
    res.status(201).json({
        success:true,
        coupounCode,
    })
   }catch(error){
    return next(new ErrorHandler(error , 400));
   }
}))
router.get("/get-coupoun-code/:id" , isSeller , catchAsyncErrors(async(req,res,next)=>{
   try{
   const coupoun=await CoupounCode.find({
    shopId:
        req.seller.id
   });
   console.log(`coupoun is here ${coupoun}`);
   if(!coupoun){
     return next(new ErrorHandler("No coupoun found with this id",400 ));
   }
   res.json({
    success:true,
    coupoun,
   })
   }catch(error){
     return next(new ErrorHandler(error , 400));
   }

}))
// get coupon code value by its name
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
module.exports=router;