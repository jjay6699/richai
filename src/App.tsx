import "./App.css";

const trustItems = [
  "Clinical-AI analysis of bloodwork and DNA reports",
  "Live wearable data for daily adaptation",
  "100% natural ingredients blended into one formula",
  "Private-by-design health experience"
];

const steps = [
  {
    index: "01",
    title: "Decode your baseline",
    text: "Upload bloodwork or DNA reports and turn dense biomarkers into clear next actions."
  },
  {
    index: "02",
    title: "Sync daily signals",
    text: "Connect wearable data so sleep, stress, recovery, and activity shape the plan in real time."
  },
  {
    index: "03",
    title: "Receive one personalized blend",
    text: "Your recommended ingredients are combined into a single daily formula tailored to your needs."
  },
  {
    index: "04",
    title: "Track and adapt",
    text: "Use daily insights, AI chat, and health tracking to keep your protocol aligned with your current condition."
  }
];

const featureCards = [
  {
    tone: "blue",
    title: "Clinical baseline",
    text: "Recommendations start from actual biomarkers instead of generic wellness assumptions."
  },
  {
    tone: "mint",
    title: "Dynamic health loop",
    text: "The platform adapts to what your body looks like now, not just what your report showed weeks ago."
  },
  {
    tone: "peach",
    title: "Natural formulation",
    text: "Every blend is built from plant-based, functional ingredients designed for everyday use."
  }
];

const ingredientGroups = [
  {
    label: "Vital greens & bases",
    items: "Spirulina, Chlorella, Wheatgrass, Moringa, Kale, Broccoli, Pea Protein, Psyllium Husk"
  },
  {
    label: "Antioxidant berries",
    items: "Acai, Blueberry, Cranberry, Strawberry, Maqui Berry, Pomegranate"
  },
  {
    label: "Functional support",
    items: "Turmeric, Maca, Mushroom extracts, digestive and performance-focused superfoods"
  }
];

const highlights = [
  "24/7 AI Health Advisor",
  "Daily health insights",
  "Bloodwork understanding",
  "Wearable sync",
  "Natural blend recommendation",
  "Ongoing profile tracking"
];

