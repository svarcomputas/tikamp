import { Button } from 'flowbite-react';
import React from 'react';

const ErrorDisplay: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ margin: '2rem', textAlign: 'center' }}>
      <h2>Oops! Det har skjedd en feil</h2>
      <p>Prøv å oppdater siden</p>
      <Button onClick={handleRefresh}>Oppdater Side</Button>
    </div>
  );
};
export default ErrorDisplay;