import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  X,
  ChevronDown,
  ChevronRight,
  CreditCard,
  ArrowDownCircle,
  Folder,
  Settings,
  QrCode,
  Bell,
} from "lucide-react";

/* -------------------- DARK BLACK & WHITE GLOW THEME -------------------- */
const sidebarGlassClass =
  "bg-gradient-to-br from-[#0A0C0E] via-[#0F1115] to-[#050607] \
   border-r border-white/5 shadow-[5px_0_35px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  /* =========================
     ROUTE MAP
  ========================= */
  const routeMap = {
    Dashboard: "/",
    ActiveUsers: "/users/active",

    // Deposit
    DepositManualSuccess: "/manual/success",
    DepositManualPending: "/manual/pending",
    DepositManualRejected: "/manual/rejected",
    DepositOnlineSuccess: "/online/deposit",
    DepositOnlinePending: "/online/pending",
    DepositOnlineRejected: "/online/rejected",
    UpiUpdate: "/admin/upiUpdate",

    // Withdraw
    WithdrawSuccess: "/withdrawals/success",
    WithdrawPending: "/withdrawals/pending",
    WithdrawRejected: "/withdrawals/rejected",

    // Wrestling
    Matches: "/matches",
    CreateMatch: "/admin/wrestling/create",
    AllBets: "/admin/wrestling-bets/all",
    PendingBets: "/admin/wrestling-bets/pending",
    SettledBets: "/admin/wrestling-bets/settled",
    BetHistory: "/admin/wrestling-bet-history",

    // Referral
    Referral: "/admin/referral-settings",

    // ✅ NEW — Notification
    CreateNotification: "/admin/create-notification",
  };

  /* =========================
     AUTO OPEN DROPDOWN BASED ON ROUTE
  ========================= */
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/admin/wrestling") || path === "/matches") {
      setOpenDropdown("Wrestling");
    } else if (path.startsWith("/manual") || path.startsWith("/online")) {
      setOpenDropdown("Deposit");
    } else if (path.startsWith("/withdrawals")) {
      setOpenDropdown("Withdrawals");
    } else {
      setOpenDropdown(null);
    }
  }, [location.pathname]);

  const handleNavigation = (page) => {
    const target = routeMap[page];
    if (target) {
      navigate(target);
      setSidebarOpen(false);
    }
  };

  const isActive = (page) => {
    const path = routeMap[page];
    if (!path) return false;

    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },

    {
      name: "Manage Users",
      icon: Users,
      dropdown: true,
      items: [{ name: "All Users", page: "ActiveUsers" }],
    },

    { name: "UPI Update", icon: QrCode, page: "UpiUpdate" },

    // ✅ NEW — Direct Create Notification Button
    {
      name: "Create Notification",
      icon: Bell,
      page: "CreateNotification",
    },

    {
      name: "Deposit",
      icon: CreditCard,
      dropdown: true,
      items: [
        { name: "Manual Success", page: "DepositManualSuccess" },
        { name: "Manual Pending", page: "DepositManualPending" },
        { name: "Manual Rejected", page: "DepositManualRejected" },
        { name: "Online Success", page: "DepositOnlineSuccess" },
        { name: "Online Pending", page: "DepositOnlinePending" },
        { name: "Online Rejected", page: "DepositOnlineRejected" },
      ],
    },

    {
      name: "Withdrawals",
      icon: ArrowDownCircle,
      dropdown: true,
      items: [
        { name: "Success", page: "WithdrawSuccess" },
        { name: "Pending", page: "WithdrawPending" },
        { name: "Rejected", page: "WithdrawRejected" },
      ],
    },

    {
      name: "Wrestling",
      icon: Folder,
      dropdown: true,
      items: [
        { name: "All Matches", page: "Matches" },
        { name: "Create Match", page: "CreateMatch" },
        { name: "All Bets", page: "AllBets" },
        { name: "Pending Bets", page: "PendingBets" },
        { name: "Settled Bets", page: "SettledBets" },
        { name: "Bet History", page: "BetHistory" },
      ],
    },

    { name: "Referral", icon: Settings, page: "Referral" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-40 md:hidden transition ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 ${sidebarGlassClass}
        transform transition-transform duration-300 overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        {/* Logo */}
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <Link to="/" className="text-white text-xl font-bold">
            Wrestling Admin
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white"
          >
            <X />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4 space-y-2">
          {menuItems.map((item) =>
            item.dropdown ? (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === item.name ? null : item.name
                    )
                  }
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition
                  ${
                    openDropdown === item.name
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.name}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition ${
                      openDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === item.name && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-white/10 pl-3">
                    {item.items.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => handleNavigation(sub.page)}
                        className={`flex w-full items-center gap-2 px-4 py-2 rounded-lg text-sm transition
                        ${
                          isActive(sub.page)
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <ChevronRight size={14} />
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.page)}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition
                ${
                  isActive(item.page)
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </button>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;