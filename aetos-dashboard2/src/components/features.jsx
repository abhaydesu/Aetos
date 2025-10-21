'use-client';

import React from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { BrainCircuit, DatabaseZap, TrendingUp } from "lucide-react";

// Animation variants for the container and items
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Data for the feature cards for easier mapping and maintenance
const features = [
  {
    icon: <DatabaseZap className="h-7 w-7 text-sky-400" />,
    title: "Automated Data Aggregation",
    description: "Unify intelligence from global patents, research publications, and industry reports into a single, cohesive view.",
  },
  {
    icon: <BrainCircuit className="h-7 w-7 text-sky-400" />,
    title: "AI-Powered Strategic Analysis",
    description: "Leverage advanced LLMs for real-time TRL assessment, relationship mapping, and strategic summary generation.",
  },
  {
    icon: <TrendingUp className="h-7 w-7 text-sky-400" />,
    title: "Predictive Technology Forecasting",
    description: "Track technology progression with S-curves, detect market convergence, and receive continuous updates on emerging tech signals.",
  },
];

export const FeaturesRedesigned = () => {
  return (
    <motion.section
      className="py-20 px-4 md:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-2"
          variants={fadeInUp}
        >
          An End to Fragmented Tech Intelligence
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-neutral-400"
          variants={fadeInUp}
        >
          Our platform directly addresses the core challenges of modern technology scouting.
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={staggerContainer}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.03 }}
            className="p-8 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm cursor-pointer"
            style={{
              // Adds a subtle radial gradient for depth
              backgroundImage: 'radial-gradient(circle at top, rgba(14, 165, 233, 0.08), transparent 40%)',
            }}
          >
            {/* Styled Icon Container */}
            <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-2xl bg-neutral-950/50 border border-neutral-700">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-neutral-50 mb-3">
              {feature.title}
            </h3>
            <p className="text-neutral-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};