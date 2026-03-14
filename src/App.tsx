import { useState, useRef } from "react";
import { motion, type Variants, useMotionValue, useTransform, useSpring } from "framer-motion";
import "./App.css";

const supportTiles = [
  {
    title: "Higher energy",
    meta: "Daily vitality",
    tone: "tone-energy",
    image: "/benefits/energy.jpg"
  },
  {
    title: "Memory & focus",
    meta: "Mental clarity",
    tone: "tone-focus",
    image: "/benefits/focus.jpg"
  },
  {
    title: "Better sleep",
    meta: "Night recovery",
    tone: "tone-sleep",
    image: "/benefits/sleep.jpg"
  },
  {
    title: "Faster recovery",
    meta: "Active support",
    tone: "tone-recovery",
    image: "/benefits/recovery.jpg"
  },
  {
    title: "Skin & hair support",
    meta: "Beauty wellness",
    tone: "tone-beauty",
    image: "/benefits/beauty.jpg"
  },
  {
    title: "Balanced metabolism",
    meta: "Foundational health",
    tone: "tone-metabolism",
    image: "/benefits/metabolism.jpg"
  }
];

// --- Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 }
  },
};

const heroCardFloat: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 12,
      delay,
    },
  }),
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- Parallax Mouse Effect ---
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse values
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Map mouse position to slight translations for the cards
  const x1 = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const y1 = useTransform(springY, [-0.5, 0.5], [-15, 15]);
  
  const x2 = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const y2 = useTransform(springY, [-0.5, 0.5], [20, -20]);

  const x3 = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const y3 = useTransform(springY, [-0.5, 0.5], [25, -25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
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
          <a href="/">Shop</a>
          <a href="/">Why RicHealth AI</a>
          <a href="/">Science</a>
          <a href="/">Testimonials</a>
          <a href="/">About us</a>
        </nav>

        <a className="header-cta" href="/">
          Start the quiz
        </a>
      </motion.header>

      <main>
        <section className="hero">
          <div 
            className="hero-panel hero-left"
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="hero-ambient hero-ambient-a" />
            <div className="hero-ambient hero-ambient-b" />
            <div className="hero-grid" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-orbit orbit-three" />
            
            <motion.div 
              className="hero-data-card card-one floating-infinite-1"
              style={{ x: x1, y: y1 }}
              custom={0.2}
              initial="hidden"
              animate="show"
              variants={heroCardFloat}
            >
              <span className="data-label">Live health loop</span>
              <strong>Wearable aware</strong>
            </motion.div>

            <motion.div 
              className="hero-data-card card-two floating-infinite-2"
              style={{ x: x2, y: y2 }}
              custom={0.4}
              initial="hidden"
              animate="show"
              variants={heroCardFloat}
            >
              <span className="data-label">Clinical baseline</span>
              <strong>Biomarker-led</strong>
            </motion.div>

            <motion.div 
              className="hero-data-card card-three floating-infinite-3"
              style={{ x: x3, y: y3 }}
              custom={0.6}
              initial="hidden"
              animate="show"
              variants={heroCardFloat}
            >
              <span className="data-label">Daily blend</span>
              <strong>Personalized formula</strong>
            </motion.div>
          </div>

          <div className="hero-panel hero-right">
            <motion.div 
              className="hero-content"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.p variants={fadeUp} className="hero-label">Personalized nutrition platform</motion.p>
              <motion.h1 variants={fadeUp}>Personalized based on your data. Designed for daily results.</motion.h1>
              <motion.p variants={fadeUp} className="hero-copy">
                RicHealth AI combines bloodwork interpretation, wearable context, and one personalized natural blend
                to create a precision-health routine shaped around the individual.
              </motion.p>
              <motion.a 
                variants={fadeUp} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hero-button" 
                href="/"
              >
                Start the quiz
              </motion.a>
            </motion.div>

            <div className="hero-product-scene" aria-hidden="true">
              <div className="hero-accent-slab" />
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <motion.div 
            className="benefits-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="benefits-kicker">Feel the difference</motion.p>
            <motion.h2 variants={fadeUp}>
              <span className="heading-line">Personalized nutrition</span>
              <br />
              that fits real daily health goals.
            </motion.h2>
            <motion.p variants={fadeUp}>
              RicHealth AI is built to translate biomarkers, lifestyle signals, and daily wellness priorities into a
              simpler blended routine. The result is a more relevant nutrition experience across energy, sleep,
              recovery, metabolism, and everyday resilience.
            </motion.p>
            <motion.a 
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="benefits-button" 
              href="/"
            >
              Start the quiz
            </motion.a>
          </motion.div>

          <motion.div 
            className="benefits-visuals" 
            aria-label="Key benefit areas"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {supportTiles.map((tile) => (
              <motion.article
                key={tile.title}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                className={`benefit-tile ${tile.tone}`}
                style={{ backgroundImage: `url(${tile.image})` }}
              >
                <div className="benefit-overlay" />
                <div className="benefit-badge" aria-hidden="true" />
                <small className="benefit-meta">{tile.meta}</small>
                <span>{tile.title}</span>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default App;
