import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { set } from "mongoose";
const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  //store image files first
  const [selectedImages, setSelectedImages] = useState([]);
  //store image urls after uploading to cloudinary
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "sale",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 50,
    discountPrice: 0,
    imageUrls: [],
  });
  //states for image upload
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [imageUploadSuccess, setImageUploadSuccess] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  //states for form data
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  //handle image upload
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setSelectedImages((prevImages) => [...prevImages, ...files]); // Append new images to the existing array
  };

  const uploadFile = async (img) => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "images_preset");

    try {
      let cloudName = "dyvvq1ycl";
      let resourceType = "image";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      return res.data.secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    // if (selectedImages.length === 0) {
    //   setImageUploadError("Please select at least one image.");
    //   return;
    // }
    // if (selectedImages.length > 6) {
    //   setImageUploadError("You can only upload a maximum of 6 images.");
    //   return;
    // }

    try {
      if (selectedImages.length === 0) {
        setImageUploadError("Please select at least one image.");
        return;
      }
      if (selectedImages.length > 6) {
        setImageUploadError("You can only upload a maximum of 6 images.");
        return;
      }
      if (formData.imageUrls.length > 6) {
        setImageUploadError("You can only upload a maximum of 6 images.");
        return;
      }
      setUploading(true);
      setImageUploadError("");
      setImageUploadSuccess("");
      setImageUploading(true);
      // Upload all selected images and store their URLs
      const uploadedImages = await Promise.all(
        selectedImages.map((image) => uploadFile(image))
      );
      console.log(uploadedImages);

      setFormData((prevFormData) => ({
        ...prevFormData,
        imageUrls: [...prevFormData.imageUrls, ...uploadedImages],
      }));
      setSelectedImages([]); // Clear selected images after upload
      setImageUploadSuccess("Images uploaded successfully!");
      setTimeout(() => {
        setImageUploadSuccess("");
      }, 2000);
      // Reset selected images
      setUploading(false);
      setImageUploading(false);
    } catch (error) {
      console.error(error);
      setImageUploadError("Failed to upload images. Please try again.");
      setImageUploading(false);
    }
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (formData.imageUrls.length < 1)
      //   return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                required
                onChange={handleChange}
                value={formData.bathrooms}
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                onChange={handleChange}
                value={formData.regularPrice}
                min={50}
                max={1000000}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formData.offer ? (
                <div>
                  <input
                    type="number"
                    id="discountPrice"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                    min={0}
                    max={1000000000}
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted Price</p>
                    {formData.type === 'rent' && (
                     <span className='text-xs'>($ / month)</span>
                   )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              onClick={handleImageUpload}
              type="button"
              disabled={imageUploading || uploading}
              className="p-3 text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer"
            >
              {imageUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formData.imageUrls &&
            formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div className="flex justify-between items-center">
                <img
                  key={index}
                  src={url}
                  alt="uploaded"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
                    }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || imageUploading || uploading}
            onClick={handleSubmit}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {imageUploadError && (
            <p className="text-red-500 text-sm">{imageUploadError}</p>
          )}
          {imageUploadSuccess && (
            <p className="text-green-500 text-sm">{imageUploadSuccess}</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
