import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getImages,
  uploadImages,
  updateImageByIndex,
  clearImageState,
} from "../store/reducer/imageSlice";
import {
  MdUpload,
  MdUpdate,
  MdImage,
  MdClose,
  MdSearch,
  MdDelete,
  MdVisibility,
  MdCloudUpload,
  MdEdit,
  MdPhotoLibrary,
  MdRefresh,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdFileUpload,
  MdNumbers,
} from "react-icons/md";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

/* --------------------------------------------------------
   TOAST CONFIG — consistent with dark theme
-------------------------------------------------------- */
const showToast = (message, type = "success") => {
  const icons = {
    success: <FiCheckCircle className="text-emerald-400" size={20} />,
    error: <FiXCircle className="text-red-400" size={20} />,
    info: <FiAlertCircle className="text-blue-400" size={20} />,
  };

  toast[type](message, {
    icon: icons[type],
    style: {
      background: "#0F1115",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "16px 20px",
      boxShadow: "0 20px 40px -10px black, 0 0 0 1px rgba(255,255,255,0.05), 0 0 30px rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
      fontSize: "14px",
      fontWeight: "500",
    },
    duration: 4000,
  });
};

/* --------------------------------------------------------
   DARK GRADIENT THEME — consistent with navbar/sidebar
-------------------------------------------------------- */
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-xl text-white font-medium text-sm border border-white/10 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(255,255,255,0.05)] \
   hover:from-[#3A404A] hover:to-[#161A1F] hover:border-white/30 \
   hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(255,255,255,0.2)] \
   transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";

const uploadButtonClass =
  "flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-500/20 to-blue-900/30 \
   rounded-xl text-blue-300 font-medium text-sm border border-blue-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(59,130,246,0.1)] \
   hover:from-blue-500/30 hover:to-blue-900/40 hover:border-blue-500/50 \
   hover:text-blue-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(59,130,246,0.25)] \
   transition-all duration-300 disabled:opacity-40";

const updateButtonClass =
  "flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-xl text-emerald-300 font-medium text-sm border border-emerald-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 hover:border-emerald-500/50 \
   hover:text-emerald-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(16,185,129,0.25)] \
   transition-all duration-300 disabled:opacity-40";

const inputStyleClasses =
  "w-full px-5 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

