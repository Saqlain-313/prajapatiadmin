import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../store/reducer/notificationSlice";

const UserNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    dispatch(getUserNotifications());
  }, [dispatch]);

  const handleRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      {loading && <p>Loading...</p>}

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications available</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-4 rounded-xl shadow-md border ${
              n.isRead ? "bg-gray-100" : "bg-white border-blue-500"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{n.title}</h3>
              {!n.isRead && (
                <button
                  onClick={() => handleRead(n._id)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Mark as Read
                </button>
              )}
            </div>

            <p className="text-gray-600 mt-2">{n.message}</p>

            <div className="text-xs text-gray-400 mt-2">
              Priority: {n.priority} | Type: {n.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserNotifications;