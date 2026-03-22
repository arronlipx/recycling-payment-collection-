import { useState } from 'react';
import AccountList from '../components/settings/AccountList';
import AccountForm from '../components/settings/AccountForm';

export default function SettingsView({ accounts, addAccount, updateAccount, deleteAccount }) {
  const [formState, setFormState] = useState(null); // null | { mode: 'add' } | { mode: 'edit', account }

  function handleAdd() { setFormState({ mode: 'add' }); }
  function handleEdit(account) { setFormState({ mode: 'edit', account }); }
  function handleClose() { setFormState(null); }

  function handleSave(data) {
    if (formState.mode === 'edit') {
      updateAccount(formState.account.id, data);
    } else {
      addAccount(data);
    }
    setFormState(null);
  }

  return (
    <>
      <div className="view">
        <div className="view-inner anim-fadein">
          <div className="section-header">
            <div>
              <h2>Payee Accounts</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {accounts.length} account{accounts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: 'auto', whiteSpace: 'nowrap' }}
              onClick={handleAdd}
            >
              + Add Account
            </button>
          </div>

          <AccountList
            accounts={accounts}
            onEdit={handleEdit}
            onDelete={deleteAccount}
          />

          <div className="settings-footer">
            <p>Changes are saved automatically and persist across sessions.</p>
          </div>
        </div>
      </div>

      {formState && (
        <AccountForm
          account={formState.mode === 'edit' ? formState.account : null}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      <style>{`
        .settings-footer {
          margin-top: 32px; text-align: center;
          font-size: 12px; color: var(--text-light);
        }
      `}</style>
    </>
  );
}
