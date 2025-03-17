import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
export const testLogic = (req, res) => {
  res.send({
    message: "This is a test route",
  });
};

export const updateUserLogic = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only update your own account😒"));
  try {
    // if user wants to update password, we have to hash it
    if (req.body.password) {
      const hashPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUserLogic = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only delete your own account😒"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};
