import "./App.css";

const signals = [
  "Bloodwork & DNA decoding",
  "Live wearable sync",
  "AI health advisor",
  "One personalized natural blend"
];

const principles = [
  {
    title: "Clinical baseline first",
    text: "Recommendations begin with biomarkers, not generic wellness guesses."
  },
  {
    title: "Adaptation, not static advice",
    text: "Sleep, stress, activity, and recovery help shape the protocol over time."
  },
  {
    title: "One daily formula",
    text: "Recommended ingredients are brought together into a single blend designed for consistency."
  }
];

const steps = [
  {
    label: "01",
    title: "Upload your health data",
    text: "Start with bloodwork or DNA reports to establish a clinical baseline."
  },
  {
    label: "02",
    title: "Sync live body signals",
    text: "Wearable data brings in daily sleep, stress, and activity context."
  },
  {
    label: "03",
    title: "Receive a tailored blend",
    text: "AI recommends the right ingredient combination to be consumed as one daily formula."
  },
  {
    label: "04",
    title: "Track and refine",
    text: "Insights, profile updates, and AI guidance keep the plan aligned with current needs."
  }
];

const ingredients = [
  "Greens, fibers, and nutrient bases",
  "Antioxidant berries and phytonutrients",
  "Functional mushrooms and adaptogens",
  "Digestive, metabolic, and recovery support"
];

function App() {
  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            R
          </span>
          <span className="brand-text">
            <strong>RicHealth AI</strong>
            <small>Precision health, blended daily</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#platform">Platform</a>
          <a href="#partners">Partners</a>
        </nav>

        <div className="header-actions">
          <a className="text-link" href="#contact">
            Contact
          </a>
          <a className="button button-primary" href="#cta">
            Get started
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">The next evolution in precision health</p>
            <h1>Personalized nutrition, shaped by biomarkers and daily life.</h1>
            <p className="hero-intro">
              RicHealth AI connects clinical analysis, wearable signals, and a natural ingredient system to
              recommend one blended daily formula built around the individual.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#cta">
                Start with your baseline
              </a>
              <a className="button button-secondary" href="#how-it-works">
                Explore the process
              </a>
            </div>

            <ul className="signal-list" aria-label="Core platform signals">
              {signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-glow hero-glow-mint" />
            <div className="hero-glow hero-glow-peach" />

            <div className="hero-panel hero-panel-main">
              <p className="panel-label">Daily protocol</p>
              <div className="metrics">
                <div>
                  <span>Sleep</span>
                  <strong>84</strong>
                </div>
                <div>
                  <span>Stress</span>
                  <strong>Moderate</strong>
                </div>
                <div>
                  <span>Glucose</span>
                  <strong>4.1 mmol/L</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>Gut + recovery</strong>
                </div>
              </div>
            </div>

            <div className="hero-panel hero-panel-blend">
              <p className="panel-label">Personalized blend</p>
              <div className="blend-vessel">
                <span className="blend-layer layer-one" />
                <span className="blend-layer layer-two" />
                <span className="blend-layer layer-three" />
                <span className="blend-layer layer-four" />
              </div>
            </div>

            <div className="hero-panel hero-panel-note">
              <p className="panel-label">AI guidance</p>
              <p>
                Recommendations evolve with bloodwork, symptoms, and live wearable patterns instead of staying
                fixed to one snapshot in time.
              </p>
            </div>
          </div>
        </section>

        <section className="proof-band">
          <p>
            Built around the connection between <strong>clinical diagnostics</strong>, <strong>live tracking</strong>,
            and <strong>100% natural blended nutrition</strong>.
          </p>
        </section>

        <section className="section section-wide">
          <div className="section-intro">
            <p className="eyebrow">Why it feels different</p>
            <h2>Less fragmented health data. More usable daily guidance.</h2>
          </div>

          <div className="principles">
            {principles.map((item) => (
              <article key={item.title} className="principle">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-wide" id="how-it-works">
          <div className="section-intro narrow">
            <p className="eyebrow">How it works</p>
            <h2>A cleaner loop from report to routine.</h2>
          </div>

          <div className="steps">
            {steps.map((step) => (
              <article key={step.label} className="step">
                <span className="step-label">{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split" id="platform">
          <div className="split-copy">
            <p className="eyebrow">Platform experience</p>
            <h2>One place to understand what the body is saying.</h2>
            <p>
              RicHealth AI combines report uploads, health tracking, AI chat, and daily profile updates into a
              single system designed to explain, guide, and adapt.
            </p>
          </div>

          <div className="split-panel">
            <div className="timeline-row">
              <span>Morning</span>
              <p>Log vitals, sleep, and recovery markers.</p>
            </div>
            <div className="timeline-row">
              <span>During the day</span>
              <p>Use AI chat to understand symptoms and health questions in context.</p>
            </div>
            <div className="timeline-row">
              <span>Ongoing</span>
              <p>Recommendations shift as health data, goals, and wearable patterns change.</p>
            </div>
          </div>
        </section>

        <section className="section split split-reverse">
          <div className="blend-stage" aria-hidden="true">
            <div className="blend-jar">
              <span className="jar-layer jar-layer-1" />
              <span className="jar-layer jar-layer-2" />
              <span className="jar-layer jar-layer-3" />
              <span className="jar-layer jar-layer-4" />
            </div>
          </div>

          <div className="split-copy">
            <p className="eyebrow">The blend model</p>
            <h2>Recommended ingredients, combined into one formula.</h2>
            <p>
              The goal is not to leave users juggling multiple products. RicHealth AI uses health context to
              determine the most relevant ingredients, then positions them as one consistent daily blend.
            </p>

            <ul className="ingredient-points">
              {ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section-wide" id="partners">
          <div className="section-intro narrow">
            <p className="eyebrow">For clinics and partners</p>
            <h2>Extend care beyond static reports and isolated follow-up.</h2>
          </div>

          <div className="partner-band">
            <span>Remote patient monitoring support</span>
            <span>Co-branded personalized blends</span>
            <span>Subscription continuity</span>
            <span>Better customer and patient follow-through</span>
          </div>
        </section>

        <section className="section cta-section" id="cta">
          <div className="cta-card">
            <div>
              <p className="eyebrow">Next step</p>
              <h2>Bring precision health and personalized blended nutrition into one experience.</h2>
            </div>

            <div className="cta-actions">
              <a className="button button-primary" href="#contact">
                Talk to us
              </a>
              <a className="button button-secondary" href="/">
                Download the app
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div>
          <strong>RicHealth AI</strong>
          <p>
            Precision-health guidance built from biomarkers, daily tracking, and natural blended nutrition.
          </p>
        </div>

        <div className="footer-links">
          <a href="mailto:hello@richealth.ai">hello@richealth.ai</a>
          <a href="#partners">Partner with us</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
