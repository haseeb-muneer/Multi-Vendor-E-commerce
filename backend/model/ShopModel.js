const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const mongoose=require("mongoose");



const ShopSchema = new mongoose.Schema({
  name: {    //this name is different from user Schema name
    type: String,
    required: [true, "Please enter your Shop name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your shop email address!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
    required:true,
  },
  address:{
    type:String,
    required:true,
  },
  role: {
    type: String,
    default: "seller",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  zipCode:{
    type:Number,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
   availableBalance: {
    type: Number,
    default: 0,
  },
 description:{
    type:String,
 },
   resetPasswordToken: String,
  resetPasswordTime: Date,
});
//  Hash password
ShopSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
ShopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// compare password
ShopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const Shop = mongoose.model("Shop", ShopSchema);
module.exports=Shop;
