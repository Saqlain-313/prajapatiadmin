import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ add this
import {
  createNotification,
  resetNotificationState,
} from "../store/reducer/notificationSlice";

const AdminCreateNotification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ add this
  const { createLoading, success, error } = useSelector(
    (state) => state.notification
  );

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "medium",
    expiresAt: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createNotification({
        ...formData,
        expiresAt: formData.expiresAt || null,
      })
    );
  };

  useEffect(() => {
    if (success) {
      setFormData({
        title: "",
        message: "",
        type: "info",
        priority: "medium",
        expiresAt: "",
      });
      dispatch(resetNotificationState());
    }
  }, [success, dispatch]);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-6">
      
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Notification
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows="4"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-3 rounded"
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border p-3 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <input
          type="datetime-local"
          name="expiresAt"
          value={formData.expiresAt}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={createLoading}
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
        >
          {createLoading ? "Creating..." : "Create Notification"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateNotification;