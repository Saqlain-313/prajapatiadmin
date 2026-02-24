import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBets } from "../store/reducer/wrestlingBetAdminSlice";
import {
  MdSearch,
  MdSportsKabaddi,
  MdPerson,
  MdPhone,
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdClose,
  MdInfo,
  MdFilterList,
  MdRefresh,
  MdVisibility,
  MdSportsMma,
  MdGroups,
  MdBlock,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

/* --------------------------------------------------------
   TOAST CONFIG
-------------------------------------------------------- */
const showToast = (message, type = "success") => {
  const icons = {
    success: <FiCheckCircle className="text-emerald-400" size={20} />,
    error: <FiXCircle className="text-red-400" size={20} />,
    info: <FiAlertCircle className="text-blue-400" size={20} />,  
  };

  toast[type](message, {
    icon: icons[type],
    style: {
      background: "#0F1115",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "16px 20px",
      boxShadow: "0 20px 40px -10px black, 0 0 0 1px rgba(255,255,255,0.05), 0 0 30px rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
      fontSize: "14px",
      fontWeight: "500",
    },
    duration: 4000,
  });
};

/* --------------------------------------------------------
   DARK GRADIENT THEME
-------------------------------------------------------- */
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-xl text-white font-medium text-sm border border-white/10 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(255,255,255,0.05)] \
   hover:from-[#3A404A] hover:to-[#161A1F] hover:border-white/30 \
   hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(255,255,255,0.2)] \
   transition-all duration-300 disabled:opacity-40";

const inputStyleClasses =
  "w-full px-5 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

const filterButtonClass = (isActive) => 
  `flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
   ${isActive 
     ? 'bg-gradient-to-br from-blue-500/30 to-blue-900/40 text-blue-300 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
     : 'bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] text-white/60 border border-white/10 hover:from-[#3A404A] hover:to-[#161A1F] hover:text-white hover:border-white/30'}`;

/* --------------------------------------------------------
   BET DETAILS MODAL
-------------------------------------------------------- */
const BetDetailsModal = ({ isOpen, onClose, bet }) => {
  if (!isOpen || !bet) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`${gradientCardClass} w-full max-w-2xl relative overflow-hidden animate-scaleIn`}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdSportsKabaddi size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Bet Details
              </h2>
              <p className="text-white/40 text-sm">
                ID: {bet._id?.slice(-8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl 
                     border border-transparent hover:border-white/20 transition"
          >
            <MdClose size={22} />
          </button>
        </div>

        <div className="relative z-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-2">
                <FaUserCircle className="text-white/50" size={16} />
                User Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MdPerson className="text-white/40" size={16} />
                  <span className="text-white/60 w-20">User ID</span>
                  <span className="text-white text-xs font-mono">
                    {bet.user?._id?.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MdPhone className="text-white/40" size={16} />
                  <span className="text-white/60 w-20">Mobile</span>
                  <span className="text-white">
                    {bet.userId?.mobile || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-2">
                <MdSportsKabaddi className="text-white/50" size={16} />
                Bet Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Match ID</span>
                  <span className="text-white text-xs font-mono">
                    {bet.mid || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Team</span>
                  <span className="text-white font-medium">
                    {bet.teamName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Type</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${bet.otype === 'back' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                    {bet.otype?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Rate</span>
                  <span className="text-white font-bold">
                    {bet.price?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Stake</span>
                  <span className="text-amber-400 font-bold text-lg">
                    ₹{bet.stake?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${bet.settled 
                      ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    {bet.settled ? 'SETTLED' : 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white/40 text-xs">Created At</span>
                <p className="text-white/80 text-sm mt-1">
                  {bet.createdAt ? new Date(bet.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-white/40 text-xs">Last Updated</span>
                <p className="text-white/80 text-sm mt-1">
                  {bet.updatedAt ? new Date(bet.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-6 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className={buttonGradientClass}>
            <MdClose size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   TEAM BOX COMPONENT
-------------------------------------------------------- */
const TeamBox = ({ matchName, teams, bets, isOpen, onToggle }) => {
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [selectedBetType, setSelectedBetType] = useState('ALL');
  
  // Only status===1 (Settled) bets are passed to this component now.

  // Get team names
  const teamNames = Array.from(teams);
  
  // Filter bets based on selections
  const filteredBets = useMemo(() => {
    let filtered = bets;

    // Apply team filter
    if (selectedTeam !== 'ALL' && selectedTeam !== 'DISQUALIFY') {
      filtered = filtered.filter(bet => bet.teamName === selectedTeam);
    } else if (selectedTeam === 'DISQUALIFY') {
      filtered = [];
    }
    
    // Apply bet type filter
    if (selectedBetType !== 'ALL') {
      filtered = filtered.filter(bet => 
        bet.otype?.toUpperCase() === selectedBetType
      );
    }
    
    return filtered;
  }, [bets, selectedTeam, selectedBetType]);

  const totalStake = filteredBets.reduce((sum, b) => sum + (b.stake || 0), 0);

  return (
    <div className={`${gradientCardClass} mb-4 overflow-hidden`}>
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all duration-300"
        onClick={() => onToggle(matchName)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                        flex items-center justify-center border border-white/30">
            <MdGroups size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{matchName}</h3>
            <p className="text-white/40 text-xs mt-1">
              {filteredBets.length} bets • Total Stake: ₹{totalStake.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-sm">Click to {isOpen ? 'close' : 'open'}</span>
          {isOpen ? <MdExpandLess size={24} className="text-white/60" /> : <MdExpandMore size={24} className="text-white/60" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedTeam('ALL')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${selectedTeam === 'ALL' 
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' 
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}
              >
                All
              </button>
              {teamNames.map((team) => (
                <button
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                    ${selectedTeam === team 
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' 
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}
                >
                  {team}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedTeam('DISQUALIFY')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${selectedTeam === 'DISQUALIFY'
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}
            >
              <MdBlock size={16} />
              Disqualify
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-white/40 text-sm">Bet Type:</span>
            <button
              onClick={() => setSelectedBetType('ALL')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${selectedBetType === 'ALL'
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedBetType('BACK')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${selectedBetType === 'BACK'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}
            >
              BACK
            </button>
            <button
              onClick={() => setSelectedBetType('LAY')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${selectedBetType === 'LAY'
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}
            >
              LAY
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/40 border-b border-white/10">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Stake
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-5 py-8 text-center text-white/40">
                      No bets found for this filter
                    </td>
                  </tr>
                ) : (
                  filteredBets.map((bet) => (
                    <tr key={bet._id} className="hover:bg-white/5 transition-all duration-200 group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                                        flex items-center justify-center border border-white/20">
                            <span className="text-white font-bold text-sm">
                              {bet.userId?.mobile?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">
                              User #{bet.user?._id?.slice(-6)}
                            </div>
                            <div className="text-xs text-white/40 font-mono">
                              {bet._id?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className="text-white/80 text-sm font-mono">
                          {bet.userId?.mobile || 'N/A'}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className="px-3 py-1.5 bg-gradient-to-br from-white/10 to-white/5 
                                     rounded-lg text-white/90 text-xs font-medium border border-white/20">
                          {bet.teamName}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border
                          ${bet.otype === 'back' 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                          {bet.otype?.toUpperCase()}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className="text-white font-bold">
                          {bet.price?.toFixed(2)}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className="text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                          ₹{bet.stake?.toLocaleString()}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border
                          ${bet.settled 
                            ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                          {bet.settled ? 'SETTLED' : 'ACTIVE'}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openDetailsModal(bet)}
                          className="p-2 text-white/70 hover:text-white rounded-lg 
                                   hover:bg-white/5 border border-transparent hover:border-white/20
                                   transition-all duration-300"
                          title="View Details"
                        >
                          <MdVisibility size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* --------------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------------- */
const AdminWrestlingSettledPage = () => {
  const dispatch = useDispatch();
  const { bets, loading, error } = useSelector(
    (s) => s.wrestlingBetAdmin
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBet, setSelectedBet] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [openMatches, setOpenMatches] = useState({});

  useEffect(() => {
    dispatch(getAllBets());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  // Filter only "status:1" (settled) bets
  const settledBets = useMemo(() => {
    return bets.filter((b) => b.status === 1);
  }, [bets]);

  // Group only settled bets by match/event
  const matches = useMemo(() => {
    const matchMap = new Map();
    settledBets.forEach(bet => {
      const matchName = bet.eventName || 'Unknown Match';
      if (!matchMap.has(matchName)) {
        matchMap.set(matchName, {
          matchName,
          teams: new Set(),
          bets: []
        });
      }
      const match = matchMap.get(matchName);
      match.bets.push(bet);
      if (bet.teamName) {
        match.teams.add(bet.teamName);
      }
    });
    return Array.from(matchMap.values());
  }, [settledBets]);

  // Filter matches based on search
  const filteredMatches = useMemo(() => {
    if (!searchQuery) return matches;
    
    const query = searchQuery.toLowerCase();
    return matches.filter(match => 
      match.matchName.toLowerCase().includes(query) ||
      match.bets.some(b => 
        b.user?.mobile?.toLowerCase().includes(query) ||
        b.teamName?.toLowerCase().includes(query) ||
        b._id?.toLowerCase().includes(query)
      )
    );
  }, [matches, searchQuery]);

  // Initialize open state for first match
  useEffect(() => {
    if (filteredMatches.length > 0 && Object.keys(openMatches).length === 0) {
      setOpenMatches({ [filteredMatches[0].matchName]: true });
    }
  }, [filteredMatches]);

  // Calculate stats using only settled bets
  const stats = useMemo(() => {
    const total = settledBets.length;
    const totalStake = settledBets.reduce((sum, b) => sum + (b.stake || 0), 0);
    const backCount = settledBets.filter(b => b.btype === 'back').length;
    const layCount = settledBets.filter(b => b.btype === 'lay').length;
    const settledCount = total;
    const activeCount = 0;
    return { total, totalStake, backCount, layCount, settledCount, activeCount };
  }, [settledBets]);

  const handleRefresh = () => {
    dispatch(getAllBets());
    showToast("Refreshing bets...", "info");
  };

  const openDetailsModal = (bet) => {
    setSelectedBet(bet);
    setShowDetailsModal(true);
  };

  const toggleMatch = (matchName) => {
    setOpenMatches(prev => ({
      ...prev,
      [matchName]: !prev[matchName]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/10 border-t-white/30 rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-white/50 text-sm mt-6">Loading bets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      
      {/* Header Section */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdSportsKabaddi size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Settled Bets
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{stats.total} settled bets</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>₹{stats.totalStake.toLocaleString()} total stake</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:min-w-[250px]">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputStyleClasses}
                placeholder="Search by mobile, team, match..."
              />
              <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            </div>
            
            <button
              onClick={handleRefresh}
              className={buttonGradientClass}
              title="Refresh"
            >
              <MdRefresh size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className={`${gradientCardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Settled Bets</p>
              <p className="text-white text-xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30">
              <MdSportsKabaddi size={16} className="text-white" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Total Stake</p>
              <p className="text-amber-400 text-xl font-bold mt-1">
                ₹{stats.totalStake.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-900/30 
                          flex items-center justify-center border border-amber-500/30">
              <MdAttachMoney size={16} className="text-amber-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">BACK Bets</p>
              <p className="text-emerald-400 text-xl font-bold mt-1">{stats.backCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 
                          flex items-center justify-center border border-emerald-500/30">
              <FiCheckCircle size={16} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">LAY Bets</p>
              <p className="text-red-400 text-xl font-bold mt-1">{stats.layCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/30 
                          flex items-center justify-center border border-red-500/30">
              <FiXCircle size={16} className="text-red-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Active</p>
              <p className="text-blue-400 text-xl font-bold mt-1">{stats.activeCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                          flex items-center justify-center border border-blue-500/30">
              <MdInfo size={16} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Settled</p>
              <p className="text-gray-400 text-xl font-bold mt-1">{stats.settledCount}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-500/20 to-gray-900/30 
                          flex items-center justify-center border border-gray-500/30">
              <MdCheckCircle size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Match Boxes */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <TeamBox
            key={match.matchName}
            matchName={match.matchName}
            teams={match.teams}
            bets={match.bets}
            isOpen={openMatches[match.matchName] || false}
            onToggle={toggleMatch}
          />
        ))}
        
        {filteredMatches.length === 0 && (
          <div className={`${gradientCardClass} p-8 text-center`}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
                          flex items-center justify-center border border-white/20">
              <MdSportsKabaddi size={32} className="text-white/30" />
            </div>
            <p className="text-white/50 text-lg font-medium">No matches found</p>
            <p className="text-white/30 text-sm mt-1">
              {searchQuery ? 'Try adjusting your search' : 'No settled bets found'}
            </p>
          </div>
        )}
      </div>

      {/* Bet Details Modal */}
      <BetDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBet(null);
        }}
        bet={selectedBet}
      />

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminWrestlingSettledPage;