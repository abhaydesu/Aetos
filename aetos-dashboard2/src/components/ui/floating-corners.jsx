'use client';

//eslint-disable-next-line
import { motion } from 'framer-motion';
import { Icon } from './Icon';

// Define variants for the corners
const cornerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function FloatingCorners() {
  return (
    <>
      <motion.span
        className="absolute h-6 w-6 -top-3 -left-3 text-sky-800"
        variants={cornerVariants} // Use variants
      >
        <Icon className="h-6 w-6" />
      </motion.span>
      <motion.span
        className="absolute h-6 w-6 -bottom-3 -left-3 text-sky-800"
        variants={cornerVariants} // Use variants
      >
        <Icon className="h-6 w-6" />
      </motion.span>
      <motion.span
        className="absolute h-6 w-6 -top-3 -right-3 text-sky-800"
        variants={cornerVariants} // Use variants
      >
        <Icon className="h-6 w-6" />
      </motion.span>
      <motion.span
        className="absolute h-6 w-6 -bottom-3 -right-3 text-sky-800"
        variants={cornerVariants} // Use variants
      >
        <Icon className="h-6 w-6" />
      </motion.span>
    </>
  );
}