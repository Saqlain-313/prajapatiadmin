import React, { useState, useEffect } from 'react';
import { IoPersonAddSharp } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/reducer/authReducer';
import { toast } from 'react-hot-toast';

const CardSection = () => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Local states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [terms, setTerms] = useState(false);

  // Show toast on success/error change
  useEffect(() => {
    if (error) toast.error(error);
    if (user?.success) toast.success(user.message || "User created successfully!");
  }, [error, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!terms) {
      toast.error("You must accept the Terms and Conditions");
      return;
    }

    dispatch(registerUser({ name, email, phone, password, role }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <IoPersonAddSharp className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create New User</h2>
          </div>
          <p className="mt-1 text-blue-100">
            Fill in the details below to add a new system user
          </p>
        </div>

        {/* Form */}
        <div className="py-6 px-6 sm:px-8">
          <form onSubmit={handleSubmit}>
            {/* Name (optional) */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
                required
              />
            </div>

            {/* Phone (optional) */}
            <div className="mb-5">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 1234567890"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Role */}
            <div className="mb-5">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Regular User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Terms */}
            <div className="mb-6 flex items-center gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the Terms and Conditions
              </label>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CardSection;
