'use client';

import React from "react";
import { cardVariant, fadeInUp, stagger } from "./util/constants";
//eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import FloatingCorners from "./ui/floating-corners";
import { FiDatabase, FiCpu, FiTrendingUp, } from "react-icons/fi";
import {  RiGeminiFill } from 'react-icons/ri'
import { IoSettingsSharp } from 'react-icons/io5'
export const Features = () => {
  return (
    <motion.section
      className="py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="text-center mb-12">
        <motion.h3
          className="text-4xl font-bold tracking-tight"
          variants={fadeInUp}
        >
          An End to Fragmented Tech Intelligence
        </motion.h3>
        <motion.p
          className="mt-3 max-w-xl mx-auto text-neutral-400"
          variants={fadeInUp}
        >
          Our platform directly addresses the core challenges of modern
          technology scouting.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={stagger}
      >
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.995 }}
          className="flex flex-col items-start relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6"
        >
          <FloatingCorners />
          <motion.div
            aria-hidden
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <IoSettingsSharp  className="h-8 w-8 text-sky-500 mb-4" />
          </motion.div>
          <h4 className="text-xl font-semibold mb-2">
            Automated Data Aggregation
          </h4>
          <p className="text-neutral-400">
            Unify intelligence from global patents, research publications, and
            industry reports into a single, cohesive view.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariant}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.995 }}
          className="flex flex-col items-start relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6"
        >
          <FloatingCorners />
          <motion.div
            aria-hidden
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <RiGeminiFill className="h-8 w-8 text-sky-500 mb-4" />
          </motion.div>
          <h4 className="text-xl font-semibold mb-2">
            AI-Powered Strategic Analysis
          </h4>
          <p className="text-neutral-400">
            Leverage advanced LLMs for real-time TRL assessment, relationship
            mapping, and strategic summary generation, eliminating manual
            delays.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariant}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.995 }}
          className="flex flex-col items-start relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6"
        >
          <FloatingCorners />
          <motion.div
            aria-hidden
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <FiTrendingUp className="h-8 w-8 text-sky-500 mb-4" />
          </motion.div>
          <h4 className="text-xl font-semibold mb-2">
            Predictive Technology Forecasting
          </h4>
          <p className="text-neutral-400">
            Track technology progression with S-curves, detect market
            convergence, and receive continuous updates on emerging tech
            signals.
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
