import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const allFeatures = [
  "Technology queries (monthly quota)",
  "Research publication access",
  "Global patent database access",
  "Automated data aggregation",
  "AI-powered TRL assessment",
  "S-curve forecasting",
  "Multi-lab coordination",
  "API access & integrations"
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Basic access for research evaluation",
    features: [
      "Technology queries (monthly quota)",
      "Research publication access"
    ],
    cta: "Get Started",
    link: "/dashboard",
    popular: false
  },
  {
    name: "Professional",
    price: "₹99,999",
    period: "/year",
    description: "Full platform access for DRDO labs",
    features: [
      "Technology queries (monthly quota)",
      "Global patent database access",
      "Research publication access",
      "Automated data aggregation",
      "AI-powered TRL assessment",
      "S-curve forecasting"
    ],
    cta: "Start Trial",
    popular: true,
    link: "/dashboard"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Multi-lab deployment with dedicated support",
    features: [
      "Technology queries (monthly quota)",
      "Global patent database access",
      "Research publication access",
      "Automated data aggregation",
      "AI-powered TRL assessment",
      "S-curve forecasting",
      "Multi-lab coordination",
      "API access & integrations"
    ],
    cta: "Contact Sales",
    popular: false,
    link: "/dashboard"
  }
];

function PlansAndPricing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 inter">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-32">
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Plans & Pricing
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-neutral-400 max-w-2xl mx-auto"
          >
            Choose the plan that fits your laboratory's needs and scale as you grow.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeInUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative flex flex-col bg-neutral-900/50 border rounded-xl p-8 shadow-lg ${
                plan.popular ? "border-sky-500 shadow-sky-500/10" : "border-neutral-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-sky-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-neutral-400 text-sm mb-4 h-10">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className="text-neutral-400 ml-2 text-sm">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {allFeatures.map((feature) => {
                  const included = plan.features.includes(feature);
                  return (
                    <li key={feature} className="flex items-start">
                      {included ? <CheckIcon /> : <XIcon />}
                      <span className={`text-sm ${included ? "text-neutral-300" : "text-neutral-600"}`}>
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link
                to={plan.link}
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20 shadow-md"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default PlansAndPricing;
