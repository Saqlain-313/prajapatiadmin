import React, { useEffect, useState, useMemo } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../store/reducer/authReducer";

/* --------------------------------------------------------
   USER DETAILS POPUP MODAL
-------------------------------------------------------- */
const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] border border-gray-700/40">
        <h2 className="text-xl font-extrabold text-white mb-4">
          👤 User Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 text-sm">
          <p>
            <strong>Name:</strong> {user.firstname} {user.lastname}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            <span
              className={`px-3 py-1 ml-2 text-xs font-bold rounded-full
              ${
                isAdmin
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {user.role?.toUpperCase()}
            </span>
          </p>

          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Mobile:</strong> {user.mobile || "N/A"}</p>

          <p>
            <strong>Country:</strong> {user.country_name || "N/A"} (
            {user.country_code || "N/A"})
          </p>

          <p><strong>State:</strong> {user.state || "N/A"}</p>
          <p><strong>City:</strong> {user.city || "N/A"}</p>
          <p><strong>ZIP:</strong> {user.zip || "N/A"}</p>

          <p className="sm:col-span-2">
            <strong>Address:</strong> {user.address || "N/A"}
          </p>

          <p><strong>Verified:</strong> {user.is_verified ? "Yes" : "No"}</p>
          <p>
            <strong>Profile Complete:</strong>{" "}
            {user.profile_complete ? "Yes" : "No"}
          </p>

          <p><strong>Referral Code:</strong> {user.referral_code || "N/A"}</p>
          <p><strong>Referral Count:</strong> {user.referrals_count || 0}</p>

          <p className="text-amber-400 font-semibold">
            <strong>Credit:</strong> ₹{(user.credit || 0).toFixed(2)}
          </p>

          <p>
            <strong>Joined:</strong>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString()
              : "N/A"}
          </p>

          <p className="sm:col-span-2 break-all text-xs text-gray-500">
            <strong>User ID:</strong> {user._id}
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-white
              bg-gradient-to-br from-gray-700 to-black hover:from-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   TABLE ROW
-------------------------------------------------------- */
const UserTableRow = ({ user, onView, onDelete }) => {
  const formatBalance = (balance) => `₹${(balance || 0).toFixed(2)}`;
  const isAdmin = user.role === "admin";

  return (
    <tr
      className={`border-t border-gray-800 transition
        ${
          isAdmin
            ? "bg-purple-900/20 hover:bg-purple-900/30"
            : "hover:bg-gray-800/40"
        }
      `}
    >
      <td className="p-4">
        <div className="font-semibold text-gray-100">
          {user.firstname} {user.lastname}
        </div>
        <div className="text-sm text-gray-400">
          {user.email || "N/A"} • {user.mobile || "N/A"}
        </div>
      </td>

      <td className="p-4 text-sm text-gray-300">
        {user.country_code || "N/A"}
      </td>

      {/* ROLE COLUMN */}
      <td className="p-4">
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full
            ${
              isAdmin
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
        >
          {user.role?.toUpperCase()}
        </span>
      </td>

      <td className="p-4 text-sm text-gray-300">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleString()
          : "N/A"}
      </td>

      <td className="p-4 font-bold text-amber-400">
        {formatBalance(user.credit)}
      </td>

      <td className="p-4 flex gap-2">
        <button
          onClick={() => onView(user)}
          className="flex items-center px-3 py-2 text-sm font-bold text-white rounded-xl
            bg-gradient-to-br from-gray-700 to-black hover:from-gray-600"
        >
          <FaEye className="mr-2" /> View
        </button>

        <button
          disabled={isAdmin}
          onClick={() => onDelete(user._id)}
          className={`px-3 py-2 text-sm font-bold text-white rounded-xl
            ${
              isAdmin
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

/* --------------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------------- */
const ActiveUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector(
    (state) => state.auth
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const sortedUsers = [...users].sort((a, b) => {
      if (a.role === "admin") return -1;
      if (b.role === "admin") return 1;
      return 0;
    });

    return sortedUsers.filter((u) => {
      const email = String(u.email || "").toLowerCase();
      const mobile = String(u.mobile || "").toLowerCase();
      return email.includes(query) || mobile.includes(query);
    });
  }, [users, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-3xl font-extrabold">👥 Active Users</h1>

        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 rounded-xl bg-black border border-gray-700
              p-2.5 pl-4 text-sm text-white outline-none
              focus:ring-2 focus:ring-gray-600"
            placeholder="Email or Mobile"
          />
          <span className="absolute right-3 top-3 text-gray-500">
            <FaSearch />
          </span>
        </div>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-400">
          ⏳ Loading users...
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-400 font-medium">
          {error}
        </div>
      )}

      {!loading && filteredUsers.length > 0 && (
        <div className="overflow-x-auto shadow-2xl rounded-2xl bg-gradient-to-br from-gray-900/80 to-black border border-gray-700/40">
          <table className="min-w-full">
            <thead className="bg-black text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  onView={(u) => {
                    setSelectedUser(u);
                    setShowModal(true);
                  }}
                  onDelete={async (id) => {
                    if (!window.confirm("Delete this user?")) return;
                    await dispatch(deleteUser(id));
                    dispatch(getAllUsers());
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No users found.
        </div>
      )}

      {showModal && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default ActiveUsers;