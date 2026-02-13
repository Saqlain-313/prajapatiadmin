import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Search, Settings, User, Menu, Globe } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logoutUser, getProfile } from "../store/reducer/authReducer";

/* -------------------- NAVBAR -------------------- */
const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const userDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-[#1f2933] to-[#000000] p-3 md:px-6 flex justify-between items-center shadow-lg sticky top-0 z-30">

        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <button
            className="text-white p-2 rounded-lg md:hidden hover:bg-white/10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>

          <form className="relative hidden sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
              size={18}
            />
            <input
              type="search"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 rounded bg-white/10 text-white
              border border-white/20 placeholder-white/60
              focus:ring-2 focus:ring-white/40 w-56"
            />
          </form>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">
          {/* Visit website */}
          <a href="https://demo3.daltincasino.live/" target="_blank" rel="noreferrer">
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white">
              <Globe size={20} />
            </button>
          </a>

          {/* USER DROPDOWN */}
          <div className="relative" ref={userDropdownRef}>
            <button
              className="flex items-center p-1 rounded-full text-white hover:bg-white/10"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center font-bold">
                {loading
                  ? "..."
                  : (user?.firstname?.charAt(0) || "U").toUpperCase()}
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl border py-2">
                <button
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full"
                  onClick={() => setShowProfileModal(true)}
                >
                  <User size={16} className="mr-2" /> Profile
                </button>

                <hr className="my-1" />

                <button
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowProfileModal(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4">Admin Profile</h2>

            <div className="space-y-2">
              <p><strong>Name:</strong> {user?.firstname}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.mobile}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
