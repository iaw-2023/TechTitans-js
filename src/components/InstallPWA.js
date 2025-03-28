import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    // Captura el evento 'beforeinstallprompt' para habilitar la instalación
    const handler = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA instalada correctamente');
        } else {
          console.log('El usuario canceló la instalación');
        }
        setPromptEvent(null);
      });
    }
  };

  return (
    <div className="install-pwa-container">
      {promptEvent && (
        <button onClick={handleInstallClick} className="install-pwa-button">
          
        </button>
      )}
    </div>
  );
};

export default InstallPWA;
