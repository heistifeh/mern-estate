import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();
const app = express();
app.use(express.json()); //allow json from insomnia
app.use(cookieParser());
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
//req is from client, res is from server
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});
// middlware for error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});
