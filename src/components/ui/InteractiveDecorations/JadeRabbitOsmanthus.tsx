"use client";

import { resolveTheme, useThemeStore } from '@/lib/stores/themeStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetX?: number;
  targetY?: number;
}

export default function JadeRabbitOsmanthus() {
  const { theme } = useThemeStore();
  const [isDark, setIsDark] = useState(false);
  const isDarkRef = useRef(false); // Ref to access state inside animation loop
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'normal' | 'particles'>('normal');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  // Fix hydration mismatch and handle theme resolution
  useEffect(() => {
    setMounted(true);

    // Initial check
    const updateTheme = () => {
      const dark = resolveTheme(theme) === 'dark';
      setIsDark(dark);
      isDarkRef.current = dark; // Update ref
    };
    updateTheme();

    // Listen for system changes if needed
    let media: MediaQueryList | null = null;
    const listener = () => updateTheme();

    if (theme === 'system' && typeof window !== 'undefined') {
      media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', listener);
    }

    return () => {
      if (media) media.removeEventListener('change', listener);
    };
  }, [theme]);

  // Track scroll position to show indicator when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize particles when switching to particle mode
  useEffect(() => {
    if (mode === 'particles') {
      const particleCount = 30;
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: window.innerWidth - 100,
          y: window.innerHeight - 100,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          size: Math.random() * 3 + 1,
          alpha: Math.random(),
        });
      }
      particles.current = newParticles;
    }
  }, [mode]);

  // Animation Loop
  const animate = () => {
    if (mode !== 'particles' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDarkMode = isDarkRef.current; // Read from ref

    particles.current.forEach(p => {
      // Move towards mouse with some ease/swarming
      const dx = mousePos.x - p.x;
      const dy = mousePos.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Attraction force
      if (dist > 10) {
        p.vx += dx * 0.001;
        p.vy += dy * 0.001;
      }

      // Drag/Friction to stop oscillation
      p.vx *= 0.95;
      p.vy *= 0.95;

      // Random jitter
      p.vx += (Math.random() - 0.5) * 0.5;
      p.vy += (Math.random() - 0.5) * 0.5;

      p.x += p.vx;
      p.y += p.vy;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      // Dynamic Color based on Theme
      // Dark mode: White glow
      // Light mode: Golden Osmanthus glow (Orange/Gold)
      if (isDarkMode) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowColor = "white";
      } else {
        // Pale Gold for light mode
        ctx.fillStyle = `rgba(255, 225, 120, ${p.alpha})`;
        ctx.shadowColor = "rgba(255, 200, 50, 0.6)";
      }

      ctx.shadowBlur = 10;
      ctx.fill();
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (mode === 'particles') {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [mode, mousePos]);

  const handleTreeClick = () => {
    setMode('normal');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!mounted) return null;

  return (
    <>
      {/* Particle Canvas Layer - Remains Fixed to cover screen */}
      <AnimatePresence>
        {mode === 'particles' && (
          <motion.canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Decorations Container - Only show on xl and above */}
      <div className="absolute bottom-full left-0 w-full h-0 z-10 hidden xl:flex items-end justify-between px-4 pointer-events-none">

        {/* Jade Rabbit - Responsive sizing */}
        <div className="pointer-events-auto relative mb-0 w-32 h-32 2xl:w-40 2xl:h-40 ml-24 2xl:ml-32 max-w-[8vw] max-h-[8vw]">
          <AnimatePresence>
            {mode === 'normal' && (
              <motion.div
                className="w-full h-full cursor-pointer mix-blend-screen opacity-60 hover:opacity-100"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 0.6, x: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                exit={{ opacity: 0, scale: 0, filter: "blur(20px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onClick={() => setMode('particles')}
                whileHover={{ scale: 1.1, opacity: 1, filter: "drop-shadow(0 0 15px rgba(255, 223, 128, 0.8))" }}
              >
                <Image
                  src={isDark ? "/images/decorations/jade_rabbit2.png" : "/images/decorations/jade_rabbit.png"}
                  alt="Jade Rabbit"
                  fill
                  className="object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Osmanthus Tree - Responsive sizing */}
        <div className="flex items-end relative">
          <div
            className="pointer-events-auto relative translate-y-10 cursor-pointer origin-bottom w-64 h-80 2xl:w-80 2xl:h-96 mr-20 2xl:mr-24 max-w-[12vw] max-h-[15vw]"
            onClick={handleTreeClick}
            title="Click to scroll to top"
          >
            <motion.div
              className="w-full h-full opacity-60 hover:opacity-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              whileHover={{ scale: 1.05, opacity: 1, filter: "drop-shadow(0 0 15px rgba(255, 223, 128, 0.8))" }}
            >
              <Image
                src="/images/decorations/osmanthus_tree.png"
                alt="Osmanthus Tree"
                fill
                className="object-contain mix-blend-screen"
              />
            </motion.div>
          </div>

          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="absolute right-0 bottom-4 mr-6 text-accent/70 dark:text-accent/50 animate-bounce pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="72"
                  viewBox="0 0 24 48"
                  fill="currentColor"
                >
                  <rect x="11" y="12" width="2" height="32" rx="1" />
                  <path d="M12 8 L8 14 L16 14 Z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Standard Back to Top Button - Visible on screens below xl */}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={handleTreeClick}
            className="xl:hidden fixed bottom-8 right-8 z-50 p-3 rounded-full bg-accent hover:bg-accent-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Back to top"
          >
            <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
