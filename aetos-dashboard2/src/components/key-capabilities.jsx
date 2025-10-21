'use client';

import React from 'react';
//eslint-disable-next-line
import { motion } from 'framer-motion';
import { useAtom, useSetAtom } from 'jotai';
import { FiDatabase, FiCpu } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import { hoveredAtom } from '../state/atoms';
import { fadeInUp, cardVariant } from './util/constants';

function InteractiveDemo({ src = "/demo-dashboard.png" }) {
  const [hovered, setHovered] = useAtom(hoveredAtom);

  const boxes = [
    { id: "convergence", top: "12%", left: "22.5%", width: "12.5%", height: "3.5%" },
    { id: "trl", top: "39.5%", left: "72.5%", width: "12.5%", height: "3.5%" },
    { id: "adoption", top: "78.5%", left: "23.5%", width: "8.3%", height: "3.5%" },
  ];

  return (
    <div className="relative w-full max-w-7xl mx-auto flex justify-center">
      <img
        src={src}
        alt="AETOS Intelligence Dashboard Demo"
        className="w-full shadow-2xl rounded-lg transition-all duration-300" // Changed to w-full for better container control
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
              scale: active ? 1.05 : 1,
              boxShadow: active
                ? "0 18px 20px rgba(56,189,248,0.28), 0 0 80px rgb(56,189,248)"
                : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ type: "spring", stiffness: active ? 200 : 220, damping: active ? 22 : 26, mass: 0.9 }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                background: active
                  ? "linear-gradient(180deg, rgba(14,165,233,0.06), rgba(14,165,233,0.03))"
                  : "transparent",
                transition: "background 260ms cubic-bezier(.22,1,.36,1)",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// Updated to accept and render the icon prop
function FeatureCard({ title, body, id, icon }) {
  const setHovered = useSetAtom(hoveredAtom);
  const Icon = icon; // Assign prop to a capitalized variable to be used as a component

  return (
    <motion.div
      onMouseEnter={() => setHovered(id)}
      onFocus={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      onBlur={() => setHovered(null)}
      variants={cardVariant}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.995 }}
      // Changed to items-center for better alignment
      className="flex flex-col items-center text-center relative max-w-sm mx-auto bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-sky-800"
    >
      {/* Render the icon if it exists */}
      <div className='flex flex-row gap-3 items-center justify-center'>
      {Icon && (
        <div className="bg-neutral-800 p-3 rounded-full mb-4">
            <Icon className="w-6 h-6 text-sky-400" />
        </div>
      )}
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      </div>
      <p className="text-neutral-400">{body}</p>
    </motion.div>
  );
}

export default function KeyCapabilities() {
  return (
    <motion.section
      id="features"
      className="py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="text-center mb-12">
        <motion.h3 className="text-4xl mt-10 font-bold tracking-tight" variants={fadeInUp}>
          Key Capabilities
        </motion.h3>
        <motion.p className="mt-3 max-w-xl mx-auto text-neutral-400" variants={fadeInUp}>
          Visualize, forecast, and act on emerging technologies — all in real-time.
        </motion.p>
      </div>

      {/* Main grid now stacks on mobile and goes side-by-side on large screens */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-12 items-start pt-10'>

        {/* Interactive demo takes full width on mobile, 3/4 on large screens */}
        <div className="lg:col-span-3 mx-auto my-auto">
          <InteractiveDemo />
        </div>

        {/* Feature cards stack vertically in their column */}
        <div className="flex flex-col gap-8">
          <FeatureCard
            icon={FiDatabase}
            title="Technology Convergence"
            body="Maps data to predict how technologies will merge and evolve."
            id="convergence"
          />
          <FeatureCard
            icon={FiCpu}
            title="TRL Progression"
            body="Automatically forecasts tech readiness to speed up development."
            id="trl"
          />
          <FeatureCard
            icon={BsGraphUp}
            title="Adoption Rate"
            body="Uses real-time analytics to identify key growth points for better planning."
            id="adoption"
          />
        </div>
      </div>
    </motion.section>
  );
}