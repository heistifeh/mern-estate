import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);

    await newListing.save();
    return res.status(201).json({message: "Listing has been created🎉", newListing});
  } catch (error) {
    next(error);
  }
};
