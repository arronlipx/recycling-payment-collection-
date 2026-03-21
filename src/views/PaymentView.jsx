import { useState } from 'react';
import StepSelectAccount from '../components/payment/StepSelectAccount';
import StepPaymentDetails from '../components/payment/StepPaymentDetails';
import StepQRDisplay from '../components/payment/StepQRDisplay';
import StepConfirmation from '../components/payment/StepConfirmation';

export default function PaymentView({ accounts, onPaymentComplete }) {
  const [step, setStep] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  function handleSelectAccount(account) {
    setSelectedAccount(account);
    setStep(1);
  }

  function handlePaymentDetails(details) {
    setPaymentDetails(details);
    setStep(2);
  }

  function handleConfirm() {
    if (onPaymentComplete && selectedAccount && paymentDetails) {
      onPaymentComplete({ account: selectedAccount, details: paymentDetails });
    }
    setStep(3);
  }

  function handleReset() {
    setStep(0);
    setSelectedAccount(null);
    setPaymentDetails(null);
  }

  // Steps 2 and 3 are fullscreen (no scroll padding / tab bar overlap needed)
  const isFullscreen = step === 2 || step === 3;

  if (isFullscreen) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'var(--surface)' }}>
        {step === 2 && (
          <StepQRDisplay
            account={selectedAccount}
            paymentDetails={paymentDetails}
            onConfirm={handleConfirm}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepConfirmation
            account={selectedAccount}
            paymentDetails={paymentDetails}
            onReset={handleReset}
          />
        )}
      </div>
    );
  }

  return (
    <div className="view">
      {step === 0 && (
        <StepSelectAccount accounts={accounts} onSelect={handleSelectAccount} />
      )}
      {step === 1 && (
        <StepPaymentDetails
          account={selectedAccount}
          onSubmit={handlePaymentDetails}
          onBack={() => setStep(0)}
        />
      )}
    </div>
  );
}
