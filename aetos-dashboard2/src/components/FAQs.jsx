import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

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

  return (
    <section id="faqs" className="py-24">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h3>
        <p className="mt-3 max-w-2xl mx-auto text-neutral-400">
          Get answers to common questions about AETOS and how it transforms technology intelligence.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqsData.map((faq) => (
          <div
            key={faq.id}
            className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800/30 transition-colors "
            >
              <span className="text-sm font-semibold text-neutral-300">
                {faq.question}
              </span>
              <div className="transition-transform duration-200" style={{ transform: openFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                {openFAQ === faq.id ? (
                  <FiMinus className="h-5 w-5 text-sky-400" />
                ) : (
                  <FiPlus className="h-5 w-5 text-sky-400" />
                )}
              </div>
            </button>
            
            {openFAQ === faq.id && (
              <div className="px-6 pb-4 text-blue-200 text-sm leading-relaxed transition-all duration-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQs;
