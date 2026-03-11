import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMatchProfitSummary } from "../store/reducer/wrestlingBetHistorySlice";

const AdminMatchProfitPage = ({ mid, onClose }) => {
  const dispatch = useDispatch();
  const { profitSummary, loading, error } = useSelector(
    (state) => state.wrestlingBetHistory
  );

  useEffect(() => {
    if (mid) dispatch(getMatchProfitSummary(mid));
  }, [dispatch, mid]);

  if (!mid) return null;

  const format = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const getNetProfit = (data) => {
    const backStake = data.totalBackStake || 0;
    const layStake = data.totalLayStake || 0;
    const backLiability = data.totalBackProfit || 0;
    const layLiability = data.totalLayLiability || 0;
    return (backStake + layStake) - (backLiability + layLiability);
  };

  const teamEntries = profitSummary
    ? Object.entries(profitSummary.teamSummary)
    : [];

  const maxProfit = Math.max(...teamEntries.map(([, d]) => getNetProfit(d)));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .profit-root {
          font-family: 'Rajdhani', sans-serif;
          background: #0a0c10;
          border: 1px solid #1e2530;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04);
          margin-top: 16px;
        }
        .profit-header {
          background: linear-gradient(135deg, #0f1318 0%, #131920 100%);
          border-bottom: 1px solid #1e2530;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .match-badge {
          background: linear-gradient(135deg, #f0b429, #e07b00);
          color: #000;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .match-title {
          font-size: 20px;
          font-weight: 700;
          color: #e8ecf1;
          letter-spacing: 0.5px;
        }
        .mid-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #4d6080;
          background: #111520;
          border: 1px solid #1e2a3a;
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 4px;
          display: inline-block;
        }
        .close-btn {
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.3);
          color: #f87171;
          padding: 8px 18px;
          border-radius: 8px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .close-btn:hover { background: rgba(220,38,38,0.2); border-color: rgba(220,38,38,0.5); }
        .profit-body { padding: 24px; }
        .status-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: 8px;
          margin-bottom: 20px; font-size: 14px; font-weight: 600;
        }
        .status-loading { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); color: #60a5fa; }
        .status-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(96,165,250,0.2);
          border-top-color: #60a5fa;
          border-radius: 50%;
          animation: spin 0.8s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .team-card {
          background: #0d1117; border: 1px solid #1e2530;
          border-radius: 12px; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s; position: relative;
        }
        .team-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .team-card.top-profit { border-color: #f0b429; box-shadow: 0 0 0 1px rgba(240,180,41,0.15), 0 4px 20px rgba(240,180,41,0.08); }
        .top-badge {
          position: absolute; top: 12px; right: 12px;
          background: linear-gradient(135deg, #f0b429, #e07b00);
          color: #000; font-size: 10px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 3px 8px; border-radius: 4px;
        }
        .card-header {
          background: linear-gradient(135deg, #111620 0%, #0f1418 100%);
          border-bottom: 1px solid #1e2530;
          padding: 14px 18px; display: flex; align-items: center; gap: 10px;
        }
        .team-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: linear-gradient(135deg, #f0b429, #b45309);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: #000; flex-shrink: 0;
        }
        .team-name { font-size: 16px; font-weight: 700; color: #e8ecf1; letter-spacing: 0.5px; }
        .card-body { padding: 16px 18px; }
        .section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #3a4a60;
          margin-bottom: 8px; margin-top: 14px;
        }
        .section-label:first-of-type { margin-top: 0; }
        .stat-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 6px 0; border-bottom: 1px solid #111520;
        }
        .stat-row:last-child { border-bottom: none; }
        .stat-label { font-size: 13px; color: #5a6a80; font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .stat-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .stat-value { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
        .blue { color: #60a5fa; } .green { color: #34d399; } .red { color: #f87171; }
        .purple { color: #a78bfa; } .yellow { color: #f0b429; }
        .totals-section {
          background: #080c10; border: 1px solid #1a2232;
          border-radius: 8px; padding: 12px 14px; margin-top: 12px;
        }
        .total-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
        .total-label { font-size: 13px; font-weight: 600; color: #7a8a9a; }
        .total-value { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; }
        .net-profit-bar {
          margin-top: 12px; padding: 12px 14px; border-radius: 8px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .net-positive { background: rgba(52,211,153,0.07); border: 1px solid rgba(52,211,153,0.2); }
        .net-negative { background: rgba(248,113,113,0.07); border: 1px solid rgba(248,113,113,0.2); }
        .net-label { font-size: 13px; font-weight: 600; color: #6a7a8a; letter-spacing: 0.5px; }
        .net-value { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; }
        .summary-footer {
          margin-top: 20px; background: #0d1117;
          border: 1px solid #1e2530; border-radius: 10px; padding: 16px 20px;
        }
        .footer-title {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #3a4a60; margin-bottom: 12px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 10px;
        }
        .footer-stat {
          background: #080c10; border: 1px solid #1a2232;
          border-radius: 8px; padding: 10px 14px;
        }
        .footer-stat-label { font-size: 11px; color: #4a5a70; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 4px; }
        .footer-stat-value { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; }

        @media (max-width: 640px) {
          .profit-header { padding: 14px 16px; }
          .profit-body { padding: 14px; }
          .match-title { font-size: 16px; }
          .cards-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="profit-root">
        <div className="profit-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="match-badge">Admin View</span>
              <span className="match-title">Match Profit Summary</span>
            </div>
            <div className="mid-tag">MID: {mid}</div>
          </div>
          {onClose && (
            <button className="close-btn" onClick={onClose}>✕ Close</button>
          )}
        </div>

        <div className="profit-body">
          {loading && (
            <div className="status-bar status-loading">
              <div className="spinner" /> Loading profit data...
            </div>
          )}
          {error && (
            <div className="status-bar status-error">⚠ {error}</div>
          )}

          {profitSummary && (
            <>
              <div className="cards-grid">
                {teamEntries.map(([team, data]) => {
                  const totalStake = (data.totalBackStake || 0) + (data.totalLayStake || 0);
                  const totalLiability = (data.totalBackProfit || 0) + (data.totalLayLiability || 0);
                  const netProfit = getNetProfit(data);
                  const isTopProfit = netProfit === maxProfit && teamEntries.length > 1;
                  const isPositive = netProfit >= 0;

                  return (
                    <div key={team} className={`team-card${isTopProfit ? ' top-profit' : ''}`}>
                      {isTopProfit && <span className="top-badge">⭐ Most Profitable</span>}

                      <div className="card-header">
                        <div className="team-icon">{team.charAt(0).toUpperCase()}</div>
                        <div className="team-name">Team {team}</div>
                      </div>

                      <div className="card-body">
                        <div className="section-label">Back Bets</div>
                        <div className="stat-row">
                          <span className="stat-label"><span className="stat-dot" style={{ background: '#60a5fa' }} />Stake Collected</span>
                          <span className="stat-value blue">{format(data.totalBackStake)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label"><span className="stat-dot" style={{ background: '#f87171' }} />Liability (to pay)</span>
                          <span className="stat-value red">{format(data.totalBackProfit)}</span>
                        </div>

                        <div className="section-label">Lay Bets</div>
                        <div className="stat-row">
                          <span className="stat-label"><span className="stat-dot" style={{ background: '#34d399' }} />Stake Collected</span>
                          <span className="stat-value green">{format(data.totalLayStake)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label"><span className="stat-dot" style={{ background: '#f87171' }} />Liability (to pay)</span>
                          <span className="stat-value red">{format(data.totalLayLiability)}</span>
                        </div>

                        <div className="totals-section">
                          <div className="total-row">
                            <span className="total-label">Total Collected</span>
                            <span className="total-value purple">{format(totalStake)}</span>
                          </div>
                          <div className="total-row">
                            <span className="total-label">Total Liability</span>
                            <span className="total-value red">{format(totalLiability)}</span>
                          </div>
                        </div>

                        <div className={`net-profit-bar ${isPositive ? 'net-positive' : 'net-negative'}`}>
                          <span className="net-label">Net Admin Profit</span>
                          <span className={`net-value ${isPositive ? 'green' : 'red'}`}>
                            {isPositive ? '▲' : '▼'} {format(Math.abs(netProfit))}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall Summary Footer */}
              {(() => {
                const totalCollected = teamEntries.reduce((s, [, d]) =>
                  s + (d.totalBackStake || 0) + (d.totalLayStake || 0), 0);
                const totalLiability = teamEntries.reduce((s, [, d]) =>
                  s + (d.totalBackProfit || 0) + (d.totalLayLiability || 0), 0);
                const overallNet = totalCollected - totalLiability;
                const margin = totalCollected > 0 ? ((overallNet / totalCollected) * 100).toFixed(1) : 0;
                return (
                  <div className="summary-footer">
                    <div className="footer-title">Overall Match Summary</div>
                    <div className="footer-grid">
                      <div className="footer-stat">
                        <div className="footer-stat-label">Total Stake In</div>
                        <div className="footer-stat-value purple">{format(totalCollected)}</div>
                      </div>
                      <div className="footer-stat">
                        <div className="footer-stat-label">Total Liability Out</div>
                        <div className="footer-stat-value red">{format(totalLiability)}</div>
                      </div>
                      <div className="footer-stat">
                        <div className="footer-stat-label">Net Admin Profit</div>
                        <div className={`footer-stat-value ${overallNet >= 0 ? 'green' : 'red'}`}>
                          {overallNet >= 0 ? '▲' : '▼'} {format(Math.abs(overallNet))}
                        </div>
                      </div>
                      <div className="footer-stat">
                        <div className="footer-stat-label">Profit Margin</div>
                        <div className={`footer-stat-value ${overallNet >= 0 ? 'green' : 'red'}`}>
                          {margin}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMatchProfitPage;