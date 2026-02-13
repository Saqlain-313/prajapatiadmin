import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/reducer/authReducer";
import { useNavigate } from "react-router-dom";

/* ------------------ SMALL COMPONENTS ------------------ */
const RequiredStar = () => <span className="text-red-400 ml-1">*</span>;

/* ------------------ STYLES ------------------ */
const inputStyleClasses =
  "w-full px-4 py-3 border border-gray-700 bg-black/60 text-lg text-white rounded-xl \
   placeholder-gray-400 focus:ring-2 focus:ring-gray-600 \
   focus:border-gray-600 hover:border-gray-600 \
   outline-none transition-all duration-200";

const labelStyleClasses =
  "block text-base font-semibold text-gray-300 mb-2";

/* ------------------ FORGOT PASSWORD ------------------ */
const ForgotPassword = ({ onBackToLogin }) => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    setTimeout(() => {
      setLoading(false);
      if (!mobile || mobile.length !== 10) {
        setError("Please enter a valid 10 digit mobile number.");
      } else {
        setMessage("OTP has been sent to your registered mobile number.");
      }
    }, 1500);
  };

  return (
    <div className="animate-fadeIn">
      {message && (
        <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-200 px-4 py-3 rounded-xl mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleForgotPassword} className="space-y-6">
        <div>
          <label className={labelStyleClasses}>
            Mobile Number <RequiredStar />
          </label>
          <input
            type="tel"
            className={inputStyleClasses}
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter registered mobile number"
            maxLength={10}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-bold rounded-xl text-white uppercase tracking-wider
                     bg-gradient-to-br from-gray-700 to-black
                     hover:from-gray-600 transition disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBackToLogin}
          className="text-gray-400 hover:text-white font-semibold transition"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

/* ------------------ MAIN LOGIN ------------------ */
const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [roleError, setRoleError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/");
      else setRoleError("Only Admin  can log in.");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRoleError(null);
    dispatch(loginUser({ mobile, password }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/YTcQ6xc6/wrestling-bg-jpg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg z-10">
        {/* HEADER */}
        <div className="rounded-t-2xl overflow-hidden">
          <div
            className="text-white text-center py-10 animate-fadeIn"
            style={{
              background:
                "linear-gradient(135deg, #374151 0%, #000000 100%)",
              clipPath:
                "polygon(0 0,100% 0,100% 88%,50% 100%,0 88%)",
            }}
          >
            {isForgotPassword ? (
              <h2 className="text-3xl font-extrabold">
                Recover Account
              </h2>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold">
                  Wrestling Admin
                </h2>
                <p className="text-lg opacity-80 mt-1">
                  Login Dashboard
                </p>
              </>
            )}
          </div>
        </div>

        {/* FORM — FULL TRANSPARENT */}
        <div className="bg-transparent p-10 rounded-b-2xl animate-fadeIn">
          {!isForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className={labelStyleClasses}>
                  Email or Phone <RequiredStar />
                </label>
                <input
                  type="text"
                  className={inputStyleClasses}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className={labelStyleClasses}>
                    Password <RequiredStar />
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    Forgot Password?
                  </button>
                </div>

                <input
                  type="password"
                  className={inputStyleClasses}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {(error || roleError) && (
                <p className="text-red-400 text-center">
                  {error || roleError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-bold rounded-xl text-white uppercase tracking-wider
                           bg-gradient-to-br from-gray-700 to-black
                           hover:from-gray-600 transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          ) : (
            <ForgotPassword
              onBackToLogin={() => setIsForgotPassword(false)}
            />
          )}
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;