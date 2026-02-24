import { useState } from "react";
import {
  MdSave,
  MdSettings,
  MdEmail,
  MdPhone,
  MdImage,
  MdPayment,
} from "react-icons/md";
import { FiUpload } from "react-icons/fi";

const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#151821] to-[#0F1115] border border-white/10 rounded-2xl shadow-xl p-6";

export default function AdminGeneralSettings() {
  const [settings, setSettings] = useState({
    siteName: "",
    supportEmail: "",
    supportPhone: "",
    upiId: "",
    razorpayKey: "",
    maintenanceMode: false,
    logo: null,
    favicon: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSettings({
      ...settings,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Settings:", settings);
    alert("Settings Saved Successfully");
  };

  return (
    <div className="p-6 min-h-screen bg-[#0B0D10] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MdSettings size={28} className="text-emerald-400" />
        <h1 className="text-2xl font-bold">General Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Info */}
        <div className={gradientCardClass}>
          <h2 className="text-lg font-semibold mb-4">Site Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="siteName"
              placeholder="Site Name"
              value={settings.siteName}
              onChange={handleChange}
              className="inputStyle"
            />

            <div className="relative">
              <MdEmail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="supportEmail"
                placeholder="Support Email"
                value={settings.supportEmail}
                onChange={handleChange}
                className="inputStyle pl-10"
              />
            </div>

            <div className="relative">
              <MdPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="supportPhone"
                placeholder="Support Phone"
                value={settings.supportPhone}
                onChange={handleChange}
                className="inputStyle pl-10"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className={gradientCardClass}>
          <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <MdPayment className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="upiId"
                placeholder="UPI ID"
                value={settings.upiId}
                onChange={handleChange}
                className="inputStyle pl-10"
              />
            </div>

            <input
              type="text"
              name="razorpayKey"
              placeholder="Razorpay Key"
              value={settings.razorpayKey}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>
        </div>

        {/* Branding */}
        <div className={gradientCardClass}>
          <h2 className="text-lg font-semibold mb-4">Branding</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="fileUploadStyle">
              <FiUpload className="mr-2" />
              Upload Logo
              <input
                type="file"
                name="logo"
                hidden
                onChange={handleFileChange}
              />
            </label>

            <label className="fileUploadStyle">
              <FiUpload className="mr-2" />
              Upload Favicon
              <input
                type="file"
                name="favicon"
                hidden
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className={gradientCardClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Maintenance Mode</h2>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  settings.maintenanceMode
                    ? "bg-red-500"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    settings.maintenanceMode
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition px-6 py-2 rounded-xl font-semibold"
          >
            <MdSave />
            Save Settings
          </button>
        </div>
      </form>

      {/* Custom Styles */}
      <style>{`
        .inputStyle {
          width: 100%;
          background: #0F1115;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 12px;
          border-radius: 12px;
          outline: none;
          transition: 0.3s;
        }

        .inputStyle:focus {
          border-color: #10B981;
          box-shadow: 0 0 10px rgba(16,185,129,0.3);
        }

        .fileUploadStyle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: #0F1115;
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: 0.3s;
        }

        .fileUploadStyle:hover {
          border-color: #10B981;
          background: rgba(16,185,129,0.05);
        }
      `}</style>
    </div>
  );
}