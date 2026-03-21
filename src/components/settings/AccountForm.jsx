import { useState } from 'react';

const EMOJI_OPTIONS = [
  '🏪','🏬','🥡','🍱','🛒','♻️','🚚','🏭','🍜','🥘',
  '🍔','🥗','☕','🧃','🌿','💊','📦','🎁','🛵','⚡',
];

const defaultForm = {
  name: '',
  logo: '🏪',
  logoType: 'emoji',
  qrType: 'dynamic',
  proxyType: 'uen',
  proxyValue: '',
  staticImage: '',
  customLogoUrl: '',
};

export default function AccountForm({ account, onSave, onClose }) {
  const isEdit = Boolean(account);
  const [form, setForm] = useState(() =>
    account
      ? {
          ...defaultForm,
          ...account,
          customLogoUrl: account.logoType === 'url' ? account.logo : '',
        }
      : defaultForm
  );
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function handleEmojiPick(emoji) {
    update('logo', emoji);
    update('logoType', 'emoji');
  }

  function handleLogoUrlChange(e) {
    const url = e.target.value;
    update('customLogoUrl', url);
    update('logo', url);
    update('logoType', 'url');
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result;
      update('logo', b64);
      update('logoType', 'base64');
      update('staticImage', b64); // also store as QR image
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleQRFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      update('staticImage', ev.target.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Account name is required';
    if (form.qrType === 'dynamic' && !form.proxyValue.trim()) {
      e.proxyValue = 'PayNow identifier is required';
    }
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const saved = {
      name: form.name.trim(),
      logo: form.logo,
      logoType: form.logoType,
      qrType: form.qrType,
      proxyType: form.proxyType,
      proxyValue: form.qrType === 'dynamic' ? form.proxyValue.trim() : '',
      staticImage: form.qrType === 'static' ? form.staticImage : '',
    };
    onSave(saved);
  }

  const LogoPreview = () => (
    <div className="logo-preview">
      {form.logoType === 'emoji'
        ? <span style={{ fontSize: 36 }}>{form.logo}</span>
        : <img src={form.logo} alt="logo" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8 }} />
      }
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>{isEdit ? 'Edit Account' : 'Add Account'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ width: 'auto' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Account Name */}
          <div className="form-group">
            <label className="form-label">Account Name *</label>
            <input
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Rolo Central Kitchen"
              value={form.name}
              onChange={e => update('name', e.target.value)}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Logo */}
          <div className="form-group">
            <label className="form-label">Logo / Icon</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <LogoPreview />
              <div style={{ flex: 1 }}>
                <div className="toggle-group" style={{ marginBottom: 8 }}>
                  <button type="button" className={`toggle-btn ${form.logoType === 'emoji' ? 'active' : ''}`} onClick={() => update('logoType', 'emoji')}>Emoji</button>
                  <button type="button" className={`toggle-btn ${form.logoType !== 'emoji' ? 'active' : ''}`} onClick={() => update('logoType', 'url')}>Image</button>
                </div>
                {form.logoType !== 'emoji' && (
                  <input
                    className="form-input"
                    style={{ fontSize: 13, padding: '9px 12px' }}
                    placeholder="Image URL"
                    value={form.customLogoUrl}
                    onChange={handleLogoUrlChange}
                  />
                )}
              </div>
            </div>
            {form.logoType === 'emoji' && (
              <div className="emoji-grid">
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    type="button"
                    className={`emoji-btn ${form.logo === e ? 'active' : ''}`}
                    onClick={() => handleEmojiPick(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* QR Type */}
          <div className="form-group">
            <label className="form-label">QR Type</label>
            <div className="toggle-group">
              <button type="button" className={`toggle-btn ${form.qrType === 'dynamic' ? 'active' : ''}`} onClick={() => update('qrType', 'dynamic')}>
                ⚡ Dynamic (Generated)
              </button>
              <button type="button" className={`toggle-btn ${form.qrType === 'static' ? 'active' : ''}`} onClick={() => update('qrType', 'static')}>
                📷 Static (Upload)
              </button>
            </div>
          </div>

          {/* Dynamic fields */}
          {form.qrType === 'dynamic' && (
            <>
              <div className="form-group">
                <label className="form-label">PayNow Identifier Type</label>
                <div className="toggle-group">
                  <button type="button" className={`toggle-btn ${form.proxyType === 'uen' ? 'active' : ''}`} onClick={() => update('proxyType', 'uen')}>UEN</button>
                  <button type="button" className={`toggle-btn ${form.proxyType === 'mobile' ? 'active' : ''}`} onClick={() => update('proxyType', 'mobile')}>Mobile No.</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {form.proxyType === 'uen' ? 'UEN Number *' : 'Mobile Number *'}
                </label>
                <input
                  className={`form-input ${errors.proxyValue ? 'input-error' : ''}`}
                  placeholder={form.proxyType === 'uen' ? 'e.g. 202312345A' : '+6591234567'}
                  value={form.proxyValue}
                  onChange={e => update('proxyValue', e.target.value)}
                />
                {errors.proxyValue && <span className="field-error">{errors.proxyValue}</span>}
              </div>
            </>
          )}

          {/* Static fields */}
          {form.qrType === 'static' && (
            <div className="form-group">
              <label className="form-label">QR Code Image</label>
              {form.staticImage && (
                <img
                  src={form.staticImage}
                  alt="QR preview"
                  style={{ width: 120, height: 120, objectFit: 'contain', border: '1.5px solid var(--border)', borderRadius: 8, marginBottom: 8 }}
                />
              )}
              <label className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: 8 }}>
                {uploading ? 'Uploading…' : '📁 Upload QR Image'}
                <input type="file" accept="image/*" onChange={handleQRFileUpload} style={{ display: 'none' }} />
              </label>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>or paste a URL:</span>
              <input
                className="form-input"
                style={{ fontSize: 13, padding: '9px 12px', marginTop: 6 }}
                placeholder="https://example.com/qr.png"
                value={form.qrType === 'static' && !form.staticImage.startsWith('data:') ? form.staticImage : ''}
                onChange={e => update('staticImage', e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>

        <style>{`
          .logo-preview {
            width: 64px; height: 64px; border-radius: var(--radius-sm);
            background: var(--bg); border: 1.5px solid var(--border);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
          }
          .emoji-grid {
            display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px;
          }
          .emoji-btn {
            font-size: 20px; padding: 6px; border-radius: 6px;
            border: 1.5px solid transparent; background: var(--bg);
            cursor: pointer; transition: background 100ms, border-color 100ms;
            line-height: 1;
          }
          .emoji-btn:hover { background: var(--border-light); }
          .emoji-btn.active { border-color: var(--accent); background: var(--accent-light); }
          .input-error { border-color: var(--error) !important; }
          .field-error { font-size: 12px; color: var(--error); }
        `}</style>
      </div>
    </div>
  );
}
