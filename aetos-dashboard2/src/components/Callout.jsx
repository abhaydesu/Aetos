"use client"

import React from 'react'
//eslint-disable-next-line
import { motion } from 'framer-motion' 
import { Link } from "react-router-dom"; 
import { AnimatedGradientCard } from './ui/AnimatedGradientCard';
import { MagicButton } from './ui/MagicButton';

import { fadeInUp } from './util/constants';

export const Callout = () => {
  return (
    <motion.section 
      className="py-24 text-center" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.2 }}
    >
      <AnimatedGradientCard className="p-12" > {/* Use the new card component */}
        <motion.h3 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4" variants={fadeInUp}>
          Ready to Transform Your Technology Intelligence?
        </motion.h3>
        <motion.p className="text-md text-neutral-400 max-w-2xl mx-auto mb-8" variants={fadeInUp}>
          Join DRDO in leveraging AI-powered insights for strategic decision-making. Start your journey with AETOS today and stay ahead of technological trends.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link to="/dashboard">
            <MagicButton> 
              Get Started
            </MagicButton>
          </Link>
        </motion.div>
      </AnimatedGradientCard>
    </motion.section>
  )
}