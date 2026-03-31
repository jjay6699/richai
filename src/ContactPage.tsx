import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import SiteFooter from "./SiteFooter";
import SiteLogo from "./SiteLogo";

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

const contactCards = [
  {
    label: "General enquiries",
    value: "info@richealth.ai",
    body: "Reach out for product questions, ingredient details, and brand enquiries.",
    href: "mailto:info@richealth.ai"
  },
  {
    label: "Partnerships",
    value: "partners@richealth.ai",
    body: "For retail, clinic, wellness, or collaboration opportunities.",
    href: "mailto:partners@richealth.ai"
  },
  {
    label: "Call us",
    value: "+60164476899",
    body: "Monday to Friday, 9:00 AM to 6:00 PM.",
    href: "tel:+60164476899"
  }
];

function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Contact enquiry from ${name || "Website visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name || "-"}\nEmail: ${email || "-"}\n\nMessage:\n${message || "-"}`
    );

    window.location.href = `mailto:info@richealth.ai?subject=${subject}&body=${body}`;
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
          <SiteLogo className="brand-logo" />
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
          <a href="/ingredients">Ingredients</a>
          <a href="/contact" aria-current="page">
            Contact
          </a>
          <a className="site-nav-cta" href="mailto:info@richealth.ai">
            Send us an enquiry
          </a>
        </nav>

        <a className="header-cta" href="mailto:info@richealth.ai">
          Send us an enquiry
        </a>
      </motion.header>

      <main>
        <section className="hero contact-hero">
          <div className="hero-panel hero-left contact-hero-left">
            <div className="hero-ambient hero-ambient-a" />
            <div className="hero-ambient hero-ambient-b" />
            <div className="hero-grid" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="contact-hero-stack">
              {contactCards.map((card) => (
                <a key={card.label} className="hero-data-card contact-hero-card" href={card.href}>
                  <span className="data-label">{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.body}</p>
                </a>
              ))}
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
                Contact us
              </motion.p>
              <motion.h1 variants={fadeUp}>Speak with the RicHealth AI team.</motion.h1>
              <motion.p variants={fadeUp} className="hero-copy">
                Whether you're exploring the blend, need ingredient clarification, or want to discuss a partnership,
                the best next step is a direct conversation.
              </motion.p>
              <motion.div variants={fadeUp} className="ingredients-hero-actions">
                <a className="hero-button" href="#contact-form">
                  Send enquiry
                </a>
                <a className="hero-button ingredients-hero-button-secondary" href="mailto:info@richealth.ai">
                  Email us directly
                </a>
              </motion.div>
            </motion.div>
            <div className="hero-product-scene" aria-hidden="true">
              <div className="hero-accent-slab" />
            </div>
          </div>
        </section>

        <section className="science-section contact-form-section" id="contact-form">
          <motion.div
            className="science-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="science-kicker">
              Send us a message
            </motion.p>
            <motion.h2 variants={fadeUp}>Share your enquiry and we’ll route it to the right team.</motion.h2>
            <motion.p variants={fadeUp} className="science-body">
              Use the form for product questions, ingredient clarification, support, or partnership enquiries.
            </motion.p>
          </motion.div>

          <motion.div
            className="science-media"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.form variants={fadeUp} className="contact-form-card contact-form-card-light" onSubmit={handleSubmit}>
              <label className="contact-field contact-field-light">
                <span>Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
              </label>

              <label className="contact-field contact-field-light">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="contact-field contact-field-light">
                <span>Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us how we can help."
                  rows={5}
                />
              </label>

              <button className="contact-submit-button" type="submit">
                Send enquiry
              </button>
            </motion.form>
          </motion.div>
        </section>

        <section className="science-section contact-methods-section">
          <motion.div
            className="science-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="science-kicker">
              Reach us directly
            </motion.p>
            <motion.h2 variants={fadeUp}>Clear contact paths for support, product questions, and partnerships.</motion.h2>
            <motion.p variants={fadeUp} className="science-body">
              Keep it simple. Choose the contact route that fits your enquiry and we’ll direct it to the right team.
            </motion.p>
          </motion.div>

          <motion.div
            className="science-proof-grid science-proof-grid-three"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {contactCards.map((card) => (
              <motion.a key={card.label} variants={fadeUp} className="science-proof-item contact-method-card" href={card.href}>
                <span className="science-proof-accent" aria-hidden="true" />
                <div className="contact-method-copy">
                  <strong>{card.value}</strong>
                  <h3>{card.label}</h3>
                  <p>{card.body}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </section>

        <section className="benefits-section contact-notes-section">
          <motion.div
            className="benefits-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="benefits-kicker">
              Before you reach out
            </motion.p>
            <motion.h2 variants={fadeUp}>The more context you share, the faster we can help.</motion.h2>
            <motion.p variants={fadeUp}>
              If your enquiry relates to ingredients, blends, partnerships, or product support, include the product
              name and what you need clarified so the response can be more precise.
            </motion.p>
          </motion.div>

          <motion.div
            className="benefits-visuals contact-notes-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {[
              "Product enquiries: mention the blend or ingredient you are referring to.",
              "Partnerships: include your company, channel, and what kind of collaboration you are exploring.",
              "Support: include any context that helps us understand your issue quickly."
            ].map((note) => (
              <motion.article key={note} variants={fadeUp} className="science-proof-item contact-note-card">
                <span className="science-proof-accent" aria-hidden="true" />
                <p>{note}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ContactPage;
