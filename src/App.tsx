import { useState } from "react";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-wordmark">RicHealth AI</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Primary">
          <a href="/">Shop</a>
          <a href="/">Why RicHealth AI</a>
          <a href="/">Science</a>
          <a href="/">Testimonials</a>
          <a href="/">About us</a>
        </nav>

        <a className="header-cta" href="/">
          Start the quiz
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-panel hero-left">
            <div className="hero-ambient hero-ambient-a" />
            <div className="hero-ambient hero-ambient-b" />
            <div className="hero-grid" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-orbit orbit-three" />
            <div className="hero-data-card card-one">
              <span className="data-label">Live health loop</span>
              <strong>Wearable aware</strong>
            </div>
            <div className="hero-data-card card-two">
              <span className="data-label">Clinical baseline</span>
              <strong>Biomarker-led</strong>
            </div>
            <div className="hero-data-card card-three">
              <span className="data-label">Daily blend</span>
              <strong>Personalized formula</strong>
            </div>
          </div>

          <div className="hero-panel hero-right">
            <div className="hero-content">
              <p className="hero-label">Personalized nutrition platform</p>
              <h1>Personalized based on your data. Designed for daily results.</h1>
              <p className="hero-copy">
                RicHealth AI combines bloodwork interpretation, wearable context, and one personalized natural blend
                to create a precision-health routine shaped around the individual.
              </p>
              <a className="hero-button" href="/">
                Start the quiz
              </a>
            </div>

            <div className="hero-product-scene" aria-hidden="true">
              <div className="hero-accent-slab" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
