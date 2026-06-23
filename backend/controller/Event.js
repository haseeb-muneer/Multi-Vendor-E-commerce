const express = require("express");
const Event =require("../model/EventModel");
const {upload}=require("../multer");
const router=express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Shop=require("../model/ShopModel");
const { isSeller } = require("../middleware/auth");
const cloudinary = require("cloudinary");
router.post("/create-event" , upload.array("images") , catchAsyncErrors(async(req,res,next)=>{
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
        folder: "E-Shop/events",
        resource_type: "auto",
      });
      imagesUrls.push(myCloud.secure_url);
    }
    
    const eventData=req.body;
    eventData.images=imagesUrls;
    eventData.shop=shop;
    const event=await Event.create(eventData);
    res.status(201).json({
        success:true,
        event,
    })
   }
    }catch(error){
        return next(new ErrorHandler(error,400))
    }
}));
// get all products of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});



// delete events
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const eventData=await Event.findById(eventId);
      
      // Delete images from Cloudinary
      for (const imageUrl of eventData.images) {
        if (imageUrl.includes("cloudinary")) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          try {
            await cloudinary.v2.uploader.destroy(publicId);
          } catch (error) {
            console.error("Error deleting image from Cloudinary:", error.message);
          }
        }
      }
      
      const event = await Event.findByIdAndDelete(eventId);

      if (!event) {
        return next(new ErrorHandler("Event is not found with this id", 404));
      }
      res.status(201).json({
        success:true,
        message:"Event deleted successfully",
      })
    }catch(error){
        return next(new ErrorHandler(error, 400));
    }
  })
);   
module.exports=router;
