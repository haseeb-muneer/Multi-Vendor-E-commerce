const mongoose = require("mongoose");

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState;
    console.log(`MongoDB is connected with ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err; // Prevent server from starting without DB
  }
};

module.exports = connectDatabase;
