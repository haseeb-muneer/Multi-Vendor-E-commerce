const express = require("express");
const Event =require("../model/EventModel");
const {upload}=require("../multer");
const router=express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Shop=require("../model/ShopModel");
const { isSeller } = require("../middleware/auth");
router.post("/create-event" , upload.array("images") , catchAsyncErrors(async(req,res,next)=>{
    try{
   const shopId=req.body.shopId;
   const shop=await Shop.findById(shopId);
   if(!shop){
    return next(new ErrorHandler("Shop is invalid!" , 400));
   }else{
    const files=req.files;
    const imagesUrls=files.map((file)=>`${file.filename}`);
    const eventData=req.body;
    eventData.images=imagesUrls;
    eventData.shop=shop;
    const product=await Event.create(eventData);  //th product is objectr that is sent to frontend
    res.status(201).json({
        success:true,
        product,
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
            eventData.images.forEach((imageUrl)=>{
              const filename=imageUrl;
              const filePath=`uploads/${filename}`;
              fs.unlink(filePath , (err)=>{
                console.log(err);
              })
            })
      const event = await Event.findByIdAndDelete(productId);

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
