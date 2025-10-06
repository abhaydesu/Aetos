import { useState } from "react";
//eslint-disable-next-line
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const navContainerVariants = {
    full: {
      maxWidth: "1280px",
      padding: "1.5rem 2.5rem",
      marginTop: "1.25rem",
      backgroundColor: "rgba(10, 10, 10, 0.1)",
    },
    docked: {
      // 1. Resized the dock to be wider so it can fit the links
      maxWidth: "640px",
      padding: "0.75rem 1.5rem",
      marginTop: "0.75rem",
      backgroundColor: "rgba(10, 10, 10, 0.5)",
    },
  };

  // 2. The navLinksVariants that hid the links has been completely removed.

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <motion.nav
          className="flex justify-between items-center backdrop-blur-xl rounded-full border border-neutral-800 mx-auto"
          initial="full"
          animate={scrolled ? "docked" : "full"}
          variants={navContainerVariants}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Logo */}
          <div>
            <a href="/">
              <img src="/logo.png" alt="AETOS Logo" className="h-6 transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]" />
            </a>
          </div>

          {/* Nav Links Wrapper - Now a simple div, so links are always visible */}
          <div className="flex gap-8">
                        <a
              href="/dashboard"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/pricing"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Plans
            </a>
            <a
              href="/contact"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </motion.nav>
      </div>
    </header>
  );
};

export default Navbar;