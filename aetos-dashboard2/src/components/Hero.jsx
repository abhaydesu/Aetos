// src/components/Hero.jsx

"use client";

import React from "react";
import { stagger, fadeInUp } from "./util/constants";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { MagicButton } from "./ui/MagicButton.jsx";
import DecryptedText from "./ui/DecryptedText.jsx";
import Animatedheading from "./ui/AnimationHeading.jsx";
import { Link } from "react-router-dom";
import { DemoSection } from "./DemoSection.jsx";
import { ScrollDownIndicator } from "./ui/ScrollDownIndicator.jsx";

export const Hero = () => {

  return (
    <>
      <motion.section
        className="relative text-center pt-24 pb-24 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className="relative z-10">
          <motion.h2
            className="text-4xl md:text-7xl font-extrabold mt-6 tracking-tight"
            variants={fadeInUp}
          >
            <Animatedheading text="Transform Scattered Data into" />
            <br />
            <DecryptedText
              text="Strategic Intelligence"
              animateOn="view"
              revealDirection="center"
              speed={100}
              parentClassName="inline-block leading-tighter pb-2"
              className="inline-block bg-gradient-to-br from-neutral-200 via-neutral-300 to-sky-400 bg-clip-text text-transparent leading-tighter pb-2"
              encryptedClassName="inline-block bg-gradient-to-br from-neutral-200 via-neutral-300 to-sky-400 bg-clip-text text-transparent leading-tighter pb-2"
            />
          </motion.h2>

          <motion.p
            className="mt-10 max-w-2xl mx-auto text-lg text-neutral-400 leading-relaxed"
            variants={fadeInUp}
          >
            AETOS is an AI-powered platform that automates technology
            intelligence, providing{" "}
            <span className="text-neutral-200 font-semibold">
              real-time forecasting
            </span>{" "}
            and{" "}
            <span className="text-neutral-200 font-semibold">
              comprehensive insights
            </span>{" "}
            to accelerate strategic decision-making for DRDO.
          </motion.p>

          <motion.div className="mt-8" variants={fadeInUp}>
            <Link to="/dashboard">
            <MagicButton>
              Get Started
            </MagicButton>
            </Link>
            
              <a 
                target="_blank"
                href="https://youtu.be/lJUfEGNZ69A"
              >
            <button
              className="mx-5 relative inline-flex h-11 px-8 mt-8
              items-center justify-center whitespace-nowrap
              rounded-md text-sm font-medium text-neutral-50
              ring-offset-neutral-900 transition-colors
              focus-visible:outline-none
              overflow-hidden group cursor-pointer bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 "
            >
              Watch Demo

            </button>
                          </a>
          </motion.div>

          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <ScrollDownIndicator className="mt-0" />
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};
