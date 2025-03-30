import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);

    await newListing.save();
    return res
      .status(201)
      .json({ message: "Listing has been created🎉", newListing });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    console.log(req.user.id, listing.userRef);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    
    if (req.user.id !== listing.userRef)
      return next(errorHandler(403, "You can only delete your own listing😒"));

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing has been deleted🎉");
  } catch (error) {
    next(error);
  }
};
