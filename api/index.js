import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json()); //allow json from insomnia
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
//req is from client, res is from server
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
