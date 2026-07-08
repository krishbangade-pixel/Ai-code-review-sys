import React from 'react';
import { motion } from 'framer-motion';
import { Circle, ArrowRight, Cpu, ShieldAlert, Sparkles, Code2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple cn utility for combining classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#030303]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Elegant Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={300}
          height={70}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={250}
          height={60}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={150}
          height={40}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={100}
          height={30}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={80}
          height={20}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Header Bar */}
      <header className="relative z-20 w-full px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <Cpu size={18} className="animate-pulse" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg">Pulsar<span className="text-indigo-400">AI</span></span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to={user ? "/dashboard" : "/login"}
            className="px-4.5 py-2 text-xs font-bold rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-[#161619]/40 text-[#f3f4f6] transition-all cursor-pointer"
          >
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      </header>

      {/* Main Content Hero */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex-grow flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center py-12">
          
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-rose-500/80" />
            <span className="text-xs text-white/70 font-semibold tracking-wide uppercase">
              Next-Gen Autonomous Reviewer
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Elevate Your Code Quality
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 "
                )}
              >
                With Autonomous AI Audits
              </span>
            </h1>
          </motion.div>

          {/* Paragraph */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm sm:text-base md:text-lg text-white/50 mb-10 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Upload files or paste modules to run real-time static compilation checks, vulnerability tracking, and automated refactoring diffs.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <button
              onClick={() => navigate(user ? "/dashboard" : "/signup")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight size={16} />
            </button>
            
            <button
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#1f1f23] hover:border-indigo-500/30 hover:bg-white/[0.02] text-white font-bold text-sm tracking-wider cursor-pointer transition-all duration-300"
            >
              Access Dashboard
            </button>
          </motion.div>

        </div>
      </div>

      {/* Footer bar */}
      <footer className="relative z-20 w-full px-4 sm:px-6 py-6 text-center text-[10px] text-white/30 border-t border-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 PulsarAI Labs Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white/60 transition-colors">Security Audit</a>
        </div>
      </footer>

      {/* Bottom fade shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
}
