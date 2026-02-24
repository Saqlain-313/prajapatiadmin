import authReducer from "./reducer/authReducer";
import adminDepositsReducer from "./reducer/depositAdminSlice";
import withdrawalReducer from "./reducer/withdrawalReducer";
import wrestlingAdminReducer from "./reducer/wrestlingAdminSlice";
import wrestlingBetHistoryReducer from "./reducer/wrestlingBetHistorySlice";
import wrestlingBetAdminReducer from "./reducer/wrestlingBetAdminSlice"; // ✅ NEW
import imageReducer from './reducer/imageSlice';
import referralReducer from './reducer/referralSettingSlice'
import depositReducer from "./reducer/depositSlice";
import notificationReducer from "./reducer/notificationSlice"      // user side
import upiReducer from './reducer/upiSlice'
const rootReducer = {
  auth: authReducer,
  adminDeposits: adminDepositsReducer,
  withdrawal: withdrawalReducer,
  wrestlingAdmin: wrestlingAdminReducer,
  wrestlingBetHistory: wrestlingBetHistoryReducer,
  wrestlingBetAdmin: wrestlingBetAdminReducer,
  images: imageReducer,
  referral: referralReducer,
  deposits: depositReducer,
  notification: notificationReducer,
  upi: upiReducer



};

export default rootReducer;