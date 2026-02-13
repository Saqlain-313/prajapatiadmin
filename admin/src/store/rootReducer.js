import authReducer from "./reducer/authReducer";
import adminDepositsReducer from "./reducer/depositAdminSlice";
import withdrawalReducer from "./reducer/withdrawalReducer";
import wrestlingAdminReducer from "./reducer/wrestlingAdminSlice";
import wrestlingBetHistoryReducer from "./reducer/wrestlingBetHistorySlice";
import wrestlingBetAdminReducer from "./reducer/wrestlingBetAdminSlice"; // ✅ NEW
import imageReducer from './reducer/imageSlice';
import referralReducer from './reducer/referralSettingSlice'
const rootReducer = {
  auth: authReducer,
  adminDeposits: adminDepositsReducer,
  withdrawal: withdrawalReducer,
  wrestlingAdmin: wrestlingAdminReducer,
  wrestlingBetHistory: wrestlingBetHistoryReducer,
  wrestlingBetAdmin: wrestlingBetAdminReducer,
  images: imageReducer,
  referral: referralReducer,


};

export default rootReducer;