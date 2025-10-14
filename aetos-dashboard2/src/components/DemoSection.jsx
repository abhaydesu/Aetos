import React from 'react'
//eslint-disable-next-line
import { motion } from 'framer-motion'

export const DemoSection = () => {
  return (
    // --- Glassmorphism Style Changes ---
    // - Removed the opaque gradient and complex shadows.
    // + Added a semi-transparent background, backdrop blur, a subtle border, and cleaner shadows.
    <div className='my-24 p-8 rounded-2xl
        backdrop-blur-sm
        border border-neutral-700/80
        shadow-xl transition-all duration-300 hover:shadow-2xl bg-grid-neutral-900/40 hover:border-neutral-600 '>
        
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            className="text-3xl md:text-5xl font-extrabold text-neutral-100 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            See AETOS in Action
          </motion.h3>
          <motion.div
            className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/lJUfEGNZ69A" 
              title="AETOS Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-4xl"
            ></iframe>
          </motion.div>
          <motion.p
            className="mt-8 text-lg text-neutral-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Get a comprehensive overview of AETOS's capabilities and workflow.
          </motion.p>
        </div>
    </div>
  )
}