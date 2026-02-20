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
  Upload,
  Image,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";

/* -------------------- DARK BLACK & WHITE GLOW THEME — SIDEBAR -------------------- */
const sidebarGlassClass =
  "bg-gradient-to-br from-[#0A0C0E] via-[#0F1115] to-[#050607] \
   border-r border-white/5 shadow-[5px_0_35px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl";

const menuItemClass =
  "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/80 hover:text-white \
   transition-all duration-300 border border-transparent hover:border-white/20 \
   hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]";

const activeMenuItemClass =
  "flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/10 text-white \
   border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.15)]";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  /* =========================
     ROUTE MAP
  ========================= */
  const routeMap = {
    Dashboard: "/",
    "Active Users": "/users/active",
    Deposit: "/deposit",
    "Withdrawals Success": "/withdrawals/success",
    "Withdrawals Pending": "/withdrawals/pending",
    "Withdrawals Rejected": "/withdrawals/rejected",
    Matches: "/matches",
    "Create Match": "/admin/wrestling/create",
    "All Bets": "/admin/wrestling-bets/all",
    "Pending Bets": "/admin/wrestling-bets/pending",
    "Settled Bets": "/admin/wrestling-bets/settled",
    "Bet History": "/admin/wrestling-bet-history",
    "Referral Settings": "/admin/referral-settings",
    
    // Deposit pages
    "DepositManualSuccess": "/deposit/manual/success",
    "DepositManualPending": "/deposit/manual/pending",
    "DepositManualRejected": "/deposit/manual/rejected",
    "DepositOnlineSuccess": "/deposit/online/success",
    "DepositOnlinePending": "/deposit/online/pending",
    "DepositOnlineRejected": "/deposit/online/rejected",
  };

  /* =========================
     AUTO OPEN WRESTLING MENU
  ========================= */
  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/wrestling") ||
      location.pathname.startsWith("/admin/wrestling-bets") ||
      location.pathname === "/matches"
    ) {
      setOpenDropdown("Wrestling");
    }
  }, [location.pathname]);

  const toggleDropdown = (menu) => {
    // Only close if clicking a different dropdown, keep open if clicking same one
    if (openDropdown !== menu) {
      setOpenDropdown(menu);
    }
    // If clicking the same dropdown, it stays open (no state change)
  };

  const handleNavigation = (page) => {
    const target = routeMap[page];
    if (target) {
      navigate(target);
      setSidebarOpen(false);
    }
    // Don't close dropdown when navigating
    // setOpenDropdown(null); // Removed this line
  };

  // Remove banner upload handler, navigation handled by banner box onClick

  const isActive = (page) => {
    const path = routeMap[page];
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  /* =========================
     MENU ITEMS
  ========================= */
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      page: "Dashboard",
      type: "single",
    },
    {
      name: "Manage Users",
      icon: Users,
      type: "dropdown",
      items: [{ name: "All Users", page: "Active Users" }],
    },
    {
      name: "Deposit",
      icon: CreditCard,
      type: "dropdown",
      items: [
        {
          name: "Manual Pay",
          type: "nested",
          items: [
            { name: "Success", page: "DepositManualSuccess" },
            { name: "Pending", page: "DepositManualPending" },
            { name: "Rejected", page: "DepositManualRejected" },
          ],
        },
        {
          name: "Online Pay",
          type: "nested",
          items: [
            { name: "Success", page: "DepositOnlineSuccess" },
            { name: "Pending", page: "DepositOnlinePending" },
            { name: "Rejected", page: "DepositOnlineRejected" },
          ],
        },
      ],
    },
    {
      name: "Withdrawals",
      icon: ArrowDownCircle,
      type: "dropdown",
      items: [
        { name: "Success", page: "Withdrawals Success" },
        { name: "Pending", page: "Withdrawals Pending" },
        { name: "Rejected", page: "Withdrawals Rejected" },
      ],
    },
    {
      name: "Wrestling",
      icon: Folder,
      type: "dropdown",
      items: [
        { name: "All Matches", page: "Matches" },
        { name: "Create Match", page: "Create Match" },
        { name: "All Bets", page: "All Bets" },
        { name: "Pending Bets", page: "Pending Bets" },
        { name: "Settled Bets", page: "Settled Bets" },
        { name: "Bet History", page: "Bet History" },
      ],
    },
    {
      name: "Referral",
      icon: Settings,
      page: "Referral Settings",
      type: "single",
    },
  ];

  // Function to render nested dropdown items
  const renderNestedItems = (items, parentName) => {
    return items.map((subItem) => {
      if (subItem.type === "nested" && subItem.items) {
        return (
          <div key={subItem.name} className="ml-2 mt-1">
            <div className="text-white/50 text-xs font-medium px-4 py-1">
              {subItem.name}
            </div>
            <div className="space-y-1">
              {subItem.items.map((nestedItem) => (
                <button
                  key={nestedItem.name}
                  onClick={() => handleNavigation(nestedItem.page)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ml-2
                    ${isActive(nestedItem.page)
                      ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <ChevronRight size={14} className="text-white/40" />
                  {nestedItem.name}
                </button>
              ))}
            </div>
          </div>
        );
      }
      return (
        <button
          key={subItem.name}
          onClick={() => handleNavigation(subItem.page)}
          className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300
            ${isActive(subItem.page)
              ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
        >
          <ChevronRight size={14} className="text-white/40" />
          {subItem.name}
        </button>
      );
    });
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden
        ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 ${sidebarGlassClass}
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0 `}
      >
        {/* Logo Section — with glow */}
        <div className="p-6 flex justify-between items-center md:block border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center 
                            border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <span className="text-white font-bold text-xl drop-shadow-[0_2px_5px_black]">WM</span>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full 
                             border-2 border-black shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </div>
            <div>
              <Link to="/">
                <h1 className="text-xl font-bold text-white drop-shadow-[0_2px_5px_black]">Wrestling</h1>
                <p className="text-white/50 text-xs tracking-wide">Admin Panel</p>
              </Link>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 
                       border border-transparent hover:border-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Banner Upload Section — now navigates on box click, image upload button removed */}
        <div
          className="p-5 m-4 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md
                       shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer hover:border-white/20 transition"
          onClick={() => {
            navigate("/uploadbanner");
            setSidebarOpen(false);
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Image size={16} className="text-white/60" />
            <h3 className="text-white/80 text-sm font-medium">Banner Image</h3>
          </div>

          {/* Upload Button */}
          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 
                          bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl
                          text-white/80 hover:text-white text-sm cursor-pointer
                          transition-all duration-300 hover:border-white/40
                          shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]">
            <Upload size={16} />
            <span>{bannerPreview ? 'Change Banner' : 'Upload Banner'}</span>
            <input
              className="hidden"
            />
          </label>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-2 px-4 space-y-1">
          {menuItems.map((item) =>
            item.type === "dropdown" ? (
              <div key={item.name} className="mb-1">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-300
                    ${openDropdown === item.name
                      ? "bg-white/10 text-white border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/20"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={openDropdown === item.name ? "text-white" : "text-white/60"} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${openDropdown === item.name ? "rotate-180 text-white" : "text-white/40"
                      }`}
                  />
                </button>

                {/* Dropdown Items with nested structure */}
                {openDropdown === item.name && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-3">
                    {renderNestedItems(item.items, item.name)}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.name}
                onClick={() => {
                  handleNavigation(item.page);
                  // Don't close dropdown when navigating
                  // setOpenDropdown(null); // Removed this line
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive(item.page)
                    ? "bg-white/10 text-white border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/20"
                  }`}
              >
                <item.icon size={18} className={isActive(item.page) ? "text-white" : "text-white/60"} />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      <style jsx global>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
};

export default Sidebar;

