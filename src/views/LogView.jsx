import PaymentLog from '../components/log/PaymentLog';

export default function LogView({ log, syncEntry, syncAll }) {
  return (
    <div className="view">
      <PaymentLog log={log} syncEntry={syncEntry} syncAll={syncAll} />
    </div>
  );
}
