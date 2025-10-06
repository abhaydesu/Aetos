'use client';

import React from 'react'
import { stagger, fadeInUp } from './util/constants'
//eslint-disable-next-line
import { motion } from 'framer-motion'
import AnimatedHeading from "../components/ui/AnimationHeading.jsx";
import { MagicButton } from './ui/MagicButton.jsx';

export const Hero = () => {
  return (
            <motion.section
          className="text-center pt-20 pb-24"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
            <AnimatedHeading text="Transform Scattered Data into Strategic Intelligence" />
            {/* <h2 className='text-4xl md:text-7xl font-extrabold tracking-tight '>
                Transform Scattered Data into Strategic Intelligence
            </h2> */}
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
                Get Started
              </MagicButton>
              <button className='mx-5 relative inline-flex h-11 px-8 mt-8
                  items-center justify-center whitespace-nowrap
                  rounded-md text-sm font-medium text-neutral-50
                  ring-offset-neutral-900 transition-colors
                  focus-visible:outline-none
                  overflow-hidden group cursor-pointer bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 '>
                Watch Demo
              </button>
            </motion.div>
          </motion.section>
  )
}
