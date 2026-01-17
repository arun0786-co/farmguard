"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { Sparkles, Leaf, TrendingUp, Brain, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Header */}
        <header className="glass-strong border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setShowChat(false)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text font-display">KrishiMitra</h1>
                <p className="text-xs text-muted-foreground">AI Farming Advisor</p>
              </div>
            </button>
          </div>
        </header>

        {/* Chat Interface */}
        <main className="container mx-auto px-4 py-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-strong rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: "calc(100vh - 140px)" }}
          >
            <ChatWindow />
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text font-display">KrishiMitra</h1>
              <p className="text-xs text-muted-foreground">AI Farming Advisor</p>
            </div>
          </div>
          <button
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Try KrishiMitra
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Logic</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
              Your Intelligent
              <br />
              <span className="gradient-hero">Farming Companion</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Get instant expert advice on crop selection, disease diagnosis, and soil health.
              Powered by AI to help you grow smarter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 group"
              >
                Start Chatting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-full font-semibold text-lg transition-all"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
            Everything You Need to <span className="gradient-text">Grow Better</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive farming solutions powered by intelligent algorithms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="feature-card bg-white rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Plant Diagnosis</h3>
            <p className="text-muted-foreground mb-4">
              Upload a photo and get instant disease identification with treatment recommendations from our database of 8+ common conditions.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Instant disease detection</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Detailed treatment plans</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Prevention tips</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="feature-card bg-white rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Crop Recommendations</h3>
            <p className="text-muted-foreground mb-4">
              Get personalized crop suggestions based on season, soil type, and water availability. Choose from 14+ profitable crops.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Season-based selection</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Market price insights</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Profit margin analysis</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="feature-card bg-white rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Soil Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Upload soil reports and receive detailed NPK analysis with precise fertilizer recommendations and application schedules.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>NPK value analysis</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>pH level recommendations</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Fertilizer schedules</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers using AI-powered insights to increase yields and profits
          </p>
          <button
            onClick={() => setShowChat(true)}
            className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-2 group"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Made with 💚 for farmers • Powered by intelligent mock AI logic
          </p>
          <p className="text-xs mt-2">
            © 2026 KrishiMitra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
