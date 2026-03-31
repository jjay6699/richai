import SiteLogo from "./SiteLogo";

function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand-block">
            <a className="site-footer-brand" href="/" aria-label="RicHealth AI home">
              <SiteLogo className="site-footer-logo" />
            </a>
            <p className="site-footer-summary">
              Precision wellness built around personal health data, live lifestyle signals, and personalized natural
              nutrition.
            </p>
          </div>

          <div className="site-footer-columns">
            <div className="site-footer-column">
              <span className="site-footer-heading">Platform</span>
              <a href="/#solution">How it works</a>
              <a href="/#product">Your blend</a>
              <a href="/ingredients">Ingredients</a>
              <a href="/#technology">Technology & trust</a>
            </div>

            <div className="site-footer-column">
              <span className="site-footer-heading">Company</span>
              <a href="/">About</a>
              <a href="/contact">Contact</a>
              <a href="/">Social Media</a>
            </div>

            <div className="site-footer-column">
              <span className="site-footer-heading">Legal</span>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
              <a href="/cookies">Cookies</a>
              <a href="/shipping-and-return-policy">Shipping and return policy</a>
            </div>

            <div className="site-footer-column">
              <span className="site-footer-heading">Reach us</span>
              <a href="mailto:hello@richealth.ai">hello@richealth.ai</a>
              <a href="tel:+60164476899">+60164476899</a>
              <span className="site-footer-meta">Mon to Fri, 9:00 AM to 6:00 PM</span>
            </div>
          </div>
        </div>

        <div className="site-footer-disclaimers" aria-label="Important disclaimers">
          <div className="site-footer-disclaimer">
            <span className="site-footer-heading">Health & Supplement Disclaimer</span>
            <p className="site-footer-meta">
              The content provided by RicHealth AI and our personalized nutritional blends are designed to support
              general wellness and a healthy lifestyle. This product is not intended to diagnose, treat, cure, or
              prevent any disease. Always consult with a qualified healthcare professional before starting any new
              dietary supplement, especially if you are pregnant, nursing, have a known medical condition, or are
              taking medication.
            </p>
          </div>

          <div className="site-footer-disclaimer">
            <span className="site-footer-heading">AI & Software Disclaimer</span>
            <p className="site-footer-meta">
              RicHealth AI is a lifestyle and wellness tool. It does not constitute a medical device. The insights,
              analysis, and recommendations provided by our AI advisor are for educational and informational purposes
              only and should never be used as a substitute for professional medical advice, diagnosis, or treatment.
              In the event of a medical emergency, please contact your local healthcare provider immediately.
            </p>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span className="site-footer-meta">© 2026 RicHealth AI. All rights reserved.</span>
          <span className="site-footer-meta">Affordable subscription plan and personalized nutrition.</span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
