import { useState } from 'react';
import { STAFF_PIN, ADMIN_PIN } from '../constants/seeds';

const PIN_LENGTH = 4;

export default function PinPad({ onAuth }) {
  const [digits, setDigits] = useState([]);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleDigit(d) {
    if (digits.length >= PIN_LENGTH) return;
    const next = [...digits, d];
    setDigits(next);
    setError(false);

    if (next.length === PIN_LENGTH) {
      const pin = next.join('');
      setTimeout(() => {
        if (pin === ADMIN_PIN) {
          onAuth('admin');
        } else if (pin === STAFF_PIN) {
          onAuth('staff');
        } else {
          setShaking(true);
          setError(true);
          setTimeout(() => {
            setDigits([]);
            setShaking(false);
          }, 600);
        }
      }, 120);
    }
  }

  function handleDelete() {
    setDigits(prev => prev.slice(0, -1));
    setError(false);
  }

  const dots = Array.from({ length: PIN_LENGTH }, (_, i) => ({
    filled: i < digits.length,
    error,
  }));

  return (
    <div className="pinpad-screen anim-fadein">
      <div className="pinpad-top">
        <div className="pinpad-logo">💳</div>
        <h1 className="pinpad-title">PayNow Collect</h1>
        <p className="pinpad-subtitle">Enter your PIN to continue</p>
      </div>

      <div className={`pinpad-dots ${shaking ? 'pinpad-shake' : ''}`}>
        {dots.map((dot, i) => (
          <div
            key={i}
            className={`pinpad-dot ${dot.filled ? 'filled' : ''} ${dot.error && dot.filled ? 'error' : ''}`}
          />
        ))}
      </div>

      {error && <p className="pinpad-error">Incorrect PIN. Try again.</p>}

      <div className="pinpad-grid">
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => {
          if (key === '') return <div key={i} />;
          if (key === '⌫') {
            return (
              <button key={i} className="pinpad-key pinpad-key-del" onClick={handleDelete} disabled={digits.length === 0}>
                ⌫
              </button>
            );
          }
          return (
            <button key={i} className="pinpad-key" onClick={() => handleDigit(key)} disabled={digits.length >= PIN_LENGTH}>
              {key}
            </button>
          );
        })}
      </div>

      <style>{`
        .pinpad-screen {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%; padding: 40px 32px; gap: 0; text-align: center;
          background: var(--surface);
        }
        .pinpad-top { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 40px; }
        .pinpad-logo { font-size: 52px; line-height: 1; margin-bottom: 4px; }
        .pinpad-title { font-size: 26px; font-weight: 700; }
        .pinpad-subtitle { font-size: 15px; color: var(--text-muted); margin-top: 4px; }
        .pinpad-dots {
          display: flex; gap: 14px; margin-bottom: 12px;
          transition: transform 0.1s;
        }
        .pinpad-dot {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid var(--border);
          transition: background 150ms, border-color 150ms;
        }
        .pinpad-dot.filled { background: var(--primary); border-color: var(--primary); }
        .pinpad-dot.filled.error { background: var(--error); border-color: var(--error); }
        .pinpad-error { font-size: 13px; color: var(--error); margin-bottom: 0; min-height: 20px; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .pinpad-shake { animation: shake 0.5s ease; }
        .pinpad-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
          width: 100%; max-width: 280px; margin-top: 32px;
        }
        .pinpad-key {
          height: 64px; border: 1.5px solid var(--border); border-radius: var(--radius);
          font-family: var(--font); font-size: 22px; font-weight: 500;
          background: var(--surface); color: var(--text); cursor: pointer;
          transition: background 120ms, transform 80ms;
          display: flex; align-items: center; justify-content: center;
        }
        .pinpad-key:active { background: var(--bg); transform: scale(0.94); }
        .pinpad-key:disabled { opacity: 0.3; cursor: default; transform: none; }
        .pinpad-key-del { font-size: 18px; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
