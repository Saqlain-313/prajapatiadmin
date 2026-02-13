import React, { useState, useEffect } from 'react';
import { FaPlus, FaUpload } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Addlead = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Redux state
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const { loading: leadsLoading, imported, failed, csvErrors } = useSelector((state) => state.leads);

  const [leadData, setleadData] = useState({
    phone: '',
    name: '',
    status: 'open',
    extradetail: '',
  });

  const [bulkFile, setBulkFile] = useState(null);

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (!selectedUser) return <p className="text-center mt-10 text-gray-500">User not found</p>;

  // Single lead submit
  const handleleadDataSubmit = async (e) => {
    e.preventDefault();
    if (!leadData.phone) return;

    try {
      await dispatch(addLead({ userid: selectedUser._id, email: selectedUser.email, ...leadData })).then((res) => {
        if (res.payload.success) {
          toast.success(res.payload.message);
        } else {
          toast.error(res.payload.message);
        }
      })
      setleadData({ phone: '', name: '', status: 'open', extradetail: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add lead.');
    }
  };

  // Bulk CSV submit
  const handleBulkUploadSubmit = async (e) => {
    e.preventDefault();
    if (!bulkFile) return alert('No file selected');
 dispatch(addLeadsFromCSV({ userid: selectedUser._id, csvfile: bulkFile })).then((res) => {
        if (res.payload.success) {
          toast.success(res.payload.message);
        } else {
          toast.error(res.payload.message);
        }
      })
  };

  return (
    <div className="flex justify-center p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="w-full max-w-5xl">
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sm:p-10 mb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-1">
              Assign Leads to <span className="text-blue-600">{selectedUser?.name}</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-lg">{selectedUser?.email}</p>
          </div>

          {/* Single Lead Form */}
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-500" /> Add a Single Lead
            </h2>
            <form onSubmit={handleleadDataSubmit}>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  name="phone"
                  value={leadData.phone}
                  onChange={(e) => setleadData({ ...leadData, phone: e.target.value })}
                  placeholder="Phone Number *"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={leadData.name}
                  onChange={(e) => setleadData({ ...leadData, name: e.target.value })}
                  placeholder="Full Name (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400"
                />
                <select
                  name="status"
                  value={leadData.status}
                  onChange={(e) => setleadData({ ...leadData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700"
                >
                  <option value="open">Open</option>
                  <option value="interested">Interested</option>
                  <option value="not-interested">Not Interested</option>
                </select>
                <input
                  type="text"
                  name="extradetail"
                  value={leadData.extradetail}
                  onChange={(e) => setleadData({ ...leadData, extradetail: e.target.value })}
                  placeholder="Extra Detail (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={leadsLoading}
                  className={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-md md:col-span-2 lg:col-span-1 ${
                    leadsLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  <FaPlus /> {leadsLoading ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Bulk Upload Form */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUpload className="text-green-500" /> Bulk Upload Leads (CSV)
            </h2>
            <form onSubmit={handleBulkUploadSubmit}>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <label className="flex-1 w-full md:w-auto">
                  <input
                    type="file"
                    name="csv_file"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                    accept=".csv"
                    required
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
                <button
                  type="submit"
                  disabled={leadsLoading}
                  className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg transition-colors shadow-md ${
                    leadsLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                  }`}
                >
                  <FaUpload /> {leadsLoading ? 'Uploading...' : 'Upload CSV'}
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                CSV format: <code className="bg-gray-200 px-1 py-0.5 rounded font-mono text-gray-800">phone,name,status,extradetail</code>. 
                <strong>Phone</strong> column is required.
              </p>
            </form>

            {/* CSV upload results */}
            {imported > 0 || failed > 0 ? (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="font-semibold text-gray-700">CSV Upload Results:</p>
                <p>Imported: {imported}</p>
                <p>Failed: {failed}</p>
                {csvErrors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-red-600">Errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-500">
                      {csvErrors.map((err, idx) => (
                        <li key={idx}>{`Row ${err.row}: ${err.error}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addlead;
