import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUpi,
  updateUpi,
  resetUpiState,
} from "../store/reducer/upiSlice";
import { MdPayment } from "react-icons/md";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const AdminUpiSettings = () => {
  const dispatch = useDispatch();
  const { upi, loading, success, error } = useSelector(
    (state) => state.upi
  );

  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");

  useEffect(() => {
    dispatch(fetchUpi());
  }, [dispatch]);

  useEffect(() => {
    if (upi) {
      setUpiId(upi.upiId || "");
      setUpiName(upi.upiName || "");
    }
  }, [upi]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetUpiState());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUpi({ upiId, upiName }));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-black flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 transition-all duration-500 hover:scale-[1.02]">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-black border border-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:shadow-yellow-400/60">
            <MdPayment className="text-3xl text-yellow-400" />
          </div>          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              UPI Settings
            </h2>
            <p className="text-sm text-gray-400">
              Manage your payment details securely
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 px-4 py-3 rounded-xl mb-5 animate-fadeIn">
            <FiCheckCircle className="text-lg" />
            <span>UPI Updated Successfully</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl mb-5 animate-fadeIn">
            <FiAlertCircle className="text-lg" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* UPI ID */}
          <div className="group">
            <label className="block text-sm text-gray-400 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@upi"
              className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300"
              required
            />
          </div>

          {/* UPI Name */}
          <div className="group">
            <label className="block text-sm text-gray-400 mb-2">
              UPI Name
            </label>
            <input
              type="text"
              value={upiName}
              onChange={(e) => setUpiName(e.target.value)}
              placeholder="Account Holder Name"
              className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden
  bg-black border border-yellow-500
  text-yellow-400 font-semibold py-3 rounded-xl
  shadow-lg transition-all duration-300
  hover:bg-gradient-to-r hover:from-yellow-500 hover:to-amber-500
  hover:text-black hover:shadow-yellow-500/40
  disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Updating...</span>
            ) : (
              "Update UPI"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpiSettings;