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
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  /* =========================
     ROUTE MAP
  ========================= */
  const routeMap = {
    Dashboard: "/",
    "Active Users": "/users/active",
    Deposit: "/deposit",
    Withdrawals: "/withdrawals",

    // Wrestling Core
    Matches: "/matches",
    "Create Match": "/admin/wrestling/create",

    // Betting Pages
    "All Bets": "/admin/wrestling-bets/all",
    "Pending Bets": "/admin/wrestling-bets/pending",
    "Settled Bets": "/admin/wrestling-bets/settled",
    "Bet History": "/admin/wrestling-bet-history",
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
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleNavigation = (page) => {
    navigate(routeMap[page]);
    setSidebarOpen(false);
  };

  /* =========================
     FIXED ACTIVE LOGIC
  ========================= */
  const isActive = (page) => {
    const path = routeMap[page];
    if (!path) return false;

    // exact match OR nested match support
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
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
      page: "Deposit",
      type: "single",
    },
    {
      name: "Withdrawals",
      icon: ArrowDownCircle,
      page: "Withdrawals",
      type: "single",
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
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 md:hidden
        ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64
        bg-gradient-to-b from-[#1f2933] to-[#000000]
        text-white shadow-2xl rounded-r-3xl
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex-shrink-0 md:rounded-r-none`}
      >
        {/* Logo */}
        <div className="p-6 flex justify-between items-center md:block border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">WM</span>
            </div>
            <div>
              <Link to="/">
                <h1 className="text-lg font-bold text-white">Wrestling</h1>
                <p className="text-white/70 text-sm">Admin Panel</p>
              </Link>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4 space-y-1">
          {menuItems.map((item) =>
            item.type === "dropdown" ? (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex justify-between w-full px-4 py-3 rounded-lg transition
                  ${
                    openDropdown === item.name
                      ? "bg-white/25 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      openDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === item.name && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.items.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => handleNavigation(sub.page)}
                        className={`flex w-full px-4 py-2 rounded-lg text-sm transition
                        ${
                          isActive(sub.page)
                            ? "bg-white/30 text-white"
                            : "text-white/80 hover:bg-white/10"
                        }`}
                      >
                        <ChevronRight className="h-3 w-3 mr-3" />
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
                className={`flex w-full px-4 py-3 rounded-lg transition gap-3
                ${
                  isActive(item.page)
                    ? "bg-white/30 text-white"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 mt-auto text-center">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} Wrestling
          </p>
          <p className="text-white/50 text-xs mt-1">v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;