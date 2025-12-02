import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import { useDispatch } from "react-redux";
import "../../../safar_css/Banner.css";

const AddBanner = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${Baseurl}banner/getbanners`);
      setBanners(response.data || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageChange = (files) => {
    const newFiles = Array.from(files);
    if (newFiles.length + selectedImages.length > 5) {
      dispatch(showToast({ message: "You can upload max 5 images", type: "info" }));
      return;
    }
    setSelectedImages((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageChange(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) {
      dispatch(showToast({ message: "Please select images first", type: "error" }));
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((img) => formData.append("bannerimage", img));

    try {
      setUploading(true);
      const response = await axios.post(`${Baseurl}banner/addbanner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(showToast({ message: response.data.message, type: "success" }));
      setSelectedImages([]);
      fetchBanners();
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`${Baseurl}banner/deletebanner/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id));
      dispatch(showToast({ message: "Banner deleted", type: "success" }));
    } catch (error) {
      dispatch(showToast({ message: "Failed to delete", type: "error" }));
    }
  };

  const handleUpdateBanner = async (id, file) => {
    const formData = new FormData();
    formData.append("bannerimage", file);

    try {
      setUploading(true);
      const response = await axios.put(`${Baseurl}banner/updatebanner/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(showToast({ message: response.data.message, type: "success" }));
      fetchBanners();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="banner-container">
      <h1 className="banner-title">Manage Banners</h1>

      {/* Drag & Drop Upload */}
      <div
        className={`dropzone ${dragOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current.click()}
      >
        <p>{dragOver ? "Drop the images here..." : "Click or Drag images to upload"}</p>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => handleImageChange(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="preview-grid">
          {selectedImages.map((img, i) => (
            <div className="preview-card" key={i}>
              <img src={URL.createObjectURL(img)} alt="" />
              <button onClick={() => handleRemoveImage(i)} className="remove-btn">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button className="upload-btn" onClick={handleSubmit} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Banners"}
      </button>

      {/* Existing Banners */}
      <h2 className="sub-title">Uploaded Banners</h2>

      {banners.length === 0 ? (
        <p className="no-banners">No banners uploaded yet.</p>
      ) : (
        <div className="banner-grid">
          {banners.map((banner) => (
            <div className="banner-card" key={banner._id}>
              {banner.bannerimage?.map((img, index) => (
                <img
                  key={index}
                  src={img.filepath || img.secure_url || img.url}
                  alt=""
                  className="banner-img"
                />
              ))}

              <div className="banner-actions">
                <label className="update-btn">
                  Update
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpdateBanner(banner._id, e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </label>

                <button onClick={() => handleDeleteBanner(banner._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddBanner;
