import { useState } from "react";
import { Link } from "react-router-dom";
//eslint-disable-next-line
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu icons

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
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

  const navLinks = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Plans", href: "/pricing" },
    { title: "Contact", href: "/contact" },
  ];

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
          <Link to="/">
            <img
              src="/logo.png"
              alt="AETOS Logo"
              className="h-6 transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Hamburger Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-300 hover:text-white transition-colors p-2 rounded-full"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="sm:hidden absolute top-[140px] left-4 right-4 bg-neutral-950/65 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-lg"
            >
              <ul className="flex flex-col items-center gap-2 p-4">
                {navLinks.map((link) => (
                  <li key={link.href} className="w-full">
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)} 
                      className="block w-full text-center p-3 text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;