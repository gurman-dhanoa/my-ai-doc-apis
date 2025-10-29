const express = require("express");
const cors = require("cors");
const ApiError = require("./utils/ApiError");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("My AI Doctor app is working fine!");
});

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

// Global error handler
app.use((err, req, res, next) => {
  let error = err;

  // If not an instance of ApiError, create a new ApiError
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Response
  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  console.error("Error:", error);

  res.status(error.statusCode).json(response);
});

module.exports = app;