/* --------------------------------------------------------
   IMAGE CARD COMPONENT
-------------------------------------------------------- */
const ImageCard = ({ image, index }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div 
        className="group relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] 
                   rounded-2xl border border-white/10 overflow-hidden
                   hover:border-white/30 hover:shadow-[0_20px_40px_-15px_black,0_0_30px_rgba(255,255,255,0.1)]
                   transition-all duration-500 cursor-pointer"
        onClick={() => setShowPreview(true)}
      >
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image.url}
            alt={`Image ${index}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Index Badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm 
                        rounded-lg border border-white/20 text-white/90 text-xs font-medium
                        shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <MdNumbers className="inline mr-1" size={12} />
            Index #{index}
          </div>
          
          {/* Preview Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl 
                           border border-white/30 text-white text-sm font-medium
                           shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <MdVisibility className="inline mr-2" size={16} />
              Preview
            </span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <p className="text-white/60 text-xs truncate">
            {image.filename || `Image ${index + 1}`}
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className={`${gradientCardClass} max-w-4xl w-full relative overflow-hidden animate-scaleIn`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                                flex items-center justify-center border border-white/30">
                    <MdImage size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Image Preview</h3>
                    <p className="text-white/40 text-sm">Index #{index}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl 
                           border border-transparent hover:border-white/20 transition"
                >
                  <MdClose size={22} />
                </button>
              </div>
              
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={image.url}
                  alt={`Preview ${index}`}
                  className="w-full h-auto max-h-[70vh] object-contain bg-black/60"
                />
              </div>
              
              <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/10">
                <p className="text-white/80 text-sm break-all">
                  <span className="text-white/40">URL: </span>
                  {image.url}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* --------------------------------------------------------
   IMAGES PAGE - MAIN COMPONENT
-------------------------------------------------------- */
const ImagesPage = () => {
  const dispatch = useDispatch();

  const { images, total, loading, error, success } = useSelector(
    (state) => state.images
  );

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [updateFile, setUpdateFile] = useState(null);
  const [updateIndex, setUpdateIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  /* =============================
     FETCH IMAGES ON LOAD
  ============================= */
  useEffect(() => {
    dispatch(getImages());
  }, [dispatch]);

  /* =============================
     SHOW TOAST ON SUCCESS/ERROR
  ============================= */
  useEffect(() => {
    if (success) {
      showToast("Operation completed successfully", "success");
      // Clear form after success
      setSelectedFiles([]);
      setUpdateFile(null);
      setUpdateIndex(null);
      // Reset file input
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => { input.value = ''; });
    }
    if (error) {
      showToast(error, "error");
    }
  }, [success, error]);

  /* =============================
     HANDLE MULTIPLE UPLOAD
  ============================= */
  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showToast("Please select at least one file", "error");
      return;
    }

    dispatch(uploadImages(Array.from(selectedFiles)));
  };

  /* =============================
     HANDLE UPDATE IMAGE
  ============================= */
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!updateFile) {
      showToast("Please select a file", "error");
      return;
    }
    if (updateIndex === null || updateIndex === "") {
      showToast("Please enter an image index", "error");
      return;
    }
    if (updateIndex < 0 || updateIndex >= images.length) {
      showToast(`Index must be between 0 and ${images.length - 1}`, "error");
      return;
    }

    dispatch(updateImageByIndex({ index: updateIndex, file: updateFile }));
  };

  /* =============================
     DRAG AND DROP HANDLERS
  ============================= */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  /* =============================
     FILTER IMAGES
  ============================= */
  const filteredImages = images.filter((img, index) => {
    const query = searchQuery.toLowerCase();
    return (
      index.toString().includes(query) ||
      (img.filename && img.filename.toLowerCase().includes(query)) ||
      (img.url && img.url.toLowerCase().includes(query))
    );
  });

  /* =============================
     REFRESH IMAGES
  ============================= */
  const handleRefresh = () => {
    dispatch(getImages());
    showToast("Refreshing images...", "info");
  };

  /* =============================
     CLEAR STATE
  ============================= */
  const handleClearState = () => {
    dispatch(clearImageState());
    showToast("State cleared", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      
      {/* Header Section */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdPhotoLibrary size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Image Manager
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{total} images in library</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{filteredImages.length} shown</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputStyleClasses}
                placeholder="Search by index or filename..."
              />
              <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            </div>
            
            <button
              onClick={handleRefresh}
              className={buttonGradientClass}
              title="Refresh"
            >
              <MdRefresh size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/10 border-t-white/30 rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-white/50 text-sm mt-6">Loading images...</p>
          <p className="text-white/30 text-xs mt-2">Please wait</p>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Left Column - Upload Section */}
        <div className={`${gradientCardClass} p-6 relative overflow-hidden`}>
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                            flex items-center justify-center border border-blue-500/30">
                <MdCloudUpload size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Upload Images</h2>
            </div>

            <form onSubmit={handleUpload}>
              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 mb-5 transition-all duration-300
                  ${dragActive 
                    ? 'border-blue-500/50 bg-blue-500/10' 
                    : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="hidden"
                  accept="image/*"
                />
                
                <div className="text-center">
                  <MdFileUpload size={40} className="mx-auto mb-3 text-white/40" />
                  <p className="text-white/70 mb-1">
                    <span className="text-blue-400 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-white/40 text-xs">
                    PNG, JPG, JPEG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mb-5 p-4 bg-black/40 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white/80 text-sm font-medium">
                      {selectedFiles.length} file(s) selected
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFiles([]);
                        const input = document.getElementById('file-upload');
                        if (input) input.value = '';
                      }}
                      className="text-red-400/70 hover:text-red-300 text-xs px-3 py-1.5 
                               rounded-lg hover:bg-red-500/10 transition"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-2 custom-scrollbar">
                    {Array.from(selectedFiles).map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-white/60 truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-white/40">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`${uploadButtonClass} w-full justify-center`}
                disabled={loading || selectedFiles.length === 0}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <MdUpload size={18} />
                    Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Images` : 'Images'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Update Section */}
        <div className={`${gradientCardClass} p-6 relative overflow-hidden`}>
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 
                            flex items-center justify-center border border-emerald-500/30">
                <MdEdit size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Update Image by Index</h2>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-white/60 text-xs mb-2 ml-1">
                  Image Index (0 - {images.length - 1})
                </label>
                <input
                  type="number"
                  placeholder="Enter image index"
                  value={updateIndex ?? ""}
                  onChange={(e) => setUpdateIndex(e.target.value ? Number(e.target.value) : null)}
                  className={inputStyleClasses}
                  min="0"
                  max={images.length - 1}
                />
                {images.length > 0 && (
                  <p className="text-white/40 text-xs mt-2 ml-1">
                    Available indices: 0 to {images.length - 1}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-2 ml-1">
                  New Image File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="update-file"
                    onChange={(e) => setUpdateFile(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                  />
                  <div 
                    onClick={() => document.getElementById('update-file').click()}
                    className={`${inputStyleClasses} cursor-pointer flex items-center justify-between`}
                  >
                    <span className={updateFile ? 'text-white' : 'text-white/30'}>
                      {updateFile ? updateFile.name : 'Choose an image...'}
                    </span>
                    <MdCloudUpload size={18} className="text-white/40" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`${updateButtonClass} w-full justify-center mt-6`}
                disabled={loading || !updateFile || updateIndex === null || updateIndex === ""}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <MdUpdate size={18} />
                    Update Image at Index {updateIndex ?? ''}
                  </>
                )}
              </button>
            </form>

            {/* Current Image Preview */}
            {updateIndex !== null && updateIndex >= 0 && updateIndex < images.length && (
              <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/10">
                <p className="text-white/60 text-xs mb-3">Current Image at Index {updateIndex}:</p>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                    <img
                      src={images[updateIndex]?.url}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-xs truncate">
                      {images[updateIndex]?.filename || `Image ${updateIndex}`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPreviewFile(images[updateIndex])}
                      className="text-blue-400/70 hover:text-blue-300 text-xs mt-2 
                               flex items-center gap-1 px-3 py-1.5 rounded-lg 
                               hover:bg-blue-500/10 transition"
                    >
                      <MdVisibility size={14} />
                      View Full Image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className={`${gradientCardClass} p-6 relative overflow-hidden`}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                            flex items-center justify-center border border-white/30">
                <MdImage size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Image Gallery</h2>
                <p className="text-white/40 text-xs mt-0.5">
                  {filteredImages.length} of {total} images
                </p>
              </div>
            </div>
            
            {images.length > 0 && (
              <button
                onClick={handleClearState}
                className="px-4 py-2 text-red-400/70 hover:text-red-300 
                         rounded-lg hover:bg-red-500/10 transition-all duration-300
                         border border-transparent hover:border-red-500/30 text-xs"
              >
                Clear State
              </button>
            )}
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
                            flex items-center justify-center border border-white/20">
                <MdPhotoLibrary size={32} className="text-white/30" />
              </div>
              <p className="text-white/50 text-lg font-medium">No images found</p>
              <p className="text-white/30 text-sm mt-1">
                {searchQuery ? 'Try adjusting your search' : 'Upload some images to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((img, idx) => {
                const originalIndex = images.findIndex(i => i.url === img.url);
                return (
                  <ImageCard 
                    key={originalIndex} 
                    image={img} 
                    index={originalIndex} 
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal for Update Section */}
      {previewFile && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div 
            className={`${gradientCardClass} max-w-4xl w-full relative overflow-hidden animate-scaleIn`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                                flex items-center justify-center border border-white/30">
                    <MdImage size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Current Image</h3>
                    <p className="text-white/40 text-sm">Index {updateIndex}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl 
                           border border-transparent hover:border-white/20 transition"
                >
                  <MdClose size={22} />
                </button>
              </div>
              
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={previewFile.url}
                  alt="Current"
                  className="w-full h-auto max-h-[70vh] object-contain bg-black/60"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Animations & Scrollbar Styles */}
      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default ImagesPage;