require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
const serverPort = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.json({ status: "ok", message: "Expense tracker API is running" });
});

app.use("/api/expenses", expenseRoutes);

app.use((request, response) => {
  response.status(404).json({ message: "Route not found" });
});

app.use((error, request, response, next) => {
  const statusCode = error.status || 500;
  response.status(statusCode).json({
    message: error.message || "Something went wrong"
  });
});

async function startExpenseServer() {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("YOUR_TEST_USER") ||
        process.env.MONGODB_URI.includes("example.mongodb.net")) {
      throw new Error("Set a valid MongoDB Atlas connection string in backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    app.listen(serverPort, () => {
      console.log(`Expense tracker API listening on port ${serverPort}`);
    });
  } catch (connectionError) {
    console.error(`MongoDB connection failed: ${connectionError.message}`);
    process.exit(1);
  }
}

startExpenseServer();
