import { useState } from 'react';
import { APPS_SCRIPT_URL } from '../../constants/seeds';

export default function PaymentLog({ log, syncEntry, syncAll }) {
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingRow, setSyncingRow] = useState(null);

  const isPlaceholder = APPS_SCRIPT_URL === 'PLACEHOLDER_APPS_SCRIPT_URL';

  async function handleSyncRow(id) {
    if (isPlaceholder) {
      alert('Google Sheets sync URL not configured.\nReplace PLACEHOLDER_APPS_SCRIPT_URL in src/constants/seeds.js');
      return;
    }
    setSyncingRow(id);
    await syncEntry(id);
    setSyncingRow(null);
  }

  async function handleSyncAll() {
    if (isPlaceholder) {
      alert('Google Sheets sync URL not configured.\nReplace PLACEHOLDER_APPS_SCRIPT_URL in src/constants/seeds.js');
      return;
    }
    setSyncingAll(true);
    await syncAll();
    setSyncingAll(false);
  }

  function formatTimestamp(ts) {
    const d = new Date(ts);
    return d.toLocaleString('en-SG', { dateStyle: 'short', timeStyle: 'short' });
  }

  function formatAmount(amount) {
    return 'S$ ' + parseFloat(amount).toLocaleString('en-SG', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }

  const pendingCount = log.filter(e => e.status !== 'synced').length;

  return (
    <div className="view-inner anim-fadein">
      <div className="section-header">
        <div>
          <h2>Payment Log</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {log.length} payment{log.length !== 1 ? 's' : ''} this session
          </p>
        </div>
        {log.length > 0 && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleSyncAll}
            disabled={syncingAll || pendingCount === 0}
            style={{ width: 'auto', whiteSpace: 'nowrap' }}
          >
            {syncingAll
              ? <><span className="spinner spinner-dark" /> Syncing…</>
              : `↑ Sync All${pendingCount > 0 ? ` (${pendingCount})` : ''}`
            }
          </button>
        )}
      </div>

      {isPlaceholder && (
        <div className="sync-notice">
          <span>⚠️</span>
          <span>Sheets sync not configured — replace <code>PLACEHOLDER_APPS_SCRIPT_URL</code> in seeds.js</span>
        </div>
      )}

      {log.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No payments yet</h3>
          <p>Completed payments will appear here</p>
        </div>
      ) : (
        <div className="log-list">
          {log.map((entry) => (
            <div key={entry.id} className="log-entry card">
              <div className="log-entry-top">
                <div className="log-entry-main">
                  <div className="log-entry-amount">{formatAmount(entry.amount)}</div>
                  <div className="log-entry-account">{entry.accountName}</div>
                </div>
                <span className={`pill pill-${entry.status}`}>
                  {entry.status === 'pending' && '⏳ Pending'}
                  {entry.status === 'synced'  && '✓ Synced'}
                  {entry.status === 'error'   && '✗ Error'}
                </span>
              </div>

              <div className="divider" style={{ margin: '10px 0' }} />

              <div className="log-entry-meta">
                <div className="log-meta-row">
                  <span className="log-meta-label">Order ID</span>
                  <span className="log-meta-val">{entry.orderId}</span>
                </div>
                <div className="log-meta-row">
                  <span className="log-meta-label">Customer</span>
                  <span className="log-meta-val">{entry.customerName}</span>
                </div>
                <div className="log-meta-row">
                  <span className="log-meta-label">Time</span>
                  <span className="log-meta-val">{formatTimestamp(entry.timestamp)}</span>
                </div>
              </div>

              <button
                className="btn btn-ghost btn-sm log-sync-btn"
                onClick={() => handleSyncRow(entry.id)}
                disabled={syncingRow === entry.id || entry.status === 'synced'}
              >
                {syncingRow === entry.id
                  ? <><span className="spinner spinner-dark" /> Syncing</>
                  : entry.status === 'synced'
                    ? '✓ Synced to Sheets'
                    : '↑ Sync to Sheets'
                }
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .sync-notice {
          display: flex; gap: 8px; align-items: flex-start;
          background: #fef3c7; border: 1.5px solid #fde68a;
          border-radius: var(--radius-sm); padding: 10px 14px;
          font-size: 13px; color: #92400e; margin-bottom: 16px;
        }
        .sync-notice code { font-family: monospace; font-size: 12px; }
        .log-list { display: flex; flex-direction: column; gap: 12px; }
        .log-entry { padding: 16px; }
        .log-entry-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .log-entry-amount { font-size: 20px; font-weight: 700; }
        .log-entry-account { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
        .log-entry-meta { display: flex; flex-direction: column; gap: 6px; }
        .log-meta-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .log-meta-label { font-size: 12px; color: var(--text-muted); }
        .log-meta-val { font-size: 13px; font-weight: 500; text-align: right; }
        .log-sync-btn { margin-top: 12px; color: var(--accent) !important; font-size: 13px !important; }
        .log-sync-btn:disabled { color: var(--text-light) !important; }
      `}</style>
    </div>
  );
}
