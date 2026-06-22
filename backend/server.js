const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./db/Database");

// Load environment variables only in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/.env" });
}

// Unhandled exception handler
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error("Shutting down server...");
  process.exit(1);
});

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const port = process.env.PORT || 3001;
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Unhandled rejection handler
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err.message);
      console.error("Shutting down server...");
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();