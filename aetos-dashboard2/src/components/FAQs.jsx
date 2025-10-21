import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
//eslint-disable-next-line
import { motion, AnimatePresence } from "framer-motion";

const faqsData = [
  {
    id: 1,
    question: "What is AETOS and how does it work?",
    answer: "AETOS is an AI-powered technology intelligence platform that automates the collection, analysis, and synthesis of technology data from global patents, research publications, and industry reports. It uses advanced LLMs to provide real-time TRL assessment, relationship mapping, and strategic insights."
  },
  {
    id: 2,
    question: "How does AETOS help DRDO in strategic decision-making?",
    answer: "AETOS accelerates strategic decision-making by providing comprehensive technology forecasting, automated competitive intelligence, and predictive analytics. It eliminates manual delays in technology scouting and offers real-time insights on emerging tech signals and market convergence."
  },
  {
    id: 3,
    question: "What types of data sources does AETOS analyze?",
    answer: "AETOS aggregates and analyzes data from multiple sources including global patent databases, peer-reviewed research publications, industry reports, technology roadmaps, and competitive intelligence feeds to provide a unified view of the technology landscape."
  },
  {
    id: 4,
    question: "Is AETOS suitable for different technology domains?",
    answer: "Yes, AETOS is designed to work across various technology domains. Its AI-powered analysis can adapt to different fields including defense technologies, emerging materials, cybersecurity, aerospace, and other strategic areas relevant to DRDO's mission."
  },
  {
    id: 5,
    question: "How accurate is AETOS's technology forecasting?",
    answer: "AETOS uses advanced machine learning models and S-curve analysis to track technology progression with high accuracy. The platform continuously learns from new data inputs and provides confidence scores for its predictions, ensuring reliable strategic intelligence."
  }
];

function FAQs() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section id="faqs" className="py-24 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h3>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-400">
            Get answers to common questions about AETOS and how it transforms technology intelligence.
          </p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {faqsData.map((faq) => (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden " 
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800/50  transition-colors duration-200"
              >
                <span className="text-md font-medium text-neutral-200">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openFAQ === faq.id ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {openFAQ === faq.id ? (
                    <FiChevronDown className="h-5 w-5 text-sky-400" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-sky-400" />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {openFAQ === faq.id && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 text-neutral-400 text-sm leading-relaxed ">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FAQs;