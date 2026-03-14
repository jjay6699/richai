import "./App.css";

const personalizationCards = [
  {
    title: "Bloodwork & DNA decoding",
    text: "Upload clinical reports and get biomarker-level interpretation translated into actionable nutrition guidance."
  },
  {
    title: "Live wearable adaptation",
    text: "Daily sleep, stress, and activity signals help keep the protocol aligned with how the body is doing right now."
  }
];

const supportTiles = [
  "Gut & digestion",
  "Energy & resilience",
  "Blood sugar support",
  "Recovery & inflammation",
  "Immunity & daily wellness",
  "Women's health support"
];

const scienceStats = [
  { value: "500k+", label: "peer-reviewed journals shaping the AI knowledge base" },
  { value: "24/7", label: "AI health advisor access for questions and symptom support" },
  { value: "1 blend", label: "personalized daily formula instead of multiple separate products" },
  { value: "Live", label: "adaptation from wearable and profile updates" }
];

const qualityPoints = [
  "100% natural ingredient philosophy",
  "Personalized formulation logic",
  "Wearable-aware guidance loop",
  "Privacy-first health experience",
  "Human-readable AI health explanations",
  "Designed for long-term daily consistency"
];

const audienceCards = [
  {
    title: "Professionals under constant stress",
    text: "Use wearable and symptom context to adjust support for energy, sleep, and recovery."
  },
  {
    title: "People managing metabolic markers",
    text: "Understand glucose, lifestyle patterns, and nutrition signals in one system."
  },
  {
    title: "Active users focused on recovery",
    text: "Adapt support around exertion, soreness, and daily readiness."
  },
  {
    title: "Users who want clarity from data",
    text: "Turn dense reports into practical next actions instead of isolated lab numbers."
  }
];

const clinicianQuotes = [
  {
    name: "Clinical positioning",
    text: "Designed to bridge the gap between static diagnostics and what the user is actually doing every day."
  },
  {
    name: "Nutrition positioning",
    text: "The blend model makes personalization more practical than asking users to manage multiple separate products."
  },
  {
    name: "Product positioning",
    text: "A more coherent way to connect biomarkers, AI guidance, and natural nutrition into one daily experience."
  }
];

const partners = [
  "Clinics",
  "Diagnostic labs",
  "Corporate wellness",
  "Longevity programs",
  "Health platforms",
  "Nutrition partners",
  "Performance programs",
  "Preventive care groups"
];

const faqs = [
  "How does RicHealth AI personalize the blend?",
  "Can wearable data affect the recommendation over time?",
  "Is the formula made from natural ingredients only?",
  "Can users ask health questions in the app before ordering?",
  "Is this built only for bloodwork users?",
  "Can clinics or partners offer this under collaboration models?"
];

