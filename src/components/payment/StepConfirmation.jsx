import { useEffect } from 'react';

export default function StepConfirmation({ account, paymentDetails, onReset }) {
  const { amount, orderId, customerName } = paymentDetails;

  const formattedAmount = parseFloat(amount).toLocaleString('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Auto-reset after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onReset, 4000);
    return () => clearTimeout(timer);
  }, [onReset]);

  return (
    <div className="confirm-screen anim-fadein">
      <div className="confirm-icon anim-successpop">✓</div>
      <h2 className="confirm-title">Payment Received</h2>
      <p className="confirm-sub">S$ {formattedAmount}</p>

      <div className="confirm-details card">
        <div className="confirm-row">
          <span className="confirm-row-label">Account</span>
          <span className="confirm-row-val">
            {account.logoType === 'emoji' ? account.logo + ' ' : ''}{account.name}
          </span>
        </div>
        <div className="divider" />
        <div className="confirm-row">
          <span className="confirm-row-label">Order ID</span>
          <span className="confirm-row-val">{orderId}</span>
        </div>
        {customerName && (
          <>
            <div className="divider" />
            <div className="confirm-row">
              <span className="confirm-row-label">Customer</span>
              <span className="confirm-row-val">{customerName}</span>
            </div>
          </>
        )}
      </div>

      <p className="confirm-auto">Returning to account selection…</p>

      <button className="btn btn-secondary" onClick={onReset} style={{ marginTop: 8 }}>
        Next Delivery
      </button>

      <style>{`
        .confirm-screen {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%; padding: 40px 24px; text-align: center; gap: 0;
          background: var(--surface);
        }
        .confirm-icon {
          width: 88px; height: 88px; border-radius: 50%;
          background: var(--success-light); color: var(--success);
          font-size: 42px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .confirm-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .confirm-sub { font-size: 22px; font-weight: 600; color: var(--success); margin-bottom: 32px; }
        .confirm-details {
          width: 100%; padding: 18px 20px; margin-bottom: 24px;
          text-align: left;
        }
        .confirm-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .confirm-row-label { font-size: 13px; color: var(--text-muted); }
        .confirm-row-val { font-size: 14px; font-weight: 500; text-align: right; }
        .confirm-auto { font-size: 12px; color: var(--text-light); margin-bottom: 16px; }
      `}</style>
    </div>
  );
}
