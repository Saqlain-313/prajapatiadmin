import authReducer from "./reducer/authReducer";
import adminDepositsReducer from "./reducer/depositAdminSlice";
import withdrawalReducer from "./reducer/withdrawalReducer";
import wrestlingAdminReducer from "./reducer/wrestlingAdminSlice";
import wrestlingBetHistoryReducer from "./reducer/wrestlingBetHistorySlice";
import wrestlingBetAdminReducer from "./reducer/wrestlingBetAdminSlice"; // ✅ NEW

const rootReducer = {
  auth: authReducer,
  adminDeposits: adminDepositsReducer,
  withdrawal: withdrawalReducer,
  wrestlingAdmin: wrestlingAdminReducer,
  wrestlingBetHistory: wrestlingBetHistoryReducer,
  wrestlingBetAdmin: wrestlingBetAdminReducer, 
};

export default rootReducer;