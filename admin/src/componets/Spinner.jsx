// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// const Spinner = ({ path = "login" }) => {
//   const [count, setCount] = useState(3);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount((prevValue) => --prevValue);
//     }, 1000);
//     if (user) {
//       navigate({
//         state: location.pathname,
//       });
//     }
//     count === 0 &&
//       navigate(`/${path}`, {
//         state: location.pathname,
//       });
//     return () => clearInterval(interval);
//   }, [count, navigate, location, path]);
//   return (
//     <>
//       {count !== 0 ? (
//         /* From Uiverse.io by clarencedion */
//         <div className="w-full fixed h-[100vh] mx-auto overflow-hidden flex justify-center items-center bg-white">
//         <div
//   className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
// ></div>
//         </div>
//       ) : (
//         ""
//       )}
//     </>
//   );
// };

// export default Spinner;



// componets/Spinner.jsx
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-white animate-spin"></div>
        <div className="mt-4 text-white text-sm">Loading...</div>
      </div>
    </div>
  );
};

export default Spinner;