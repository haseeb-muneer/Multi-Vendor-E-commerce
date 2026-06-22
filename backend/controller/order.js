const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/ShopModel");
const Product = require("../model/ProductModel");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();
       // check of the map contain the item with shopid if contain then push item against that shopid and if not contain
       //shopid then create shopid and then set item against that shopid
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({"user._id": req.params.userId}).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
        console.log("ORDER FETCH ERROR:", error.message); // 👈 add this
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// router.put("/update-order-status/:id", isSeller , catchAsyncErrors(async (req,res, next)=>{
//   try{
//    const order=await Order.findById(req.params.id);
//    if(!order){
//     return next(new ErrorHandler("Order not found with this id" , 400));
//    }
//    if(order.status==="Transferred to delivery partner"){
//     order.cart.forEach(async (order)=>{
//       await updateOrder(order._id , order.qty);
//     })
//    }
//    order.status = req.body.status;
//     if (req.body.status === "Delivered") {
//         order.deliveredAt = Date.now();
//         order.paymentInfo.status = "Succeeded";
//         const serviceCharge = order.totalPrice * .10;
//         await updateSellerInfo(order.totalPrice - serviceCharge);
//       }
//        await order.save({ validateBeforeSave: false });

//       res.status(200).json({
//         success: true,
//         order,
//       });
//       async function updateOrder(id, qty){
//   const product=await Product.findById(id);
//   product.stock-=qty;
//   product.sold_out+=qty;
//   await product.save({validateBeforeSave:false}) ;
// }
// async function updateSellerInfo(amount){
//   const seller=await Shop.findById(req.seller._id);
//   seller.availableBalanace=amount;
//   await seller.save();
// }

//   }catch(error){
//     return next(new ErrorHandler(error.message, 500));
//   }
// }))
// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        console.log("delivered is axcuting")
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * .10;
        await updateSellerInfo(order.totalPrice - serviceCharge);
console.log("delivered is excuted")

      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        console.log(product.stock)
        product.sold_out += qty;
        console.log(product.sold_out);

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
  try {
    console.log("updatesellerinfo is excuting");

    const seller = await Shop.findById(req.seller._id);

    console.log("seller found:", seller);

    seller.availableBalance = amount;

    console.log("balance is acuted");

    await seller.save();

    console.log("updatesellerinfo is excuted");
  } catch (err) {
    console.log("SAVE ERROR:", err);
    throw err;
  }
}
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




// refund order ----user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// refunf order success ----- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      order.status=req.body.status;
      await order.save();
      res.status(200).json({
        success:true,
        message:"Orer Refund Successfull",
      })
      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }
      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
      
        product.stock == qty;
        product.sold_out -= qty;

      
        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
  );
  




module.exports = router;