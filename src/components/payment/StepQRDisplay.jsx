import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { buildPayNowString } from '../../utils/paynow';

export default function StepQRDisplay({ account, paymentDetails, onConfirm, onBack }) {
  const { amount, orderId, customerName } = paymentDetails;

  const qrValue = useMemo(() => {
    if (account.qrType === 'dynamic') {
      return buildPayNowString({
        proxyType: account.proxyType,
        proxyValue: account.proxyValue,
        amount: amount,
        billRef: orderId,
        merchantName: account.name,
      });
    }
    return null;
  }, [account, amount, orderId]);

  const formattedAmount = parseFloat(amount).toLocaleString('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const LogoDisplay = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 22 }}>
        {account.logoType === 'emoji'
          ? account.logo
          : <img src={account.logo} alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
        }
      </span>
      <span style={{ fontWeight: 600, fontSize: 15 }}>{account.name}</span>
    </div>
  );

  return (
    <div className="qr-screen anim-fadein">
      {/* Header */}
      <div className="qr-header">
        <button className="btn btn-ghost btn-sm qr-back" onClick={onBack}>
          ←
        </button>
        <LogoDisplay />
        <div style={{ width: 40 }} />
      </div>

      {/* Amount */}
      <div className="qr-amount-section">
        <div className="qr-amount-label">Amount to Collect</div>
        <div className="qr-amount">S$ {formattedAmount}</div>
        <div className="qr-orderid">Order: {orderId}</div>
        {customerName && <div className="qr-customer">{customerName}</div>}
      </div>

      {/* QR Code */}
      <div className="qr-code-wrapper anim-scalein">
        {account.qrType === 'dynamic' ? (
          <div className="qr-code-box">
            <QRCodeSVG
              value={qrValue}
              size={252}
              level="M"
              bgColor="#ffffff"
              fgColor="#18181b"
            />
          </div>
        ) : account.staticImage ? (
          <div className="qr-code-box">
            <img
              src={account.staticImage}
              alt="PayNow QR Code"
              style={{ width: 252, height: 252, objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div className="qr-code-box qr-missing">
            <div style={{ fontSize: 48 }}>📷</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              No QR image uploaded.<br />Ask admin to add one in Settings.
            </p>
          </div>
        )}
      </div>

      <p className="qr-instruction">Ask customer to scan with their banking app</p>

      {/* Confirm button */}
      <div className="qr-footer">
        <button className="btn btn-primary" onClick={onConfirm}>
          ✓ Payment Received
        </button>
      </div>

      <style>{`
        .qr-screen {
          display: flex; flex-direction: column; align-items: center;
          height: 100%; background: var(--surface);
          padding: 0; overflow-y: auto;
        }
        .qr-header {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1.5px solid var(--border);
          position: sticky; top: 0; background: var(--surface); z-index: 10;
        }
        .qr-back {
          width: auto !important; padding: 8px 12px !important;
          color: var(--text-muted); font-size: 16px;
        }
        .qr-amount-section {
          text-align: center; padding: 28px 24px 20px; width: 100%;
        }
        .qr-amount-label {
          font-size: 12px; font-weight: 500; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
        }
        .qr-amount {
          font-size: 52px; font-weight: 700; letter-spacing: -1px;
          color: var(--text); line-height: 1;
        }
        .qr-orderid {
          font-size: 14px; color: var(--text-muted); margin-top: 10px; font-weight: 500;
        }
        .qr-customer {
          font-size: 13px; color: var(--text-light); margin-top: 3px;
        }
        .qr-code-wrapper {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 0 20px;
        }
        .qr-code-box {
          padding: 20px; background: #fff;
          border: 2px solid var(--border); border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-width: 292px; min-height: 292px;
          gap: 12px;
        }
        .qr-missing { gap: 12px; }
        .qr-instruction {
          font-size: 13px; color: var(--text-muted); text-align: center;
          padding: 16px 24px 8px;
        }
        .qr-footer {
          width: 100%; padding: 16px 20px 32px;
        }
      `}</style>
    </div>
  );
}
