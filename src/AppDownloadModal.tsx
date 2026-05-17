import { useEffect } from "react";

type AppDownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AppDownloadModal({ isOpen, onClose }: AppDownloadModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="app-download-modal-backdrop" onClick={onClose}>
      <div
        className="app-download-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-download-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="app-download-modal-kicker">Get the RicHealth AI app</p>
        <h3 id="app-download-modal-title">Start your health journey on mobile</h3>
        <p className="app-download-modal-copy">
          The Apple App Store and Google Play Store versions are coming soon. You can still open the RicHealth web app
          on your phone today.
        </p>

        <div className="app-download-modal-availability" aria-label="App store availability">
          <div className="app-download-modal-store-card">
            <div className="app-download-modal-store-top">
              <span className="app-download-modal-store-name">Apple App Store</span>
              <span className="app-download-modal-store-badge">Coming soon</span>
            </div>
            <p className="app-download-modal-store-copy">Native iPhone app is in progress.</p>
          </div>
          <div className="app-download-modal-store-card">
            <div className="app-download-modal-store-top">
              <span className="app-download-modal-store-name">Google Play Store</span>
              <span className="app-download-modal-store-badge">Coming soon</span>
            </div>
            <p className="app-download-modal-store-copy">Native Android app is coming shortly.</p>
          </div>
        </div>

        <a className="app-download-modal-open-web" href="https://app.richealth.ai/" target="_blank" rel="noreferrer">
          Open RicHealth Web App
        </a>

        <button type="button" className="app-download-modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AppDownloadModal;