function App() {
  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            R
          </span>
          <span className="brand-copy">
            <strong>RicHealth AI</strong>
            <small>Precision health, blended daily</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#personalization">Personalization</a>
          <a href="#science">Science</a>
          <a href="#quality">Quality</a>
          <a href="#partners">Partners</a>
        </nav>

        <div className="header-actions">
          <a className="text-link" href="#faq">
            FAQ
          </a>
          <a className="button button-primary" href="#cta">
            Get started
          </a>
        </div>
      </header>

      <main>
        <section className="hero-shell">
          <div className="hero hero-left">
            <div className="portrait-stage">
              <div className="portrait-backdrop" />
              <div className="portrait-card">
                <div className="portrait-head" />
                <div className="portrait-body" />
              </div>
              <div className="report-sheet">
                <span className="report-line short" />
                <span className="report-line" />
                <span className="report-line" />
                <span className="report-line short" />
              </div>
            </div>
          </div>

          <div className="hero hero-right">
            <div className="hero-copy">
              <p className="eyebrow">Personalized based on your data</p>
              <h1>Designed around real biomarkers, daily signals, and one blended formula.</h1>
              <p>
                RicHealth AI combines clinical report interpretation, live wearable context, and natural ingredient
                logic to recommend a daily blend shaped around the individual.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#cta">
                  Start now
                </a>
              </div>
            </div>

            <div className="product-stage" aria-hidden="true">
              <div className="spoon">
                <span className="spoon-handle" />
                <span className="spoon-bowl" />
              </div>
              <div className="bottle bottle-main">
                <span className="bottle-cap" />
                <span className="bottle-label">
                  <strong>RicHealth</strong>
                  <small>Personalized daily blend</small>
                </span>
              </div>
              <div className="bottle bottle-small">
                <span className="bottle-cap" />
              </div>
              <div className="powder-bowl" />
            </div>
          </div>
        </section>

        <section className="section intro-grid">
          <div className="intro-copy">
            <p className="eyebrow">Feel the difference</p>
            <h2>From disconnected health inputs to one coherent daily protocol.</h2>
            <p>
              Bloodwork alone is static. Wearables alone are incomplete. Generic supplements are too broad. RicHealth
              AI brings those layers together so the recommendation actually reflects what the user needs.
            </p>
            <a className="button button-primary" href="#personalization">
              See personalization
            </a>
          </div>

          <div className="support-mosaic" aria-label="Support areas">
            {supportTiles.map((tile, index) => (
              <article key={tile} className={`mosaic-card tone-${index + 1}`}>
                <span>{tile}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="personalization">
          <div className="section-heading center">
            <p className="eyebrow">Our process</p>
            <h2>Choose your personalization path.</h2>
            <p>
              The system can start from clinical reports, evolve through live wearable data, and keep adjusting with
              daily profile updates and AI guidance.
            </p>
          </div>

          <div className="personalization-grid">
            {personalizationCards.map((card, index) => (
              <article key={card.title} className={`personalization-card variant-${index + 1}`}>
                <div className="personalization-visual" aria-hidden="true">
                  <div className="mini-spoon" />
                  <div className="mini-bottle" />
                </div>
                <div className="personalization-copy">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <a className="button button-secondary" href="#cta">
                    Learn more
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section feature-split" id="science">
          <div className="feature-photo" aria-hidden="true">
            <div className="lab-frame">
              <div className="lab-circle" />
              <div className="lab-panel" />
            </div>
          </div>

          <div className="feature-copy">
            <p className="eyebrow">Cutting-edge nutritional support</p>
            <h2>Built to interpret health data, then turn it into usable daily support.</h2>
            <p>
              The product experience is not only about recommending ingredients. It is about understanding context:
              biomarkers, wearable patterns, symptoms, and profile changes, then translating that into one simpler
              routine.
            </p>

            <div className="stats-grid">
              {scienceStats.map((stat) => (
                <article key={stat.value + stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section quality-section" id="quality">
          <div className="quality-copy">
            <p className="eyebrow">Quality and positioning</p>
            <h2>Natural ingredient logic, guided by data.</h2>
            <p>
              RicHealth AI is designed around a cleaner promise: use better health inputs, explain them clearly,
              recommend the right ingredients, and make the routine easier to follow by blending them into one daily
              product.
            </p>

            <ul className="quality-list">
              {qualityPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="quality-visual" aria-hidden="true">
            <div className="quality-bottle">
              <span className="quality-cap" />
              <span className="quality-core" />
            </div>
            <div className="quality-spoon" />
          </div>
        </section>

        <section className="section audience-section">
          <div className="section-heading">
            <p className="eyebrow">Who this is for</p>
            <h2>Built for real health journeys, not one user type.</h2>
          </div>

          <div className="audience-grid">
            {audienceCards.map((card, index) => (
              <article key={card.title} className={`audience-card accent-${index + 1}`}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section clinician-section">
          <div className="section-heading center narrow">
            <p className="eyebrow">Positioning</p>
            <h2>Why the model makes sense.</h2>
          </div>

          <div className="quote-grid">
            {clinicianQuotes.map((quote) => (
              <article key={quote.name} className="quote-card">
                <strong>{quote.name}</strong>
                <p>{quote.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section partners-section" id="partners">
          <div className="section-heading center narrow">
            <p className="eyebrow">Our partners</p>
            <h2>A model that can scale through collaborations.</h2>
          </div>

          <div className="partner-rail">
            {partners.map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </section>

        <section className="section cta-section" id="cta">
          <div className="cta-panel">
            <div className="cta-copy">
              <p className="eyebrow">Build the next layer of health guidance</p>
              <h2>Start with better data. End with one daily blend users can actually follow.</h2>
              <p>
                Public-facing experience, app-connected personalization, and a scalable foundation for future partner
                and admin workflows.
              </p>
              <a className="button button-primary" href="mailto:hello@richealth.ai">
                Talk to us
              </a>
            </div>

            <div className="cta-visual" aria-hidden="true">
              <div className="cta-orb orb-a" />
              <div className="cta-orb orb-b" />
              <div className="cta-people">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading center narrow">
            <p className="eyebrow">Frequently asked questions</p>
            <h2>Clear answers for how the platform works.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item} className="faq-item">
                <summary>{item}</summary>
                <p>
                  RicHealth AI is designed to connect clinical inputs, live wearable context, AI guidance, and a
                  personalized natural blend into one clearer daily health experience.
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <strong>RicHealth AI</strong>
          <p>
            Clinical AI, live tracking, and personalized natural nutrition brought together into one daily protocol.
          </p>
        </div>

        <div className="footer-nav">
          <a href="#personalization">Personalization</a>
          <a href="#science">Science</a>
          <a href="#quality">Quality</a>
          <a href="#partners">Partners</a>
        </div>

        <div className="footer-contact">
          <a href="mailto:hello@richealth.ai">hello@richealth.ai</a>
          <a href="/">Download app</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
