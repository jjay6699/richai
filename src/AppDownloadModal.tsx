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
        <p>
          The Apple App Store and Google Play Store versions are coming soon. You can still open the RicHealth web app
          on your phone today.
        </p>

        <div className="app-download-modal-actions">
          <button type="button" className="app-download-modal-disabled" disabled>
            Apple App Store - Coming soon
          </button>
          <button type="button" className="app-download-modal-disabled" disabled>
            Google Play Store - Coming soon
          </button>
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
