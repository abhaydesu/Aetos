import React from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";

/**
 * A beautiful, animated button with a shiny hover effect.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the button.
 * @param {string} [props.className] - Additional classes to apply to the button.
 * @returns {JSX.Element} The MagicButton component.
 */
export const MagicButton = ({ children, className, ...props }) => {
  return (
    <motion.button
      // Base styles for the button container
      className={`relative inline-flex h-12 items-center justify-center
                   overflow-hidden rounded-lg bg-gradient-to-br from-sky-900 via-sky-700 to-sky-900
                   px-8 mt-8 font-medium text-neutral-50 group
                           shadow-[inset_0_1px_2px_rgba(125,211,252,0.5),_0_0px_0px_rgba(3,105,161,0.6)]
hover:shadow-[inset_0_1px_2px_rgba(125,211,252,0.7),_0_1px_2px_rgba(3,105,161,0.8)]
cursor-pointer
                   ${className}`}
      // Animation for the tap/click interaction
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      <span className="absolute inset-0 h-full w-full rounded-lg" />

      {/* The shiny gleam effect */}
      <span
        className="absolute bottom-0 left-0 top-0 z-10 h-full w-1/4
                   bg-gradient-to-r from-transparent via-white/20 to-transparent
                   transform -translate-x-full transition-transform duration-700
                   ease-in-out group-hover:translate-x-[400%]"
      />

      {/* The actual button content (text, icons, etc.) */}
      <span className="relative z-20">{children}</span>
    </motion.button>
  );
};
