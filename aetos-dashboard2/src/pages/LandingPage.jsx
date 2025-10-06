import React from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import Navbar from "../components/navbar.jsx";
import KeyCapabilities from "../components/key-capabilities.jsx";
import FAQs from "../components/FAQs";
import { Callout } from "../components/Callout";
import { Features } from "../components/features";
import Footer from "../components/footer";
import { ScrollDownIndicator } from "../components/ui/ScrollDownIndicator";
import { MagicButton } from "../components/ui/MagicButton.jsx";
import { Hero } from "../components/Hero.jsx";

export default function LandingPage() {
  return (
    <div className=" bg-neutral-950 text-neutral-100 inter overflow-x-hidden relative">
      <motion.div
        className="pointer-events-none absolute inset-0 w-full bg-grid-neutral-800/40"
        style={{
          maskImage:
            "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <Navbar />

      <main className="relative z-10 max-w-7xl mt-40 mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <motion.div
          className="text-center mt-25 mb-20"
          initial={{ opacity: 0, y: -4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <ScrollDownIndicator />
        </motion.div>

        <KeyCapabilities />
        <Features />
        <FAQs />
        <Callout />
      </main>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
