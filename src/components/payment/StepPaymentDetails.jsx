import { useState } from 'react';

export default function StepPaymentDetails({ account, onSubmit, onBack }) {
  const [form, setForm] = useState({
    amount: '',
    orderId: '',
    customerName: '',
    deliveryAddress: '',
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e = {};
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid amount';
    if (!form.orderId.trim()) e.orderId = 'Order ID is required';
    if (!form.customerName.trim()) e.customerName = 'Customer name is required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  }

  const AccountBadge = () => (
    <div className="paying-badge">
      <span className="paying-badge-label">Paying to</span>
      <div className="paying-badge-account">
        <span style={{ fontSize: 18 }}>
          {account.logoType === 'emoji'
            ? account.logo
            : <img src={account.logo} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
          }
        </span>
        <span className="paying-badge-name">{account.name}</span>
      </div>
    </div>
  );

  return (
    <div className="view-inner anim-fadein">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ width: 'auto', padding: '8px 12px' }}>
          ← Back
        </button>
      </div>

      <AccountBadge />

      <h2 style={{ marginBottom: 20, marginTop: 16 }}>Payment Details</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="form-group">
          <label className="form-label">Amount (SGD) *</label>
          <input
            className={`form-input ${errors.amount ? 'input-error' : ''}`}
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={e => update('amount', e.target.value)}
            inputMode="decimal"
          />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Order ID *</label>
          <input
            className={`form-input ${errors.orderId ? 'input-error' : ''}`}
            type="text"
            placeholder="e.g. ORD-20240321-001"
            value={form.orderId}
            onChange={e => update('orderId', e.target.value)}
          />
          {errors.orderId && <span className="field-error">{errors.orderId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Customer Name *</label>
          <input
            className={`form-input ${errors.customerName ? 'input-error' : ''}`}
            type="text"
            placeholder="Full name"
            value={form.customerName}
            onChange={e => update('customerName', e.target.value)}
          />
          {errors.customerName && <span className="field-error">{errors.customerName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Address</label>
          <textarea
            className="form-input"
            placeholder="Blk 123 Ang Mo Kio Ave 3, #04-56"
            value={form.deliveryAddress}
            onChange={e => update('deliveryAddress', e.target.value)}
            rows={2}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
          Show QR Code →
        </button>
      </form>

      <style>{`
        .paying-badge {
          background: var(--accent-light);
          border: 1.5px solid #bae6fd;
          border-radius: var(--radius);
          padding: 12px 16px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .paying-badge-label { font-size: 11px; font-weight: 500; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
        .paying-badge-account { display: flex; align-items: center; gap: 8px; }
        .paying-badge-name { font-size: 15px; font-weight: 600; color: var(--text); }
        .input-error { border-color: var(--error) !important; }
        .field-error { font-size: 12px; color: var(--error); }
      `}</style>
    </div>
  );
}
