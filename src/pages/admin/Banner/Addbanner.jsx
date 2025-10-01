import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import { useDispatch } from "react-redux";

const AddBanner = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${Baseurl}banner/getbanners`);
      setBanners(response.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file selection
  const handleImageChange = (files) => {
    const newFiles = Array.from(files);
    if (newFiles.length + selectedImages.length > 5) {
      dispatch(
        showToast({ message: "You can select upto 5 images ", type: "info" })
      );
      return;
    }
    setSelectedImages((prev) => [...prev, ...newFiles]);
  };

  // Drag & Drop handlers
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

  // Upload new banners
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      dispatch(
        showToast({ message: "Please Select Image first ", type: "error" })
      );
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((image) => formData.append("bannerimage", image));

    try {
      setUploading(true);
      const response = await axios.post(
        `${Baseurl}banner/addbanner`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        dispatch(
          showToast({ message: response.data.message, type: "success" })
        );
        setSelectedImages([]);
        fetchBanners();
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error?.response?.data?.message || "Something went wrong",
          type: "error",
        })
      );
    } finally {
      setUploading(false);
    }
  };

  // Delete banner
  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`${Baseurl}banner/deletebanner/${id}`);
      setBanners((prev) => prev.filter((banner) => banner._id !== id));
      dispatch(
        showToast({ message: "Banner deleted successfully", type: "success" })
      );
    } catch (error) {
      console.error("Error deleting banner:", error);
      dispatch(
        showToast({ message: "Failed to delete banner", type: "error" })
      );
    }
  };

  // Update banner
  const handleUpdateBanner = async (id, file) => {
    const formData = new FormData();
    formData.append("bannerimage", file);

    try {
      setUploading(true);
      const response = await axios.put(
        `${Baseurl}banner/updatebanner/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(
        showToast({
          message: response.data.message || "Banner updated successfully!",
          type: "success",
        })
      );
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner:", error);
      dispatch(
        showToast({ message: "Failed to update banner", type: "error" })
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Manage Banners
      </h2>

      {/* Drag & Drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: "2px dashed #007bff",
          borderRadius: "12px",
          padding: "40px",
          marginBottom: "20px",
          background: dragOver ? "#e0f0ff" : "#f9f9f9",
          cursor: "pointer",
          transition: "background 0.3s",
          textAlign: "center",
        }}
      >
        <p>
          {dragOver
            ? "Drop images here"
            : "Drag & drop images or click to select"}
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleImageChange(e.target.files)}
        />
      </div>

      {/* Selected images preview */}
      {selectedImages.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {selectedImages.map((image, index) => (
            <div
              key={index}
              style={{ position: "relative", width: "130px", height: "130px" }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Selected ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={uploading}
        style={{
          padding: "12px 25px",
          background: "var(--textcolor)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {uploading ? "Uploading..." : "Upload Banners"}
      </button>

      {/* Uploaded banners in a table */}
      <h3 style={{ marginTop: "40px", textAlign: "center" }}>
        Uploaded Banners
      </h3>
      {banners.length === 0 ? (
        <p style={{ textAlign: "center" }}>No banners uploaded yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Image
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {banner.bannerimage?.map((img, index) => (
                    <img
                      key={index}
                      src={img.filepath} // ✅ Use direct URL
                      alt={img.filename || "Banner"}
                      style={{
                        width: "120px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginRight: "8px",
                      }}
                    />
                  ))}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {/* Update Banner */}
                  <label
                    style={{
                      background: "var(--textcolor)",
                      color: "#fff",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Update
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleUpdateBanner(banner._id, e.target.files[0])
                      }
                    />
                  </label>

                  {/* Delete Banner */}
                  <button
                    onClick={() => handleDeleteBanner(banner._id)}
                    style={{
                      background: "var(--textcolor)",
                      color: "#fff",
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddBanner;
