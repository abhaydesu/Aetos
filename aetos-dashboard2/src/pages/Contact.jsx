import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import FloatingCorners from '../components/ui/floating-corners';
import { MagicButton } from '../components/ui/MagicButton';

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 inter relative overflow-x-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0 w-full "
        style={{
          maskImage:
            "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

    <Navbar /> 
     <div className="relative z-10">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
          <motion.h2
            className="text-center text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Contact Us
          </motion.h2>

          <motion.p
            className="text-center text-neutral-400 max-w-2xl mx-auto mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Have a question, partnership inquiry, or feedback? We’d love to hear
            from you. Fill out the form below and we’ll get back to you soon.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            variants={fadeInUp} 
            className="relative bg-neutral-950 bg-grid-neutral-900/40 border border-neutral-800 shadow-xl p-8" 
          >
            <FloatingCorners />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Anon Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:border-sky-800 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="anon@works.com"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:border-sky-800 outline-none transition"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Send us a message..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:border-sky-800  outline-none transition resize-none"
              />
            </div>

            <div className="mt-8 text-center">
                <MagicButton type="submit">
                {submitted ? "Message Sent!" : "Send Message"}
                </MagicButton>
            </div>
          </motion.form>
        </main>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}
