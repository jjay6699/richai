import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";

type LegalPageType = "privacy" | "terms" | "cookies" | "shipping-returns";

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalDocument {
  eyebrow: string;
  title: string;
  intro: string;
  effectiveDate: string;
  summary: string[];
  sections: LegalSection[];
}

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

const legalDocuments: Record<LegalPageType, LegalDocument> = {
  privacy: {
    eyebrow: "Privacy Policy",
    title: "How RicHealth AI handles personal data",
    intro:
      "This Privacy Policy explains how RicHealth AI collects, uses, stores, and protects personal data when you use our website, contact us, join our waiting list, or interact with our health-related digital services.",
    effectiveDate: "Effective date: 26 March 2026",
    summary: [
      "We handle personal data in line with the Personal Data Protection Act 2010 of Malaysia (PDPA).",
      "We collect contact information, account details, technical usage data, and any health-related information you choose to provide to us.",
      "We use data to respond to enquiries, provide services, improve the platform, maintain security, and comply with legal obligations.",
      "You may request access to or correction of your personal data, subject to applicable Malaysian legal requirements."
    ],
    sections: [
      {
        heading: "1. Data controller and contact details",
        body: [
          "RicHealth AI is responsible for the processing of personal data collected through this website and related services. If you have any privacy-related questions or requests, you may contact us at hello@richealth.ai or call +60 16-447 6899 during our stated business hours in Malaysia.",
          "Where Malaysian law requires notices, consent language, or access and correction handling, this policy is intended to operate consistently with the PDPA and any applicable subsidiary regulations or official guidance."
        ]
      },
      {
        heading: "2. Categories of personal data we collect",
        body: [
          "We may collect your name, email address, telephone number, enquiry details, business information, and any information you submit through forms, email, downloads, or direct communication with us.",
          "If you choose to use health-related or personalization features, we may also receive information such as lab markers, wellness goals, wearable data, lifestyle inputs, supplement preferences, and other information you voluntarily provide for recommendation or support purposes.",
          "We may automatically collect technical information such as IP address, browser type, device identifiers, pages visited, approximate location based on IP, referring links, and interaction events through cookies or similar technologies."
        ]
      },
      {
        heading: "3. Why we process personal data",
        body: [
          "We use personal data to operate and improve our website, respond to messages, support customer relationships, administer accounts, provide health and nutrition-related digital features, personalize user experiences, and maintain security and fraud prevention controls.",
          "We may also use personal data to send service notices, respond to product enquiries, manage commercial discussions, improve our content and product design, and comply with legal, regulatory, tax, audit, or law-enforcement requirements that apply in Malaysia."
        ]
      },
      {
        heading: "4. Legal basis, consent, and sensitive data",
        body: [
          "Where required, we rely on your consent to process personal data. By voluntarily submitting information through our forms or service flows, you acknowledge that the information may be processed for the purposes described in this policy.",
          "Health information can be sensitive. Where you provide health-related information, you confirm that you have chosen to share it with us for service delivery, support, personalization, or related purposes clearly presented to you at the time of collection."
        ]
      },
      {
        heading: "5. Disclosure to third parties",
        body: [
          "We may share personal data with service providers who support website hosting, analytics, communications, infrastructure, security, customer support, and other operational services, but only where reasonably necessary and subject to appropriate confidentiality and data handling controls.",
          "We may also disclose information where required by law, to protect our legal rights, to investigate misuse, or as part of a corporate transaction such as a restructuring, merger, or investment process, subject to lawful safeguards."
        ]
      },
      {
        heading: "6. Cross-border transfers",
        body: [
          "Some of our vendors or systems may process data outside Malaysia. Where cross-border transfers occur, we take reasonable steps to ensure that personal data continues to receive protection that is consistent with our obligations and internal standards.",
          "By using our services and providing information to us, you understand that data may be stored or processed in jurisdictions outside Malaysia where our technology providers operate."
        ]
      },
      {
        heading: "7. Retention and security",
        body: [
          "We retain personal data only for as long as reasonably necessary for the purpose for which it was collected, for backup and audit purposes, to resolve disputes, or to meet legal and operational requirements.",
          "We use administrative, technical, and organizational safeguards designed to protect personal data against unauthorized access, loss, misuse, alteration, or disclosure. However, no internet transmission or storage system can be guaranteed to be completely secure."
        ]
      },
      {
        heading: "8. Your rights in Malaysia",
        body: [
          "Subject to the PDPA and any permitted exceptions, you may request access to your personal data and request correction of personal data that is inaccurate, incomplete, misleading, or out of date.",
          "You may also ask questions about how we process your data, withdraw certain consents where processing depends on consent, and request that we limit certain communications. We may need to verify your identity before acting on a request."
        ]
      },
      {
        heading: "9. Cookies and website tracking",
        body: [
          "Our use of cookies and similar technologies is described further in our Cookie Policy. These technologies help us understand traffic, improve usability, secure the website, and remember preferences.",
          "Where required, you can manage cookies through your browser settings, although disabling some cookies may affect the functionality or performance of the website."
        ]
      },
      {
        heading: "10. Changes to this policy",
        body: [
          "We may update this Privacy Policy from time to time to reflect changes in the website, our services, operational needs, or legal and regulatory developments. The updated version will be posted on this page with a revised effective date.",
          "Your continued use of the website after an update takes effect means the latest version will apply to your interactions with us from that date onward."
        ]
      }
    ]
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "Terms for using RicHealth AI",
    intro:
      "These Terms of Service govern access to and use of the RicHealth AI website, digital content, contact channels, and related products or services made available by us from time to time.",
    effectiveDate: "Effective date: 26 March 2026",
    summary: [
      "By using the website, you agree to these Terms of Service.",
      "RicHealth AI content is informational and service-related, and is not a substitute for emergency or in-person medical care.",
      "Users must provide accurate information, use the platform lawfully, and avoid misuse or interference.",
      "These terms are intended to be interpreted under the laws of Malaysia."
    ],
    sections: [
      {
        heading: "1. Acceptance of terms",
        body: [
          "By accessing or using our website or related services, you agree to be bound by these Terms of Service and any additional notices or policies we publish on the site. If you do not agree, you should stop using the website and services.",
          "If you use the website on behalf of a company or organization, you confirm that you have authority to bind that entity to these terms."
        ]
      },
      {
        heading: "2. Eligibility and responsible use",
        body: [
          "You must use the website only for lawful purposes and in a way that does not violate the rights of others, disrupt the experience of other users, or damage the security or integrity of our systems.",
          "You agree not to upload malicious code, attempt unauthorized access, scrape restricted content at scale, misrepresent your identity, or use the website in connection with unlawful, harmful, or misleading activity."
        ]
      },
      {
        heading: "3. Health and wellness disclaimer",
        body: [
          "RicHealth AI may present information relating to nutrition, wellness, diagnostics, and health optimization. This information is provided for general informational and service-support purposes only and is not medical advice, diagnosis, or treatment.",
          "You should seek advice from a qualified doctor, pharmacist, dietitian, or other licensed healthcare professional in Malaysia before making decisions based on symptoms, medication use, underlying conditions, pregnancy, or urgent health concerns. If you believe you are experiencing a medical emergency, seek immediate professional care."
        ]
      },
      {
        heading: "4. Accounts, submissions, and accuracy",
        body: [
          "Where you submit information, join a waitlist, request a service, or create an account in the future, you agree to provide information that is accurate, current, and complete.",
          "You are responsible for safeguarding any credentials associated with your access and for activity occurring under your account or device to the extent permitted by law."
        ]
      },
      {
        heading: "5. Intellectual property",
        body: [
          "Unless otherwise stated, the website, branding, text, layout, graphics, software, and related content are owned by RicHealth AI or its licensors and are protected by applicable intellectual property laws.",
          "You may view and use the website for your personal or internal business evaluation purposes, but you may not reproduce, republish, modify, distribute, or exploit site content without prior written permission, except as allowed by law."
        ]
      },
      {
        heading: "6. Service availability and changes",
        body: [
          "We may update, suspend, restrict, or discontinue any part of the website or services at any time, including for maintenance, security, operational changes, or product development reasons.",
          "We do not guarantee uninterrupted availability, error-free operation, or that the website will always be compatible with every device, browser, or network environment."
        ]
      },
      {
        heading: "7. Third-party links and services",
        body: [
          "The website may contain links to third-party platforms, tools, or resources. These are provided for convenience only. We do not control and are not responsible for the content, practices, or availability of third-party websites or services.",
          "Your use of third-party services is governed by their own terms and policies."
        ]
      },
      {
        heading: "8. Limitation of liability",
        body: [
          'To the fullest extent permitted by applicable Malaysian law, RicHealth AI provides the website and related content on an "as is" and "as available" basis without guarantees of completeness, accuracy, reliability, merchantability, or fitness for a particular purpose.',
          "To the extent permitted by law, we will not be liable for indirect, incidental, special, consequential, or punitive losses, or for loss of profits, data, goodwill, or business opportunity arising from or related to your use of the website or reliance on its content."
        ]
      },
      {
        heading: "9. Indemnity",
        body: [
          "You agree to indemnify and hold RicHealth AI, its affiliates, team members, and service providers harmless from claims, liabilities, losses, and expenses arising from your misuse of the website, breach of these terms, or violation of law or third-party rights, except to the extent caused by our own negligence or misconduct where such exclusion is not permitted."
        ]
      },
      {
        heading: "10. Governing law",
        body: [
          "These Terms of Service are governed by and interpreted in accordance with the laws of Malaysia. Any dispute, claim, or proceeding arising from or related to these terms or the website shall be subject to the applicable courts of Malaysia, unless otherwise required by law."
        ]
      }
    ]
  },
  cookies: {
    eyebrow: "Cookie Policy",
    title: "How RicHealth AI uses cookies and similar technologies",
    intro:
      "This Cookie Policy explains how RicHealth AI uses cookies, pixels, local storage, and similar technologies on our website to keep the site functioning, understand traffic, and improve user experience.",
    effectiveDate: "Effective date: 26 March 2026",
    summary: [
      "Cookies help us remember preferences, understand site usage, and support website security and performance.",
      "Some cookies are essential for the website to operate correctly, while others support analytics and optimization.",
      "You can control cookies through your browser settings.",
      "Disabling cookies may affect some website features or performance."
    ],
    sections: [
      {
        heading: "1. What cookies are",
        body: [
          "Cookies are small text files placed on your device when you visit a website. Similar technologies may include local storage, SDKs, pixels, scripts, and tags that help websites recognize devices, remember choices, and measure interactions."
        ]
      },
      {
        heading: "2. Why we use cookies",
        body: [
          "We use cookies and similar technologies to support core website functionality, understand how visitors use our pages, improve performance, analyze navigation trends, and help us refine content, product messaging, and user flows.",
          "We may also use them to maintain session integrity, prevent abuse, remember display preferences, and support the delivery of forms or communications features."
        ]
      },
      {
        heading: "3. Types of cookies we may use",
        body: [
          "Essential cookies: These are necessary for the website to function, including basic navigation, security, and core interface behavior.",
          "Analytics cookies: These help us understand traffic sources, page usage, device patterns, and site performance so we can improve the experience.",
          "Preference cookies: These remember settings such as language or display choices where such functionality is offered.",
          "Third-party cookies: Some cookies may be set by trusted service providers who support hosting, analytics, embedded content, communications, or other operational tools."
        ]
      },
      {
        heading: "4. Cookie duration",
        body: [
          "Some cookies operate only during your browser session and expire when you close the browser. Others may remain on your device for a longer period so that settings and analytics can persist across visits."
        ]
      },
      {
        heading: "5. Managing cookies",
        body: [
          "Most browsers allow you to view, block, delete, or restrict cookies through settings or privacy controls. You can usually configure your browser to reject certain cookies or notify you before a cookie is stored.",
          "If you disable essential cookies, parts of the website may not work correctly or may be less secure."
        ]
      },
      {
        heading: "6. Updates to this Cookie Policy",
        body: [
          "We may update this Cookie Policy from time to time to reflect changes in the technologies we use, the website, or legal and operational requirements. The latest version will always be posted on this page with the updated effective date."
        ]
      },
      {
        heading: "7. Contact us",
        body: [
          "If you have questions about our use of cookies or related technologies, you may contact RicHealth AI at hello@richealth.ai or +60 16-447 6899."
        ]
      }
    ]
  },
  "shipping-returns": {
    eyebrow: "Shipping & Return Policy",
    title: "Shipping and return policy",
    intro:
      "This policy explains how RicHealth AI handles order processing, delivery timelines, shipping fees, damaged parcels, cancellations, and return requests for products sold through our website.",
    effectiveDate: "Effective date: 26 March 2026",
    summary: [
      "Orders are processed on business days and shipping timelines may vary by destination.",
      "Shipping fees and delivery estimates are shown at checkout before payment.",
      "Report damaged, defective, or incorrect items promptly so we can review and resolve.",
      "Return or replacement eligibility depends on product condition, safety requirements, and request timing."
    ],
    sections: [
      {
        heading: "1. Order processing",
        body: [
          "Orders are typically processed after successful payment confirmation. Processing usually takes one to three business days, excluding weekends and public holidays.",
          "If order volume is unusually high or additional verification is needed, processing may take longer. We will aim to keep you informed where material delays occur."
        ]
      },
      {
        heading: "2. Shipping coverage and delivery estimates",
        body: [
          "We currently prioritize deliveries within Malaysia. Estimated delivery windows depend on courier coverage, destination, weather, and logistics conditions.",
          "Delivery estimates displayed at checkout are indicative and not guaranteed. Once your parcel is handed to the courier, transit timing is managed by the shipping partner."
        ]
      },
      {
        heading: "3. Shipping fees and tracking",
        body: [
          "Shipping charges, if applicable, are shown during checkout before you complete payment. Promotional free-shipping offers may be available from time to time under stated terms.",
          "Where tracking is available, shipment updates are provided through the courier tracking link or delivery notifications shared with your order details."
        ]
      },
      {
        heading: "4. Incorrect, missing, or damaged items",
        body: [
          "If your order arrives damaged, incomplete, or contains incorrect items, contact us as soon as possible at hello@richealth.ai with your order number and clear photo evidence.",
          "After review, we may provide a replacement, partial refund, or another suitable resolution depending on stock availability and case findings."
        ]
      },
      {
        heading: "5. Returns and eligibility",
        body: [
          "For hygiene and safety reasons, opened consumable products may not be eligible for return unless the item is defective, damaged on arrival, or supplied incorrectly.",
          "Unopened items in original condition may be considered for return requests submitted within seven days of delivery, subject to review and approval."
        ]
      },
      {
        heading: "6. Cancellations and refunds",
        body: [
          "Cancellation requests are only possible before the order is packed or dispatched. Once shipped, cancellation may no longer be available and the return process will apply where eligible.",
          "Approved refunds are typically issued to the original payment method. Processing time may vary based on your payment provider and bank timelines."
        ]
      },
      {
        heading: "7. Contact for shipping support",
        body: [
          "For shipping, delivery, or return support, contact RicHealth AI at hello@richealth.ai or +60 16-447 6899 and include your order number for faster assistance."
        ]
      }
    ]
  }
};

