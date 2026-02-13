import React, { useEffect } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaEnvelope,
  FaArrowRight,
  FaChartLine,
  FaLayerGroup,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../store/reducer/authReducer";

/* ======================= STAT CARD ======================= */
const StatCard = ({ title, count, icon: Icon, link }) => (
  <a href={link || "#"} className="block h-full group">
    <div
      className="
        bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-[#000000]
        text-white rounded-2xl p-6 shadow-lg
        hover:shadow-2xl hover:scale-[1.02]
        transition-all duration-300
        border border-gray-800
      "
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm opacity-60 uppercase tracking-wide text-gray-400">
            {title}
          </p>
          <h3 className="text-5xl font-extrabold mt-1 text-gray-200">
            {count}
          </h3>
        </div>

        {/* ICON BOX */}
        <div className="bg-gray-800/60 p-4 rounded-xl">
          <Icon className="text-3xl text-gray-300" />
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-gray-800 flex justify-between text-sm text-gray-400">
        <span>View Details</span>
        <FaArrowRight className="group-hover:translate-x-1 transition duration-300" />
      </div>
    </div>
  </a>
);

/* ======================= DASHBOARD ======================= */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const totalUsers = users.length;
  const completed = users.filter((u) => u.profile_complete).length;
  const notCompleted = users.filter((u) => !u.profile_complete).length;

  return (
    <div
      className="
        p-6 min-h-screen
        bg-gradient-to-br from-[#0d0d0d] via-[#111111] to-[#000000]
      "
    >
      <h1 className="text-3xl font-extrabold flex items-center text-gray-200 mb-10">
        <FaChartLine className="mr-3 text-gray-400" />
        User Dashboard
      </h1>

      <section>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            count={totalUsers}
            icon={FaUsers}
            link="/users/active"
          />
          <StatCard
            title="Profile Completed"
            count={completed}
            icon={FaUserCheck}
            link="/users/active"
          />
          <StatCard
            title="Profile Not Completed"
            count={notCompleted}
            icon={FaEnvelope}
            link="/users/active"
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;