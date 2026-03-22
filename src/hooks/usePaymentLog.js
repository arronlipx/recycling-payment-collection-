import { useState, useEffect } from 'react';
import { storageGet, storageSet } from '../utils/storage';
import { APPS_SCRIPT_URL } from '../constants/seeds';

const STORAGE_KEY = 'pnc_log';

export function usePaymentLog() {
  const [log, setLog] = useState(() => storageGet(STORAGE_KEY, []));

  useEffect(() => {
    storageSet(STORAGE_KEY, log);
  }, [log]);

  function appendEntry(entry) {
    const newEntry = {
      id: crypto.randomUUID(),
      ...entry,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setLog(prev => [newEntry, ...prev]);
    return newEntry;
  }

  async function syncEntry(id) {
    const entry = log.find(e => e.id === id);
    if (!entry) return;

    // Mark as syncing (we re-use 'pending' while request is in-flight)
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName: entry.accountName,
          orderId: entry.orderId,
          customerName: entry.customerName,
          amount: entry.amount,
          timestamp: entry.timestamp,
        }),
      });
      const ok = res.ok || res.status === 302; // Apps Script redirects on success
      setLog(prev =>
        prev.map(e => (e.id === id ? { ...e, status: ok ? 'synced' : 'error' } : e))
      );
    } catch {
      setLog(prev =>
        prev.map(e => (e.id === id ? { ...e, status: 'error' } : e))
      );
    }
  }

  async function syncAll() {
    const pending = log.filter(e => e.status !== 'synced');
    await Promise.all(pending.map(e => syncEntry(e.id)));
  }

  return { log, appendEntry, syncEntry, syncAll };
}
