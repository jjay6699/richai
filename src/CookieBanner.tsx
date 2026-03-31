import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "richai_cookie_consent";

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "dismissed");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="cookie-banner" aria-live="polite" aria-label="Cookie consent banner">
      <div className="cookie-banner-copy">
        <span className="cookie-banner-label">Cookie notice</span>
        <p>
          We use cookies and analytics tools to improve site performance and understand visitor activity. By continuing,
          you agree to our <a href="/cookies">Cookie Policy</a>.
        </p>
      </div>
      <div className="cookie-banner-actions">
        <button type="button" className="cookie-banner-button cookie-banner-button-muted" onClick={handleDismiss}>
          Dismiss
        </button>
        <button type="button" className="cookie-banner-button" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </aside>
  );
}

export default CookieBanner;
