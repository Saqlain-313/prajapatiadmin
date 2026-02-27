import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createNotification,
  resetNotificationState,
} from "../store/reducer/notificationSlice";

const AdminCreateNotification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f0f0f] to-black p-6">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-amber-500/10 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      <div className="relative w-full max-w-2xl 
      bg-black/90 backdrop-blur-xl 
      border border-yellow-500/30 
      shadow-2xl shadow-yellow-500/10 
      rounded-2xl p-8 text-white">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm 
          bg-black border border-yellow-500 
          text-yellow-400 px-4 py-2 rounded-lg
          transition-all duration-300
          hover:bg-gradient-to-r hover:from-yellow-500 hover:to-amber-500
          hover:text-black hover:shadow-yellow-500/40"
        >
          ← Back
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-8 text-center 
        text-yellow-400 tracking-wide">
          Create Notification
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 
          text-red-400 p-3 rounded-xl mb-6 backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-black/60 border border-gray-700 
            rounded-xl px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-yellow-500 
            focus:border-yellow-400 transition-all duration-300"
            required
          />

          {/* Message */}
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full bg-black/60 border border-gray-700 
            rounded-xl px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-yellow-500 
            focus:border-yellow-400 transition-all duration-300"
            required
          />

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="bg-black/60 border border-gray-700 
              rounded-xl px-4 py-3 text-white
              focus:outline-none focus:ring-2 focus:ring-yellow-500 
              focus:border-yellow-400 transition-all duration-300"
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
              className="bg-black/60 border border-gray-700 
              rounded-xl px-4 py-3 text-white
              focus:outline-none focus:ring-2 focus:ring-yellow-500 
              focus:border-yellow-400 transition-all duration-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Expiry */}
          <input
            type="datetime-local"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className="w-full bg-black/60 border border-gray-700 
            rounded-xl px-4 py-3 text-white
            focus:outline-none focus:ring-2 focus:ring-yellow-500 
            focus:border-yellow-400 transition-all duration-300"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createLoading}
            className="w-full mt-4 
            bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600
            hover:from-yellow-600 hover:via-amber-500 hover:to-yellow-700
            text-black font-bold py-3 rounded-xl shadow-lg
            transition-all duration-300 
            hover:shadow-yellow-500/40 
            disabled:opacity-60"
          >
            {createLoading ? "Creating..." : "Create Notification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateNotification;