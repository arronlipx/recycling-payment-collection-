export default function StepSelectAccount({ accounts, onSelect }) {
  if (accounts.length === 0) {
    return (
      <div className="view-inner anim-fadein">
        <div className="empty-state">
          <div className="empty-icon">🏦</div>
          <h3>No accounts set up</h3>
          <p>Ask your admin to add payee accounts in Settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-inner anim-fadein">
      <div style={{ marginBottom: 24 }}>
        <h2>Select Account</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
          Choose the payee for this delivery
        </p>
      </div>

      <div className="account-grid">
        {accounts.map((account, i) => (
          <button
            key={account.id}
            className="account-card anim-fadein"
            style={{ animationDelay: `${i * 50}ms` }}
            onClick={() => onSelect(account)}
          >
            <div className="account-card-logo">
              {account.logoType === 'emoji'
                ? account.logo
                : <img src={account.logo} alt={account.name} className="account-logo-img" />
              }
            </div>
            <div className="account-card-name">{account.name}</div>
            <div className="account-card-type">
              {account.qrType === 'dynamic' ? '⚡ Dynamic QR' : '📷 Static QR'}
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .account-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .account-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 24px 16px;
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; cursor: pointer; text-align: center;
          transition: border-color 150ms, box-shadow 150ms, transform 120ms;
          box-shadow: var(--shadow-sm);
          font-family: var(--font); width: 100%;
        }
        .account-card:hover { border-color: var(--accent); box-shadow: var(--shadow); }
        .account-card:active { transform: scale(0.97); }
        .account-card-logo {
          font-size: 36px; line-height: 1;
          width: 60px; height: 60px; border-radius: 50%;
          background: var(--bg); display: flex; align-items: center; justify-content: center;
        }
        .account-logo-img { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; }
        .account-card-name { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.3; }
        .account-card-type { font-size: 11px; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
