export default function TabBar({ activeTab, onTab, role }) {
  const tabs = [
    { id: 'payment', icon: '📲', label: 'Payment' },
    { id: 'log',     icon: '📋', label: 'Log' },
    ...(role === 'admin' ? [{ id: 'settings', icon: '⚙️', label: 'Settings' }] : []),
  ];

  return (
    <nav className="tabbar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tabbar-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTab(tab.id)}
        >
          <span className="tabbar-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
