import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import AppDownloadModal from "./AppDownloadModal";
import { ingredientCategories, ingredientEntries } from "./ingredientsData";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 75, damping: 16 }
  }
};

const familyCards = [
  {
    eyebrow: "Greens & Algae",
    title: "Foundational greens and alkalizing bases",
    body: "Wheatgrass, kale, spirulina, moringa, matcha, chlorella, and barley grass create the nutrient-dense base of the range.",
    tone: "path-greens",
    category: "Greens & Algae"
  },
  {
    eyebrow: "Fruits & Antioxidants",
    title: "Berry-forward antioxidant support",
    body: "Acai, blueberry, maqui, baobab, cacao, lemon, and tomato powders bring color, flavor, and broad antioxidant variety.",
    tone: "path-berries",
    category: "Fruits & Antioxidants"
  },
  {
    eyebrow: "Roots, Seeds & Spices",
    title: "Everyday functional staples",
    body: "Chia, beetroot, turmeric, maca, ginger, and ceylon cinnamon round out the line with practical daily-use ingredients.",
    tone: "path-adaptogens",
    category: "Roots, Seeds & Spices"
  }
];

const signatureProducts = [
  "Just Green",
  "Just Berries",
  "Just Slim",
  "Just Mushroom",
  "Superfood Collagen Tripeptide"
];

const getCategoryPreview = (category: string) =>
  ingredientEntries
    .filter((entry) => entry.category === category)
    .slice(0, 4)
    .map((entry) => entry.name);

const shorten = (text: string, maxLength = 220) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
};

const sanitizeDescription = (text: string) =>
  text
    .replace(/ORGANIC FIELDS\s+/g, "")
    .replace(/Organic Fields\s+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

function IngredientsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(ingredientCategories[0] || "");

  const filteredEntries = ingredientEntries.filter((entry) => entry.category === activeCategory);

  const featuredBlends = ingredientEntries.filter((entry) => signatureProducts.includes(entry.name));

  const openDownloadModal = () => {
    setIsMenuOpen(false);
    setIsDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <div className="page">
      <motion.header
        className="site-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <a className="brand" href="/">
          <span className="brand-wordmark">RicHealth AI</span>
        </a>

        <button
          type="button"
          className={`menu-toggle ${isMenuOpen ? "is-open" : ""}`}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Primary">
          <a href="/#solution">How it works</a>
          <a href="/#product">The blend</a>
          <a href="/#technology">Technology</a>
          <a href="/ingredients" aria-current="page">
            Ingredients
          </a>
          <a href="/contact">Contact</a>
          <button type="button" className="site-nav-cta" onClick={openDownloadModal}>
            Start Your Health Journey
          </button>
        </nav>

        <button type="button" className="header-cta" onClick={openDownloadModal}>
          Start Your Health Journey
        </button>
      </motion.header>

      <main>
        <section className="hero ingredients-hero">
          <div className="hero-panel hero-left ingredients-hero-left">
            <div className="hero-ambient hero-ambient-a" />
            <div className="hero-ambient hero-ambient-b" />
            <div className="hero-grid" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="ingredients-hero-stack">
              <article className="hero-data-card ingredients-hero-card">
                <span className="data-label">Ingredient range</span>
                <strong>Greens, fruits, staples, and blends</strong>
                <p>A complete ingredient library covering single superfoods and multi-ingredient formulas.</p>
              </article>

              <article className="hero-data-card ingredients-hero-card">
                <span className="data-label">Signature blends</span>
                <strong>Purpose-built product formulas</strong>
                <p>Discover blends designed around greens, berries, mushrooms, slimming support, and collagen.</p>
              </article>

              <article className="hero-data-card ingredients-hero-card">
                <span className="data-label">Ingredient focus</span>
                <strong>Clean, functional superfood ingredients</strong>
                <p>Browse each ingredient in more detail and see how it fits into the wider product range.</p>
              </article>
            </div>
          </div>

          <div className="hero-panel hero-right">
            <motion.div
              className="hero-content"
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              <motion.p variants={fadeUp} className="hero-label">
                Full formulation library
              </motion.p>
              <motion.h1 variants={fadeUp}>See every ingredient behind the blend.</motion.h1>
              <motion.p variants={fadeUp} className="hero-copy">
                Explore the full ingredient range through signature blends, grouped categories, and a cleaner, easier
                way to browse the library.
              </motion.p>
              <motion.div variants={fadeUp} className="ingredients-hero-actions">
                <a className="hero-button" href="#ingredient-families">
                  Explore ingredient families
                </a>
                <a className="hero-button ingredients-hero-button-secondary" href="#ingredients-catalogue">
                  Browse full catalogue
                </a>
              </motion.div>
            </motion.div>

            <div className="hero-product-scene ingredients-hero-scene" aria-hidden="true">
              <div className="hero-accent-slab" />
              <div className="ingredients-scene-panel">
                {ingredientCategories.map((category) => (
                  <div key={category} className="ingredients-scene-row">
                    <span>{category}</span>
                    <strong>{getCategoryPreview(category).join(" | ")}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="paths-section" id="ingredient-families">
          <motion.div
            className="paths-intro"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="paths-kicker">
              Ingredient families
            </motion.p>
            <motion.h2 variants={fadeUp}>Explore the core ingredient families behind the range.</motion.h2>
            <motion.p variants={fadeUp} className="paths-copy">
              From nutrient-dense greens to antioxidant fruits and everyday functional staples, each family plays a
              distinct role across the product range.
            </motion.p>
          </motion.div>

          <motion.div
            className="paths-grid paths-grid-three"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {familyCards.map((family) => (
              <motion.article
                key={family.category}
                className={`path-card ${family.tone}`}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 280 } }}
              >
                <div className="path-overlay" />
                <div className="path-gridlines" aria-hidden="true" />
                <div className="path-ambient path-ambient-one" aria-hidden="true" />
                <div className="path-ambient path-ambient-two" aria-hidden="true" />
                <div className="path-glass-frame" aria-hidden="true" />
                <div className="path-content">
                  <p className="path-eyebrow">{family.eyebrow}</p>
                  <h3>{family.title}</h3>
                  <p>{family.body}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="benefits-section ingredients-signature-section">
          <motion.div
            className="benefits-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="benefits-kicker">
              Signature products
            </motion.p>
            <motion.h2 variants={fadeUp}>Multi-ingredient blends, shown with actual substance.</motion.h2>
            <motion.p variants={fadeUp}>
              The homepage promises a tailored blend. Here, the most important formulas are surfaced first so users can
              quickly understand what sits behind that promise before moving into the full ingredient library.
            </motion.p>
          </motion.div>

          <motion.div
            className="benefits-visuals ingredients-signature-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {featuredBlends.map((entry) => (
              <motion.article key={entry.slug} variants={fadeUp} className="science-proof-item ingredients-signature-card">
                <span className="science-proof-accent" aria-hidden="true" />
                <div className="ingredients-signature-copy">
                  <strong>{entry.name}</strong>
                  <h3>{entry.category}</h3>
                  <p>{shorten(sanitizeDescription(entry.description), 180)}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="ingredients-catalog-section" id="ingredients-catalogue">
          <div className="paths-intro ingredients-catalog-intro">
            <p className="paths-kicker">Full catalogue</p>
            <h2>Browse the full ingredient range by category.</h2>
            <p className="paths-copy">
              Explore each category to see the full range of greens, fruits, functional staples, and signature blends.
            </p>
          </div>

          <div className="ingredients-filter-row" aria-label="Ingredient categories">
            {ingredientCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`ingredients-filter-chip${activeCategory === category ? " is-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <section className="ingredients-category-block">
            <div className="ingredients-category-head">
              <p className="benefits-kicker">{activeCategory}</p>
              <h2>{activeCategory}</h2>
            </div>

            <div className="ingredients-card-grid">
              {filteredEntries.map((entry) => (
                <article key={entry.slug} className="ingredients-entry-card">
                  <span className="ingredients-entry-tag">{entry.category}</span>
                  <h3>{entry.name}</h3>
                  <p>{shorten(sanitizeDescription(entry.description))}</p>
                  <div className="ingredients-chip-list">
                    {entry.ingredientList.map((item) => (
                      <span key={`${entry.slug}-${item}`} className="ingredients-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="final-cta-section" id="start">
          <motion.div
            className="final-cta-card"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="final-cta-kicker">
              From ingredients to personalization
            </motion.p>
            <motion.h2 variants={fadeUp}>Ready to turn the ingredient library into a plan built around you?</motion.h2>
            <motion.p variants={fadeUp} className="final-cta-copy">
              Explore the blend, understand the ingredients, and move back into the main RicHealth AI journey when
              you're ready to start.
            </motion.p>
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="final-cta-button"
              type="button"
              onClick={openDownloadModal}
            >
              Start Your Health Journey
            </motion.button>
          </motion.div>
        </section>
      </main>

      <AppDownloadModal isOpen={isDownloadModalOpen} onClose={closeDownloadModal} />

      <footer className="site-footer" id="contact">
        <div className="site-footer-inner">
          <div className="site-footer-top">
            <div className="site-footer-brand-block">
              <span className="site-footer-brand">RicHealth AI</span>
              <p className="site-footer-summary">
                Precision health built around diagnostics, wearable context, and personalized natural nutrition.
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
                <a href="/">Privacy Policy</a>
                <a href="/">Terms of Service</a>
                <a href="/">Cookies</a>
              </div>

              <div className="site-footer-column">
                <span className="site-footer-heading">Reach us</span>
                <a href="mailto:hello@richealth.ai">hello@richealth.ai</a>
                <a href="tel:+60000000000">+60 00-000 0000</a>
                <span className="site-footer-meta">Mon to Fri, 9:00 AM to 6:00 PM</span>
              </div>
            </div>
          </div>

          <div className="site-footer-bottom">
            <span className="site-footer-meta">© 2026 RicHealth AI. All rights reserved.</span>
            <span className="site-footer-meta">Affordable subscription plan and personalized nutrition.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default IngredientsPage;
