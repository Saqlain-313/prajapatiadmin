import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getImages,
  uploadImages,
  updateImageByIndex,
  clearImageState,
} from "../store/reducer/imageSlice";

const ImagesPage = () => {
  const dispatch = useDispatch();

  const { images, total, loading, error, success } = useSelector(
    (state) => state.images
  );

  console.log(images)

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [updateFile, setUpdateFile] = useState(null);
  const [updateIndex, setUpdateIndex] = useState(null);

  /* =============================
     FETCH IMAGES ON LOAD
  ============================= */
  useEffect(() => {
    dispatch(getImages());
  }, [dispatch]);

  /* =============================
     HANDLE MULTIPLE UPLOAD
  ============================= */
  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    dispatch(uploadImages(Array.from(selectedFiles)));
  };

  /* =============================
     HANDLE UPDATE IMAGE
  ============================= */
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!updateFile || updateIndex === null) return;

    dispatch(updateImageByIndex({ index: updateIndex, file: updateFile }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📸 Image Manager</h1>

      {/* Loading */}
      {loading && <p className="text-yellow-400">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Success */}
      {success && (
        <p className="text-green-500 mb-4">Operation Successful ✔</p>
      )}

      {/* =============================
          UPLOAD MULTIPLE IMAGES
      ============================= */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            multiple
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="mb-4"
          />

          <button
            type="submit"
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload
          </button>
        </form>
      </div>

      {/* =============================
          UPDATE IMAGE BY INDEX
      ============================= */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Image by Index</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="number"
            placeholder="Enter Image Index"
            value={updateIndex ?? ""}
            onChange={(e) => setUpdateIndex(Number(e.target.value))}
            className="p-2 rounded bg-gray-700 w-full"
          />

          <input
            type="file"
            onChange={(e) => setUpdateFile(e.target.files[0])}
          />

          <button
            type="submit"
            className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Update Image
          </button>
        </form>
      </div>

      {/* =============================
          IMAGE LIST
      ============================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          All Images ({total})
        </h2>

        {images.length === 0 ? (
          <p>No images found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="bg-gray-800 p-2 rounded-lg shadow-md"
              >
                <img
                  src={img.url}
                  alt={`Image ${index}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="text-sm mt-2 text-gray-400">
                  Index: {index}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesPage;