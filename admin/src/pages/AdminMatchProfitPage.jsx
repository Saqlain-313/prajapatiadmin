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
        <>
          {/* ================= TEAM SUMMARY ================= */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {Object.entries(profitSummary.teamSummary).map(
              ([team, data]) => (
                <div
                  key={team}
                  className="bg-gray-800 p-4 rounded"
                >
                  <h3 className="text-yellow-400 mb-3">
                    Team {team}
                  </h3>

                  <p>Back Stake: {format(data.backStake)}</p>
                  <p>Back Profit (Liability): {format(data.backProfit)}</p>
                  <p>Lay Stake: {format(data.layStake)}</p>
                  <p>Lay Liability: {format(data.layLiability)}</p>
                </div>
              )
            )}
          </div>

          {/* ================= SCENARIOS ================= */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {Object.entries(profitSummary.scenarios).map(
              ([scenario, data]) => (
                <div
                  key={scenario}
                  className="bg-gray-800 p-4 rounded"
                >
                  <h3 className="capitalize mb-2">
                    {scenario.replace("_", " ")}
                  </h3>

                  <p
                    className={`text-lg font-bold ${
                      data.adminProfit >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {format(data?.adminProfit)}
                  </p>
                </div>
              )
            )}
          </div>

          {/* ================= BEST OUTCOME ================= */}
          <div className="bg-black/40 border border-white/10 p-4 rounded">
            <h3 className="text-blue-400 font-semibold mb-2">
              Best Outcome For Admin
            </h3>

            <p className="text-lg font-bold">
              {profitSummary.betterSide}
            </p>

            <p
              className={`text-xl font-bold ${
                profitSummary.betterProfit >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {format(profitSummary?.betterProfit)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMatchProfitPage;