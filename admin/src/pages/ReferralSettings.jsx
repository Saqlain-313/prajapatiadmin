import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdShare,
  MdEdit,
  MdClose,
  MdWarning,
  MdAttachMoney,
  MdPercent,
  MdSort,
  MdRefresh,
  MdSave,
} from "react-icons/md";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  getReferralSettings,
  updateReferralSetting,
  resetReferralState,
} from "../store/reducer/referralSettingSlice";

/* =========================
   THEME STYLES
========================= */

const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20";

const buttonGradientClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-xl text-white font-medium text-sm border border-white/10 \
   hover:border-white/30 transition-all duration-300 disabled:opacity-40";

const saveButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/20 \
   rounded-xl text-emerald-300 font-medium text-sm border border-emerald-500/30 \
   hover:border-emerald-500/50 transition-all duration-300";

const inputStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   focus:border-white/40 outline-none transition-all duration-300";

/* =========================
   EDIT MODAL
========================= */

const EditModal = ({ isOpen, onClose, setting, onSave }) => {
  const [percent, setPercent] = useState(setting?.percent || 0);

  useEffect(() => {
    if (setting) setPercent(setting.percent);
  }, [setting]);

  if (!isOpen || !setting) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (percent < 0 || percent > 100) {
      toast.error("Percent must be between 0 and 100");
      return;
    }
    onSave({ level: setting.level, percent });
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className={`${gradientCardClass} w-full max-w-md p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            Edit Level {setting.level}
          </h3>
          <button onClick={onClose}>
            <MdClose size={20} className="text-white/60 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="text-white/60 text-xs flex items-center gap-1 mb-2">
            <MdPercent size={14} /> Commission %
          </label>

          <div className="relative mb-6">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={percent}
              onChange={(e) =>
                setPercent(parseFloat(e.target.value) || 0)
              }
              className={`${inputStyleClasses} pl-10`}
              required
            />
            <MdAttachMoney
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={16}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className={buttonGradientClass}>
              Cancel
            </button>
            <button type="submit" className={saveButtonClass}>
              <MdSave size={16} /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */

const ReferralSettings = () => {
  const dispatch = useDispatch();

  const { settings, loading, error, success } = useSelector(
    (state) => state.referral
  );

  const [editingSetting, setEditingSetting] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  /* Fetch on mount */
  useEffect(() => {
    dispatch(getReferralSettings());
  }, [dispatch]);

  /* Success toast */
  useEffect(() => {
    if (success) {
      toast.success("Referral commission updated successfully");
      dispatch(resetReferralState());
    }
  }, [success, dispatch]);

  /* Error toast */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetReferralState());
    }
  }, [error, dispatch]);

  const handleUpdate = ({ level, percent }) => {
    dispatch(updateReferralSetting({ level, percent }));
    setShowEditModal(false);
    setEditingSetting(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className={`${gradientCardClass} p-6 mb-6 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <MdShare size={26} className="text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Referral Settings
              </h1>
              <p className="text-white/40 text-sm">
                Configure referral commissions
              </p>
            </div>
          </div>

        </div>

        {/* TABLE */}
        <div className={`${gradientCardClass} p-6`}>
          {loading && !settings.length ? (
            <p className="text-white/50">Loading...</p>
          ) : settings.length === 0 ? (
            <p className="text-white/40">No referral levels found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left py-3 text-white/60 text-xs uppercase">
                      Level
                    </th>
                    <th className="text-left py-3 text-white/60 text-xs uppercase">
                      Commission %
                    </th>
                    <th className="text-right py-3 text-white/60 text-xs uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {settings.map((setting) => (
                    <tr
                      key={setting.level}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 text-white font-medium">
                        Level {setting.level}
                      </td>

                      <td className="py-4">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-bold">
                          {setting.percent}%
                        </span>
                      </td>

                      <td className="py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingSetting(setting);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300"
                        >
                          <MdEdit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {settings.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/40 flex justify-between">
              <span>Total Levels: {settings.length}</span>
              <span>
                Max Commission:{" "}
                {settings.length
                  ? Math.max(...settings.map((s) => Number(s.percent)))
                  : 0}
                %
              </span>
            </div>
          )}
        </div>
        <div className={`${gradientCardClass} p-4 mt-6`}>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <MdWarning size={14} className="text-amber-400" />
            <span>Commission percentages apply to referral earnings at each level.</span>
            <span className="w-1 h-1 rounded-full bg-white/20 mx-2" />
            <span>Levels are sorted ascending automatically.</span>
          </div>
        </div>

      </div>


      {/* EDIT MODAL */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSetting(null);
        }}
        setting={editingSetting}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default ReferralSettings;