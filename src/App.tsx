import { useEffect, useRef, useState } from "react";
import { motion, type Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import AdminPage from "./AdminPage";
import ContactPage from "./ContactPage";
import IngredientsPage from "./IngredientsPage";
import { applySeo } from "./seo";
import "./App.css";

const howItWorksSteps = [
  {
    title: "Deep Clinical Decoding",
    meta: "Step 1",
    body:
      "Upload lab reports or DNA data. Our advanced AI, trained on over 500,000 peer-reviewed journals, translates dense biomarkers into clear, actionable insights.",
    tone: "tone-energy",
    image: "/benefits/energy.jpg"
  },
  {
    title: "Live Wearable Sync",
    meta: "Step 2",
    body:
      "Continuous, 24/7 biomarker tracking via seamless smartwatch integration. Nutritional recommendations adjust around sleep, stress, and activity levels.",
    tone: "tone-focus",
    image: "/benefits/focus.jpg"
  },
  {
    title: "Dynamic Health Profiling",
    meta: "Step 3",
    body:
      "Input your baseline metrics during registration and update your health data daily to continuously track, manage, and understand your evolving health condition.",
    tone: "tone-sleep",
    image: "/benefits/sleep.jpg"
  },
  {
    title: "24/7 AI Health Advisor",
    meta: "Step 4",
    body:
      "Access instant, reliable support through live chat with our expertly trained AI health advisor to confidently discuss and understand health issues or concerns.",
    tone: "tone-recovery",
    image: "/benefits/recovery.jpg"
  }
];

const ingredientPillars = [
  {
    eyebrow: "Vital Greens & Bases",
    title: "Foundational nutrient density",
    body:
      "Featuring Organic Spirulina, Chlorella, Wheatgrass, Moringa, Kale, Broccoli, Pea Protein, and Organic Psyllium Husk.",
    tone: "path-greens"
  },
  {
    eyebrow: "Antioxidant Berries",
    title: "Protection from plant-powered antioxidants",
    body:
      "Packed with 100% Organic Acai, Blueberry, Cranberry, Strawberry, Maqui Berry, and Pomegranate.",
    tone: "path-berries"
  },
  {
    eyebrow: "Functional Adaptogens",
    title: "Support for resilience and recovery",
    body:
      "Enhanced with Organic Reishi, Lion's Mane, Chaga, Shiitake, Maitake, Maca Powder, and Turmeric.",
    tone: "path-adaptogens"
  }
];

const technologyHighlights = [
  {
    value: "500k+",
    label: "Medical studies",
    body: "Recommendations grounded in broad clinical evidence.",
    tone: "science-journals"
  },
  {
    value: "Private",
    label: "Protected handling",
    body: "Health data handled with a more secure, privacy-first approach.",
    tone: "science-private"
  },
  {
    value: "Adaptive",
    label: "Always updating",
    body: "Plans evolve as wearable and diagnostic inputs change.",
    tone: "science-live"
  }
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
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
      delay
    }
  })
};

function MarketingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const x1 = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const y1 = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  const x2 = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const y2 = useTransform(springY, [-0.5, 0.5], [20, -20]);

  const x3 = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const y3 = useTransform(springY, [-0.5, 0.5], [25, -25]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (event.clientX - rect.left) / rect.width - 0.5;
    const yPct = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handlePathPointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    currentTarget.style.setProperty("--glow-x", `${x}%`);
    currentTarget.style.setProperty("--glow-y", `${y}%`);
  };

  const handlePathPointerLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--glow-x", "50%");
    event.currentTarget.style.setProperty("--glow-y", "50%");
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
          <a href="#solution">How it works</a>
          <a href="#product">The blend</a>
          <a href="#technology">Technology</a>
          <a href="/ingredients">Ingredients</a>
          <a href="/contact">Contact</a>
          <a className="site-nav-cta" href="#start">
            Start Your Health Journey
          </a>
        </nav>

        <a className="header-cta" href="#start">
          Start Your Health Journey
        </a>
      </motion.header>

      <main>
        <section className="hero" id="top">
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
              <span className="data-label">Clinical diagnostics</span>
              <strong>Decoded clearly</strong>
            </motion.div>

            <motion.div
              className="hero-data-card card-two floating-infinite-2"
              style={{ x: x2, y: y2 }}
              custom={0.4}
              initial="hidden"
              animate="show"
              variants={heroCardFloat}
            >
              <span className="data-label">Lifestyle tracking</span>
              <strong>Live wearable sync</strong>
            </motion.div>

            <motion.div
              className="hero-data-card card-three floating-infinite-3"
              style={{ x: x3, y: y3 }}
              custom={0.6}
              initial="hidden"
              animate="show"
              variants={heroCardFloat}
            >
              <span className="data-label">Pure wellness</span>
              <strong>Natural custom blend</strong>
            </motion.div>
          </div>

          <div className="hero-panel hero-right">
            <motion.div
              className="hero-content"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.p variants={fadeUp} className="hero-label">
                The next evolution in precision health
              </motion.p>
              <motion.h1 variants={fadeUp}>Decode your biology. Design your best life.</motion.h1>
              <motion.p variants={fadeUp} className="hero-copy">
                We are bridging the gap between clinical diagnostics, real-time lifestyle tracking, and pure
                wellness to create a proactive healthcare ecosystem.
              </motion.p>
              <motion.a
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hero-button"
                href="#start"
              >
                Start Your Health Journey
              </motion.a>
            </motion.div>

            <div className="hero-product-scene" aria-hidden="true">
              <div className="hero-accent-slab" />
            </div>
          </div>
        </section>

        <section className="benefits-section" id="solution">
          <motion.div
            className="benefits-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="benefits-kicker">
              How it works
            </motion.p>
            <motion.h2 variants={fadeUp}>
              <span className="heading-line">The ultimate health loop.</span>
              <br />
              Connect data with nutrition needs.
            </motion.h2>
            <motion.p variants={fadeUp}>
              RicHealth AI connects diagnostics, wearable signals, and continuous health profiling so recommendations
              stay practical, timely, and personalized as your condition evolves.
            </motion.p>
            <motion.a
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="benefits-button"
              href="#product"
            >
              Explore the solution
            </motion.a>
          </motion.div>

          <motion.div
            className="benefits-visuals"
            aria-label="How the RicHealth AI solution works"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {howItWorksSteps.map((step) => (
              <motion.article
                key={step.title}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                className={`benefit-tile ${step.tone}`}
                style={{ backgroundImage: `url(${step.image})` }}
              >
                <div className="benefit-overlay" />
                <div className="benefit-badge" aria-hidden="true" />
                <small className="benefit-meta">{step.meta}</small>
                <span>{step.title}</span>
                <p className="benefit-body">{step.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="paths-section" id="product">
          <motion.div
            className="paths-intro"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="paths-kicker">
              Your personalised blend
            </motion.p>
            <motion.h2 variants={fadeUp}>Tailored to you. Sourced from the earth.</motion.h2>
            <motion.p variants={fadeUp} className="paths-copy">
              Instead of generic pills, we formulate a 100% natural, ethically sourced custom superfood blend tailored
              to your deficiencies.
            </motion.p>
          </motion.div>

          <motion.div
            className="paths-grid paths-grid-three"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {ingredientPillars.map((pillar) => (
              <motion.article
                key={pillar.eyebrow}
                className={`path-card ${pillar.tone}`}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 280 } }}
                onMouseMove={handlePathPointerMove}
                onMouseLeave={handlePathPointerLeave}
              >
                <div className="path-overlay" />
                <div className="path-gridlines" aria-hidden="true" />
                <div className="path-ambient path-ambient-one" aria-hidden="true" />
                <div className="path-ambient path-ambient-two" aria-hidden="true" />
                <div className="path-glass-frame" aria-hidden="true" />
                <div className="path-content">
                  <p className="path-eyebrow">{pillar.eyebrow}</p>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="science-section" id="technology">
          <motion.div
            className="science-media"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="science-media-frame">
              <div className="science-media-image" style={{ backgroundImage: "url(/hero/powder.jpg)" }} />
              <div className="science-media-wash" />
              <div className="science-media-note">
                <span className="science-card-label">Unprecedented insight</span>
                <strong>Clinical evidence, secure handling, and adaptive protocols come together in real time.</strong>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="science-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="science-kicker">
              Technology & trust
            </motion.p>
            <motion.h2 variants={fadeUp}>Unprecedented insight, in real-time</motion.h2>
            <motion.p variants={fadeUp} className="science-body">
              The platform is framed around clinically grounded recommendations, secure health data handling, and a
              protocol that adapts as new wearable and diagnostic information comes in.
            </motion.p>

            <motion.div variants={staggerContainer} className="science-proof-grid science-proof-grid-three">
              {technologyHighlights.map((item) => (
                <motion.article
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 280 } }}
                  className={`science-proof-item ${item.tone}`}
                >
                  <span className="science-proof-accent" aria-hidden="true" />
                  <div className="science-proof-copy">
                    <strong>{item.value}</strong>
                    <h3>{item.label}</h3>
                    <p>{item.body}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
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
              Affordable subscription plan
            </motion.p>
            <motion.h2 variants={fadeUp}>Ready to stop predicting health and start building it?</motion.h2>
            <motion.p variants={fadeUp} className="final-cta-copy">
              Personalized nutrition designed around your data, delivered through an accessible subscription model.
            </motion.p>
            <motion.a
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="final-cta-button"
              href="/"
            >
              Start Your Health Journey
            </motion.a>
          </motion.div>
        </section>
      </main>

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
                <a href="#solution">How it works</a>
                <a href="#product">Your blend</a>
                <a href="/ingredients">Ingredients</a>
                <a href="#technology">Technology & trust</a>
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

function App() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      applySeo({
        title: "Admin | RicHealth AI",
        description: "Protected RicHealth AI admin access.",
        path: "/admin",
        robots: "noindex,nofollow"
      });
      return;
    }

    if (pathname.startsWith("/contact")) {
      applySeo({
        title: "Contact Us | RicHealth AI",
        description:
          "Contact RicHealth AI for product questions, ingredient enquiries, partnerships, and support.",
        path: "/contact"
      });
      return;
    }

    if (pathname.startsWith("/ingredients")) {
      applySeo({
        title: "Ingredients | RicHealth AI",
        description:
          "Explore the RicHealth AI ingredient range, from greens and antioxidant fruits to functional staples and signature blends.",
        path: "/ingredients"
      });
      return;
    }

    applySeo({
      title: "RicHealth AI | Precision Health and Personalized Nutrition",
      description:
        "RicHealth AI connects diagnostics, wearable insights, and personalized nutrition to help users build a smarter health journey.",
      path: "/"
    });
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return <AdminPage />;
  }
  if (pathname.startsWith("/contact")) {
    return <ContactPage />;
  }
  if (pathname.startsWith("/ingredients")) {
    return <IngredientsPage />;
  }

  return <MarketingPage />;
}

export default App;
