const express=require('express');
const path=require("path");
const router=express.Router();
const jwt=require("jsonwebtoken");
const fs = require('fs');
const sendMail=require("../utils/sendMail");
const sendToken=require("../utils/sendToken");
const { isAuthenticated, isSeller } = require('../middleware/auth');
const ErrorHandler = require('../utils/ErrorHandler');
const {upload}=require("../multer");
const Shop =require("../model/ShopModel");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const shopToken = require('../utils/sendShopToken');
const cloudinary = require("cloudinary");
const { uploadBufferToCloudinary } = require("../utils/cloudinary");

router.post("/create-shop", upload.single("file"), async (req, res, next) => {
    try {
        const { email } = req.body;
        const ShopEmail = await Shop.findOne({ email });

        if (ShopEmail) {
            return next(new ErrorHandler("Seller already exist", 400));
        }

        if (!req.file) {
            return next(new ErrorHandler("Please upload a shop avatar", 400));
        }

        const myCloud = await uploadBufferToCloudinary(req.file, "E-Shop/avatars");

        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };

        const createActivationToken = (seller) => {
            return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
                expiresIn: "5m",
            });
        };

        const activationToken = createActivationToken(seller);
        const activationurl = `${process.env.FRONTEND_URL}/seller/activation/${activationToken}`;

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop",
                message: `Hello ${seller.name}.please click on the link to activate your shop: ${activationurl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email ${seller.email} to activate your shop`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activation_token } = req.body;
        console.log(`token received = ${activation_token}`);
        const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        console.log(newSeller);
        if (!newSeller) {
            return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;

        const existedSeller = await Shop.findOne({ email });
        console.log(`user existed : ${existedSeller}`);
        if (existedSeller) {
            return next(new ErrorHandler("Seller already exist", 400));
        }
        try {
            const seller = await Shop.create({
                name,
                email,
                password,
                avatar,
                zipCode,
                address,
                phoneNumber,
            });
            console.log(`seller is created in database :${seller}`);
            shopToken(seller, 201, res);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("please provide the all fields!", 400));
        }
        const user = await Shop.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("User does not exist!", 400));
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler("please provide the correct information!", 400));
        }
        shopToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        console.log(req.seller);
        const seller = await Shop.findById(req.seller._id);
        console.log(`seller is : ${seller}`);
        if (!seller) {
            return next(new ErrorHandler("User does not exist", 400));
        }
        return res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

router.get("/logout", catchAsyncErrors(async (req, res, next) => {
    try {
        res.cookie("seller_token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.status(201).json({
            success: true,
            message: "Log out successful!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

router.get("/get-shop-info/:id", catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);
    res.json({
        success: true,
        shop,
    });
    console.log(`shop is this ${shop}`);
}));

router.put("/update-seller-info", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, description, address, phoneNumber, zipCode } = req.body;
        const shop = await Shop.findOne(req.seller._id);
        if (!shop) {
            return next(new ErrorHandler("User not found", 400));
        }
        shop.name = name;
        shop.description = description;
        shop.address = address;
        shop.phoneNumber = phoneNumber;
        shop.zipCode = zipCode;
        await shop.save();
        res.status(201).json({
            success: true,
            shop,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

router.put("/update-shop-avatar", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        let existsSeller = await Shop.findById(req.seller._id);
        const imageId = existsSeller.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "E-Shop/avatars",
            width: 150,
        });
        existsSeller.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        await existsSeller.save();
        res.status(200).json({
            success: true,
            seller: existsSeller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

module.exports = router;