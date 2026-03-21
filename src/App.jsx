import { useState } from 'react';
import PinPad from './components/PinPad';
import TabBar from './components/TabBar';
import PaymentView from './views/PaymentView';
import LogView from './views/LogView';
import SettingsView from './views/SettingsView';
import { useAccounts } from './hooks/useAccounts';
import { usePaymentLog } from './hooks/usePaymentLog';

export default function App() {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null });
  const [activeTab, setActiveTab] = useState('payment');

  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { log, appendEntry, syncEntry, syncAll } = usePaymentLog();

  function handleAuth(role) {
    setAuth({ isAuthenticated: true, role });
  }

  function handlePaymentComplete({ account, details }) {
    appendEntry({
      accountId: account.id,
      accountName: account.name,
      orderId: details.orderId,
      customerName: details.customerName,
      amount: details.amount,
    });
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="app-shell">
        <PinPad onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {activeTab === 'payment' && (
        <PaymentView
          accounts={accounts}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {activeTab === 'log' && (
        <LogView
          log={log}
          syncEntry={syncEntry}
          syncAll={syncAll}
        />
      )}

      {activeTab === 'settings' && auth.role === 'admin' && (
        <SettingsView
          accounts={accounts}
          addAccount={addAccount}
          updateAccount={updateAccount}
          deleteAccount={deleteAccount}
        />
      )}

      <TabBar
        activeTab={activeTab}
        onTab={setActiveTab}
        role={auth.role}
      />
    </div>
  );
}