const legalTabs: Array<{ type: LegalPageType; label: string; href: string }> = [
  { type: "privacy", label: "Privacy Policy", href: "/privacy-policy" },
  { type: "terms", label: "Terms of Service", href: "/terms-of-service" },
  { type: "cookies", label: "Cookies", href: "/cookies" },
  { type: "shipping-returns", label: "Shipping & Returns", href: "/shipping-and-return-policy" }
];

interface LegalPageProps {
  pageType: LegalPageType;
}

function LegalPage({ pageType }: LegalPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const documentContent = useMemo(() => legalDocuments[pageType], [pageType]);

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
          <a href="/ingredients">Ingredients</a>
          <a href="/contact">Contact</a>
          <a className="site-nav-cta" href="mailto:hello@richealth.ai">
            Contact support
          </a>
        </nav>

        <a className="header-cta" href="mailto:hello@richealth.ai">
          Contact support
        </a>
      </motion.header>

      <main>
        <section className="legal-hero">
          <motion.div
            className="legal-hero-card"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="hero-label">
              {documentContent.eyebrow}
            </motion.p>
            <motion.h1 variants={fadeUp}>{documentContent.title}</motion.h1>
            <motion.p variants={fadeUp} className="hero-copy legal-intro">
              {documentContent.intro}
            </motion.p>

            <motion.div variants={fadeUp} className="legal-meta-row">
              <span className="legal-jurisdiction">Jurisdiction: Malaysia</span>
            </motion.div>

            <motion.div variants={fadeUp} className="legal-tab-list" aria-label="Legal pages">
              {legalTabs.map((tab) => (
                <a
                  key={tab.type}
                  href={tab.href}
                  className={`legal-tab ${tab.type === pageType ? "is-active" : ""}`}
                  aria-current={tab.type === pageType ? "page" : undefined}
                >
                  {tab.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="legal-content-section">
          <motion.div
            className="legal-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.aside variants={fadeUp} className="legal-summary-card">
              <span className="site-footer-heading">At a glance</span>
              <ul className="legal-summary-list">
                {documentContent.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.aside>

            <div className="legal-sections">
              {documentContent.sections.map((section) => (
                <motion.article key={section.heading} variants={fadeUp} className="legal-section-card">
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </motion.article>
              ))}
            </div>
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
                <a href="/#solution">How it works</a>
                <a href="/#product">Your blend</a>
                <a href="/ingredients">Ingredients</a>
                <a href="/#technology">Technology & trust</a>
              </div>

              <div className="site-footer-column">
                <span className="site-footer-heading">Company</span>
                <a href="/">About</a>
                <a href="/contact">Contact</a>
                <a href="mailto:hello@richealth.ai">Social Media</a>
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

          <div className="site-footer-bottom">
            <span className="site-footer-meta">© 2026 RicHealth AI. All rights reserved.</span>
            <span className="site-footer-meta">Malaysia-focused health technology and personalized nutrition.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LegalPage;
