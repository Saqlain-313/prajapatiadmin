import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMatchProfitSummary } from "../store/reducer/wrestlingBetHistorySlice";

const AdminMatchProfitPage = ({ mid, onClose }) => {
  const dispatch = useDispatch();

  const { profitSummary, loading, error } = useSelector(
    (state) => state.wrestlingBetHistory
  );

  useEffect(() => {
    if (mid) {
      dispatch(getMatchProfitSummary(mid));
    }
  }, [dispatch, mid]);

  if (!mid) return null;

  const format = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Match Profit (MID: {mid})
        </h2>

        {onClose && (
          <button onClick={onClose} className="text-red-400">
            Close
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {profitSummary && (
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(profitSummary.teamSummary).map(
            ([team, data]) => {
              
              const totalStake =
                (data.totalBackStake || 0) +
                (data.totalLayStake || 0);

              const totalLiability =
                (data.totalBackProfit || 0) +
                (data.totalLayLiability || 0);

              return (
                <div
                  key={team}
                  className="bg-gray-800 p-4 rounded"
                >
                  <h3 className="text-yellow-400 mb-3 text-lg font-semibold">
                    Team {team}
                  </h3>

                  {/* BACK */}
                  <p>
                    Back Stake:
                    <span className="text-blue-400 ml-2">
                      {format(data.totalBackStake)}
                    </span>
                  </p>

                  <p>
                    Back Liability:
                    <span className="text-red-400 ml-2">
                      {format(data.totalBackProfit)}
                    </span>
                  </p>

                  {/* LAY */}
                  <p>
                    Lay Stake:
                    <span className="text-green-400 ml-2">
                      {format(data.totalLayStake)}
                    </span>
                  </p>

                  <p>
                    Lay Liability:
                    <span className="text-red-400 ml-2">
                      {format(data.totalLayLiability)}
                    </span>
                  </p>

                  {/* COMBINED TOTAL */}
                  <div className="border-t border-gray-600 mt-3 pt-3">
                    <p className="font-semibold">
                      Total Stake:
                      <span className="text-purple-400 ml-2">
                        {format(totalStake)}
                      </span>
                    </p>

                    <p className="font-semibold">
                      Total Liability:
                      <span className="text-red-500 ml-2">
                        {format(totalLiability)}
                      </span>
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMatchProfitPage;