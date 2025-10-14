// src/components/Hero.jsx

'use client';

import React from 'react';
import { stagger, fadeInUp } from './util/constants';
//eslint-disable-next-line
import { motion } from 'framer-motion';
import { MagicButton } from './ui/MagicButton.jsx';
import DecryptedText from './ui/DecryptedText.jsx';
import Animatedheading from './ui/AnimationHeading.jsx';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <motion.section
      className="text-center pt-20 pb-24"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.h2
        className="text-4xl md:text-7xl font-extrabold mt-10 tracking-tight"
        variants={fadeInUp}
      >
        <Animatedheading   text="Transform Scattered Data into" />
        <DecryptedText
          text="Strategic Intelligence"
          animateOn="view"
          revealDirection="center"
          // INCREASE THIS VALUE for a slower, longer animation
          speed={120} 
          parentClassName="inline-block leading-tighter pb-2"
          className="bg-gradient-to-br from-neutral-200 via-neutral-300 to-sky-400 bg-clip-text text-transparent"
          encryptedClassName="bg-gradient-to-br from-neutral-200 via-neutral-300 to-sky-400 bg-clip-text text-transparent text-neutral-500"
        />
      </motion.h2>

      <motion.p
        className="mt-10 max-w-2xl mx-auto text-lg text-neutral-300"
        variants={fadeInUp}
      >
        AETOS is an AI-powered platform that automates technology
        intelligence, providing real-time forecasting and comprehensive
        insights to accelerate strategic decision-making for DRDO.
      </motion.p>
      <motion.div className="mt-8" variants={fadeInUp}>
        <MagicButton>
          <Link to="/dashboard">
          Get Started
          </Link>
        </MagicButton>
        <button className="mx-5 relative inline-flex h-11 px-8 mt-8
            items-center justify-center whitespace-nowrap
            rounded-md text-sm font-medium text-neutral-50
            ring-offset-neutral-900 transition-colors
            focus-visible:outline-none
            overflow-hidden group cursor-pointer bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 ">
        <Link to='https://youtu.be/lJUfEGNZ69A' target='_blank'>
          Watch Demo
        </Link>
        </button>
      </motion.div>
    </motion.section>
  );
};