const partnerCards = [
  "Remote patient monitoring support",
  "Co-branded personalized blends",
  "Better follow-up between clinical snapshots",
  "Subscription-based continuity for customers"
];

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            R
          </div>
          <div>
            <p className="brand-name">RicHealth AI</p>
            <p className="brand-tag">Precision health, blended daily.</p>
          </div>
        </div>
        <nav className="topnav" aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#platform">Platform</a>
          <a href="#blend">Blend</a>
          <a href="#partners">Partners</a>
        </nav>
        <div className="topbar-actions">
          <a className="link-button" href="#contact">
            Contact
          </a>
          <a className="button button-primary" href="#cta">
            Get started
          </a>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">The next evolution in precision health</p>
            <h1>Turn bloodwork, wearable data, and nutrition into one daily protocol.</h1>
            <p className="hero-text">
              RicHealth AI brings together clinical-AI analysis, live health tracking, and a personalized
              natural blend so users can understand their bodies and act on that insight every day.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#cta">
                Start your journey
              </a>
              <a className="button button-secondary" href="#how-it-works">
                See how it works
              </a>
            </div>
            <ul className="trust-strip" aria-label="Platform highlights">
              {trustItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="hero-visual" aria-label="RicHealth AI platform preview">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="dashboard-card dashboard-primary">
              <div className="card-header">
                <span className="card-kicker">Live status</span>
                <span className="status-pill">Adapting daily</span>
              </div>
              <h2>Precision insights, one blended formula.</h2>
              <div className="metric-grid">
                <div>
                  <span>Sleep score</span>
                  <strong>84</strong>
                </div>
                <div>
                  <span>Stress load</span>
                  <strong>Moderate</strong>
                </div>
                <div>
                  <span>Fasting glucose</span>
                  <strong>4.1 mmol/L</strong>
                </div>
                <div>
                  <span>Blend focus</span>
                  <strong>Gut + recovery</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-card blend-card">
              <p className="card-kicker">Today’s blend profile</p>
              <div className="blend-layers" aria-hidden="true">
                <span className="layer layer-gold" />
                <span className="layer layer-mint" />
                <span className="layer layer-berry" />
                <span className="layer layer-earth" />
              </div>
              <ul>
                <li>Clinical baseline</li>
                <li>Wearable-informed adjustment</li>
                <li>Natural superfood formulation</li>
              </ul>
            </div>

            <div className="dashboard-card assistant-card">
              <p className="card-kicker">AI Health Advisor</p>
              <p className="assistant-question">“I’ve had bloating after meals for a few days.”</p>
              <p className="assistant-answer">
                Your current markers and symptoms suggest digestive support. Your blend is emphasizing ginger,
                fiber balance, and anti-inflammatory support today.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-intro">
          <div className="section-heading">
            <p className="eyebrow">Why RicHealth AI</p>
            <h2>The gap is not data. It is what happens after the data.</h2>
          </div>
          <div className="intro-grid">
            <p>
              Most health journeys break down between the lab result, the wearable dashboard, and the product
              someone is told to take. RicHealth AI connects those layers into one experience so users get a
              clearer picture of what to do next.
            </p>
            <p>
              Instead of sending users from one metric to another, the platform interprets the signal, recommends
              the right ingredient mix, and keeps adjusting the plan as their data changes.
            </p>
          </div>
          <div className="feature-grid">
            {featureCards.map((card) => (
              <article key={card.title} className={`feature-card tone-${card.tone}`}>
                <p className="card-kicker">{card.title}</p>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>A complete health loop, not a one-time recommendation.</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article key={step.index} className="step-card">
                <span className="step-index">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section" id="platform">
          <div className="split-copy">
            <p className="eyebrow">Inside the platform</p>
            <h2>Built around understanding, not just tracking.</h2>
            <p>
              The app experience brings together report uploads, wearable-informed guidance, daily vitals, and a
              live AI health advisor so users can keep their health context in one place.
            </p>
            <div className="chip-grid">
              {highlights.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="platform-panel">
            <div className="panel-header">
              <p className="card-kicker">Daily guidance</p>
              <strong>Adaptive protocol</strong>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-label">Morning</span>
                <p>Log fasting markers, sleep quality, and recovery data.</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Midday</span>
                <p>AI chat interprets symptoms, answers questions, and refines the product fit.</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Ongoing</span>
                <p>Insights refresh as profile data, wearable trends, and biomarkers evolve.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section split-section reverse" id="blend">
          <div className="blend-panel">
            <div className="blend-jar" aria-hidden="true">
              <span className="powder powder-1" />
              <span className="powder powder-2" />
              <span className="powder powder-3" />
              <span className="powder powder-4" />
            </div>
          </div>
          <div className="split-copy">
            <p className="eyebrow">Personalized blend</p>
            <h2>Recommended ingredients, combined into one daily blend.</h2>
            <p>
              RicHealth AI is not built around a generic bottle on a shelf. It uses health context to recommend
              the right ingredient mix, then positions that mix as one convenient formula users can take daily.
            </p>
            <div className="ingredient-list">
              {ingredientGroups.map((group) => (
                <article key={group.label} className="ingredient-card">
                  <h3>{group.label}</h3>
                  <p>{group.items}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-partners" id="partners">
          <div className="section-heading">
            <p className="eyebrow">For clinics and partners</p>
            <h2>Extend care beyond static reports and disconnected follow-up.</h2>
          </div>
          <div className="partners-grid">
            {partnerCards.map((item) => (
              <article key={item} className="partner-card">
                <span className="partner-dot" aria-hidden="true" />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section cta-section" id="cta">
          <div className="cta-card">
            <div>
              <p className="eyebrow">Ready to launch</p>
              <h2>Bring precision health, wearable insight, and personalized nutrition into one product story.</h2>
            </div>
            <div className="cta-actions">
              <a className="button button-primary" href="#contact">
                Talk to us
              </a>
              <a className="button button-secondary" href="#">
                Download the app
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div>
          <p className="brand-name">RicHealth AI</p>
          <p className="footer-copy">
            Clinical AI, live health data, and natural nutrition brought together into a more intelligent daily
            wellness system.
          </p>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@richealth.ai">hello@richealth.ai</a>
          <a href="#partners">Partner with us</a>
          <a href="#platform">Platform overview</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
