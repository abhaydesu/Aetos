import React from "react";
import { Link } from "react-router-dom";
import { FiDatabase, FiCpu, FiTrendingUp } from "react-icons/fi";
import { Icon } from "../components/ui/Icon";
import { ScrollDownIndicator } from "../components/ui/ScrollDownIndicator";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
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

function InteractiveDemo({ src = "/demo-dashboard.png", hovered }) {
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
            className="absolute rounded-lg pointer-events-none"
            style={{ top: b.top, left: b.left, width: b.width, height: b.height }}
            initial={false}
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? 1.03 : 1,
              boxShadow: active
                ? "0 0 30px rgba(56,189,248,0.6), 0 0 80px rgba(56,189,248,0.4), 0 0 120px rgba(56,189,248,0.25)"
                : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </div>
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
              Transform Scattered Data into <br /> Strategic Intelligence
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
              <InteractiveDemo src="/demo-dashboard.png" hovered={hovered} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                onMouseEnter={() => setHovered("convergence")}
                onFocus={() => setHovered("convergence")}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
                variants={cardVariant}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
                className="flex flex-col items-start relative bg-neutral-900/50 border border-neutral-800 rounded-xl p-6"
              >
                <FloatingCorners />
                <FiDatabase className="h-8 w-8 text-sky-500 mb-4" />
                <h4 className="text-xl font-semibold mb-2">Technology Convergence</h4>
                <p className="text-neutral-400 leading-relaxed">
                  Maps relationships across patents, publications, and suppliers to detect convergence zones and predict integrated tech pathways.
                </p>
              </motion.div>

              <motion.div
                onMouseEnter={() => setHovered("trl")}
                onFocus={() => setHovered("trl")}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
                variants={cardVariant}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
                className="flex flex-col items-start relative bg-neutral-900/50 border border-neutral-800 rounded-xl p-6"
              >
                <FloatingCorners />
                <FiCpu className="h-8 w-8 text-sky-500 mb-4" />
                <h4 className="text-xl font-semibold mb-2">TRL Progression</h4>
                <p className="text-neutral-400 leading-relaxed">
                  Automated TRL estimation and trajectory forecasting to help labs prioritize development and reduce time-to-adoption.
                </p>
              </motion.div>

              <motion.div
                onMouseEnter={() => setHovered("adoption")}
                onFocus={() => setHovered("adoption")}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
                variants={cardVariant}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
                className="flex flex-col items-start relative bg-neutral-900/50 border border-neutral-800 rounded-xl p-6"
              >
                <FloatingCorners />
                <FiTrendingUp className="h-8 w-8 text-sky-500 mb-4" />
                <h4 className="text-xl font-semibold mb-2">Adoption Rate</h4>
                <p className="text-neutral-400 leading-relaxed">
                  Real-time S-curve analytics and signal detection to identify inflection points for smarter, data-backed planning.
                </p>
              </motion.div>
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
        </main>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}
