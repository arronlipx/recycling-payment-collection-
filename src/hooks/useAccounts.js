import { useState, useEffect } from 'react';
import { storageGet, storageSet } from '../utils/storage';
import { SEED_ACCOUNTS } from '../constants/seeds';

const STORAGE_KEY = 'pnc_accounts';
const SEEDED_KEY = 'pnc_seeded';

export function useAccounts() {
  const [accounts, setAccounts] = useState(() => {
    const saved = storageGet(STORAGE_KEY, null);
    // First load: seed placeholder accounts
    if (!saved && !storageGet(SEEDED_KEY)) {
      storageSet(SEEDED_KEY, true);
      storageSet(STORAGE_KEY, SEED_ACCOUNTS);
      return SEED_ACCOUNTS;
    }
    return saved || SEED_ACCOUNTS;
  });

  // Persist on every change
  useEffect(() => {
    storageSet(STORAGE_KEY, accounts);
  }, [accounts]);

  function addAccount(account) {
    const newAccount = { ...account, id: crypto.randomUUID() };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  }

  function updateAccount(id, updates) {
    setAccounts(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  }

  function deleteAccount(id) {
    setAccounts(prev => prev.filter(a => a.id !== id));
  }

  return { accounts, addAccount, updateAccount, deleteAccount };
}
