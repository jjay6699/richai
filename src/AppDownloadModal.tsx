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
          Download the app from the Apple App Store or Google Play Store. You can also open the direct mobile link
          below.
        </p>

        <div className="app-download-modal-actions">
          <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
            Apple App Store
          </a>
          <a href="https://play.google.com/store" target="_blank" rel="noreferrer">
            Google Play Store
          </a>
        </div>

        <a className="app-download-modal-link" href="https://app.richealth.ai/" target="_blank" rel="noreferrer">
          https://app.richealth.ai/
        </a>

        <button type="button" className="app-download-modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AppDownloadModal;
