import React from "react";
import { Link } from "react-router-dom";
import { FiDatabase, FiCpu, FiTrendingUp } from "react-icons/fi";
import { Icon } from "../components/ui/Icon";
import { ScrollDownIndicator } from "../components/ui/ScrollDownIndicator";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import FAQs from "../components/FAQs";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function InteractiveDemo({ src = "/demo-dashboard.png", hovered, setHovered }) {
  const boxes = [
    { id: "convergence", top: "12%", left: "26.5%", width: "12.5%", height: "3.5%" },
    { id: "trl", top: "39.5%", left: "66.5%", width: "12.5%", height: "3.5%" },
    { id: "adoption", top: "78.5%", left: "27.5%", width: "8.3%", height: "3.5%" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex justify-center">
      <img
        src={src}
        alt="AETOS Intelligence Dashboard Demo"
        className="w-[80%] shadow-2xl rounded-lg transition-all duration-300"
        style={{
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }}
      />
      {boxes.map((b) => {
        const active = hovered === b.id;
        return (
          <motion.div
            key={b.id}
            className="absolute rounded-lg"
            style={{ top: b.top, left: b.left, width: b.width, height: b.height }}
            initial={false}
            onMouseEnter={() => setHovered(b.id)}
            onFocus={() => setHovered(b.id)}
            onMouseLeave={() => setHovered(null)}
            onBlur={() => setHovered(null)}
            animate={{
              opacity: active ? 1 : 0.02,
              scale: active ? 1.03 : 1,
              boxShadow: active
                ? "0 18px 48px rgba(56,189,248,0.28), 0 0 80px rgba(56,189,248,0.18)"
                : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ type: "spring", stiffness: active ? 200 : 220, damping: active ? 22 : 26, mass: 0.9 }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                background: active ? "linear-gradient(180deg, rgba(14,165,233,0.06), rgba(14,165,233,0.03))" : "transparent",
                transition: "background 260ms cubic-bezier(.22,1,.36,1)",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}


function FeatureCard({ icon: IconComp, title, body, hoveredKey, id, onHover }) {
  return (
    <motion.div
      onMouseEnter={() => onHover(id)}
      onFocus={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onBlur={() => onHover(null)}
      variants={cardVariant}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      className="flex flex-col items-start relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6"
    >
      <FloatingCorners />
      <div className="mb-4">
        <IconComp className="h-8 w-8 text-sky-500" />
      </div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-neutral-400">{body}</p>
    </motion.div>
  );
}

function FloatingCorners() {
  return (
    <>
      <motion.span className="absolute h-6 w-6 -top-3 -left-3 text-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Icon className="h-6 w-6" />
      </motion.span>
      <motion.span className="absolute h-6 w-6 -bottom-3 -left-3 text-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Icon className="h-6 w-6" />
      </motion.span>
      <motion.span className="absolute h-6 w-6 -top-3 -right-3 text-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Icon className="h-6 w-6" />
      </motion.span>
      <motion.span className="absolute h-6 w-6 -bottom-3 -right-3 text-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <Icon className="h-6 w-6" />
      </motion.span>
    </>
  );
}

export default function LandingPage() {
  const [hovered, setHovered] = React.useState(null);
  const [mousePosition, setMousePosition] = React.useState(null);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 inter overflow-x-hidden relative">
      <motion.div
        className="pointer-events-none absolute inset-0 w-full bg-grid-neutral-800/40"
        style={{
          maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <div className="relative z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Navbar />
        </motion.div>
        <main className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.section className="text-center pt-20 pb-24" initial="hidden" animate="visible" variants={stagger}>
            <motion.h2 className="text-4xl md:text-7xl font-extrabold tracking-tight" variants={fadeInUp}>
              Transform Scattered Data into Strategic Intelligence
            </motion.h2>
            <motion.p className="mt-10 max-w-2xl mx-auto text-lg text-neutral-300" variants={fadeInUp}>
              AETOS is an AI-powered platform that automates technology intelligence, providing real-time forecasting and comprehensive insights to accelerate strategic decision-making for DRDO.
            </motion.p>
            <motion.div className="mt-8" variants={fadeInUp}>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 bg-sky-600 text-neutral-50 hover:bg-sky-500 h-11 px-8 mt-8"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.section>

          <motion.div className="text-center mt-25 mb-20" initial={{ opacity: 0, y: -4 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
              <ScrollDownIndicator />
            </motion.div>
          </motion.div>

          <motion.section id="features" className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="text-center mb-12">
              <motion.h3 className="text-3xl font-bold tracking-tight" variants={fadeInUp}>
                Key Capabilities
              </motion.h3>
              <motion.p className="mt-3 max-w-xl mx-auto text-neutral-400" variants={fadeInUp}>
                Visualize, forecast, and act on emerging technologies — all in real-time.
              </motion.p>
            </div>

            <div className="max-w-6xl mx-auto mb-16">
              <InteractiveDemo src="/demo-dashboard.png" hovered={hovered} setHovered={setHovered} mousePosition={mousePosition} setMousePosition={setMousePosition} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={FiDatabase}
                title="Technology Convergence"
                body="Maps relationships across patents, publications, and suppliers to detect convergence zones and predict integrated tech pathways."
                hoveredKey={hovered}
                id="convergence"
                onHover={setHovered}
              />
              <FeatureCard
                icon={FiCpu}
                title="TRL Progression"
                body="Automated TRL estimation and trajectory forecasting to help labs prioritize development and reduce time-to-adoption."
                hoveredKey={hovered}
                id="trl"
                onHover={setHovered}
              />
              <FeatureCard
                icon={FiTrendingUp}
                title="Adoption Rate"
                body="Real-time S-curve analytics and signal detection to identify inflection points for smarter, data-backed planning."
                hoveredKey={hovered}
                id="adoption"
                onHover={setHovered}
              />
            </div>
          </motion.section>

          <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="text-center mb-12">
              <motion.h3 className="text-3xl font-bold tracking-tight" variants={fadeInUp}>
                An End to Fragmented Tech Intelligence
              </motion.h3>
              <motion.p className="mt-3 max-w-xl mx-auto text-neutral-400" variants={fadeInUp}>
                Our platform directly addresses the core challenges of modern technology scouting.
              </motion.p>
            </div>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger}>
              <motion.div variants={cardVariant} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.995 }} className="flex flex-col items-start relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6">
                <FloatingCorners />
                <motion.div aria-hidden animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <FiDatabase className="h-8 w-8 text-sky-500 mb-4" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">Automated Data Aggregation</h4>
                <p className="text-neutral-400">
                  Unify intelligence from global patents, research publications, and industry reports into a single, cohesive view.
                </p>
              </motion.div>

              <motion.div variants={cardVariant} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.995 }} className="flex flex-col items-start relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6">
                <FloatingCorners />
                <motion.div aria-hidden animate={{ y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
                  <FiCpu className="h-8 w-8 text-sky-500 mb-4" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">AI-Powered Strategic Analysis</h4>
                <p className="text-neutral-400">
                  Leverage advanced LLMs for real-time TRL assessment, relationship mapping, and strategic summary generation, eliminating manual delays.
                </p>
              </motion.div>

              <motion.div variants={cardVariant} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.995 }} className="flex flex-col items-start relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6">
                <FloatingCorners />
                <motion.div aria-hidden animate={{ y: [0, -3, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
                  <FiTrendingUp className="h-8 w-8 text-sky-500 mb-4" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">Predictive Technology Forecasting</h4>
                <p className="text-neutral-400">
                  Track technology progression with S-curves, detect market convergence, and receive continuous updates on emerging tech signals.
                </p>
              </motion.div>
            </motion.div>
          </motion.section>

          <FAQs />

          <motion.section className="py-24 text-center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <motion.div className="bg-gradient-to-r from-sky-900/20 to-neutral-900/20 p-12" variants={fadeInUp}>
              <motion.h3 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4" variants={fadeInUp}>
                Ready to Transform Your Technology Intelligence?
              </motion.h3>
              <motion.p className="text-md text-neutral-400 max-w-2xl mx-auto mb-8" variants={fadeInUp}>
                Join DRDO in leveraging AI-powered insights for strategic decision-making. Start your journey with AETOS today and stay ahead of technological trends.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link to="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-sky-600 text-neutral-50 hover:bg-sky-500 h-12 px-10">
                  Get Started Now
                </Link>
              </motion.div>
            </motion.div>
          </motion.section>
        </main>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}