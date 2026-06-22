const express = require("express");
const ErrorHnadler = require("./middleware/error");
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
const cors=require("cors");
const app = express();
// config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({path:"config/.env"});
  // require("dotenv").config({ path: path.join(__dirname, "config/.env") });
}
const user=require("./controller/User");
const event=require("./controller/Event");
const shop=require("./controller/Shop");
const product=require("./controller/Product");
const coupounCode=require("./controller/CoupounCode");
const Payment=require("./controller/Payment");
const order=require("./controller/order");
const conversation=require("./controller/Conversation");
const message=require("./controller/Message");
const path =require("path");
// Remove static file serving - use Cloudinary URLs instead
// app.use("/",express.static("uploads"));
const allowedOrigins = [
  "http://localhost:3000",           // Development
  "http://localhost:3001",           // Alternative dev
  process.env.FRONTEND_URL,          // Production (e.g., https://yourapp.vercel.app)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
app.use(bodyParser.urlencoded({ extended: true , limit:"50mb" }));
app.use(cookieParser());
app.use("/api/v2/user",user);
app.use("/api/v2/shop",shop);
app.use("/api/v2/product",product);
app.use("/api/v2/event",event);
app.use("/api/v2/coupoun",coupounCode);
app.use("/api/v2/payment",Payment);
app.use("/api/v2/order",order);
app.use("/api/v2/conversation",conversation);
app.use("/api/v2/message",message);

app.use(ErrorHnadler);
module.exports=app;