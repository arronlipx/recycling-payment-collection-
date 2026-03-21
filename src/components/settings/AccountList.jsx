export default function AccountList({ accounts, onEdit, onDelete }) {
  function handleDelete(account) {
    if (window.confirm(`Delete "${account.name}"? This cannot be undone.`)) {
      onDelete(account.id);
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏦</div>
        <h3>No accounts yet</h3>
        <p>Tap "Add Account" to create your first payee.</p>
      </div>
    );
  }

  return (
    <div className="settings-list">
      {accounts.map(account => (
        <div key={account.id} className="settings-item card">
          <div className="settings-item-logo">
            {account.logoType === 'emoji'
              ? <span style={{ fontSize: 28 }}>{account.logo}</span>
              : <img src={account.logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }} />
            }
          </div>

          <div className="settings-item-info">
            <div className="settings-item-name">{account.name}</div>
            <div className="settings-item-meta">
              {account.qrType === 'dynamic'
                ? `${account.proxyType === 'uen' ? 'UEN' : 'Mobile'}: ${account.proxyValue}`
                : 'Static QR'
              }
            </div>
            <span className={`pill ${account.qrType === 'dynamic' ? 'pill-synced' : 'pill-pending'}`} style={{ marginTop: 4 }}>
              {account.qrType === 'dynamic' ? '⚡ Dynamic' : '📷 Static'}
            </span>
          </div>

          <div className="settings-item-actions">
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={() => onEdit(account)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={() => handleDelete(account)}
              title="Delete"
              style={{ color: 'var(--error)' }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      <style>{`
        .settings-list { display: flex; flex-direction: column; gap: 10px; }
        .settings-item {
          display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        }
        .settings-item-logo {
          width: 52px; height: 52px; border-radius: var(--radius-sm);
          background: var(--bg); display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .settings-item-info { flex: 1; min-width: 0; }
        .settings-item-name { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .settings-item-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .settings-item-actions { display: flex; gap: 4px; flex-shrink: 0; }
      `}</style>
    </div>
  );
}
