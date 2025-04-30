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

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    if (req.user.id !== listing.userRef)
      return next(errorHandler(403, "You can only update your own listing😒"));
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer =
      req.query.offer === "true"
        ? true
        : req.query.offer === "false"
        ? false
        : { $in: [true, false] };

    const furnished =
      req.query.furnished === "true"
        ? true
        : req.query.furnished === "false"
        ? false
        : { $in: [true, false] };

    const parking =
      req.query.parking === "true"
        ? true
        : req.query.parking === "false"
        ? false
        : { $in: [true, false] };

    const type =
      req.query.type && req.query.type !== "all"
        ? req.query.type
        : { $in: ["sale", "rent"] };

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    if (!listings.length) {
      return next(errorHandler(404, "No listings found"));
    }

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
