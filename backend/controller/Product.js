const express=require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product=require("../model/ProductModel");
const {upload}=require("../multer");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const ErrorHandler = require('../utils/ErrorHandler');
const Shop=require("../model/ShopModel");
const fs = require('fs');
const Order=require("../model/order");
const cloudinary = require("cloudinary");
router.post("/create-product" , upload.array("images") , catchAsyncErrors(async(req,res,next)=>{
    try{
   const shopId=req.body.shopId;
   const shop=await Shop.findById(shopId);
   if(!shop){
    return next(new ErrorHandler("Shop is invalid!" , 400));
   }else{
    const files=req.files;
    
    // Upload all images to Cloudinary
    const imagesUrls = [];
    for (const file of files) {
      const fileString = file.buffer.toString("base64");
      const dataURI = `data:${file.mimetype};base64,${fileString}`;
      
      const myCloud = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "E-Shop/products",
        resource_type: "auto",
      });
      imagesUrls.push(myCloud.secure_url);
    }
    
    const productData=req.body;
    productData.images=imagesUrls;
    productData.shop=shop;
    const product=await Product.create(productData);
    res.status(201).json({
        success:true,
        product,
    })
   }
    }catch(error){
        return next(new ErrorHandler(error,400))
    }
}))
// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const productData=await Product.findById(productId);
      
      // Delete images from Cloudinary
      for (const imageUrl of productData.images) {
        if (imageUrl.includes("cloudinary")) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          try {
            await cloudinary.v2.uploader.destroy(publicId);
          } catch (error) {
            console.error("Error deleting image from Cloudinary:", error.message);
          }
        }
      }
      
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }
      res.status(201).json({
        success:true,
        message:"Product deleted successfully",
      })
    }catch(error){
        return next(new ErrorHandler(error, 400));
    }
  })
);   
//get all products simple
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.put("/create-new-review" , isAuthenticated , catchAsyncErrors(async (req,res,next)=>{
  try{
    const { user, rating, comment, productId, orderId } = req.body;
    const product=await Product.findById(productId);
     const review = {
        user,
        rating,
        comment,
        productId,
      };
      const isReviewed=product.reviews.find((rev)=>rev.user._id===req.user._id);
      if(isReviewed){
        product.review.forEach((rev)=>{
          if(rev.user._id===req.user._id){
            (rev.rating=rating),(rev.comment=comment) , (rev.user=user);
          }
        })
      }else{
        product.reviews.push(review);
        }
      // calculate average rating of a product from all the reviews of that product
      let avg=0;
      product.reviews.forEach((rev)=>{
        avg+=rev.rating;
      })
      product.ratings=avg/product.reviews.length;
      await product.save({validateBeforeSave:false});
      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

         res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });

  }catch(error){
   return next(new ErrorHandler(error, 400));
  }
}))
module.exports=router;
