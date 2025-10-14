import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
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
      maxWidth: "640px",
      padding: "0.75rem 1.5rem",
      marginTop: "0.75rem",
      backgroundColor: "rgba(10, 10, 10, 0.5)",
    },
  };

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
          <div>
            {/* Changed <a> to <Link> and href to to */}
            <Link to="/">
              <img
                src="/logo.png"
                alt="AETOS Logo"
                className="h-6 transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]"
              />
            </Link>
          </div>

          <div className="flex gap-8">
            {/* Changed <a> to <Link> and href to to */}
            <Link
              to="/dashboard"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            {/* Changed <a> to <Link> and href to to */}
            <Link
              to="/pricing"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Plans
            </Link>
            {/* Changed <a> to <Link> and href to to */}
            <Link
              to="/contact"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </motion.nav>
      </div>
    </header>
  );
};

export default Navbar;