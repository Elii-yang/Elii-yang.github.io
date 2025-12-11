"use client";

import { AnimatePresence, motion } from 'framer-motion';
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
  const [mode, setMode] = useState<'normal' | 'particles'>('normal');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0); // Initialize with 0
  const particles = useRef<Particle[]>([]);

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
      const particleCount = 100;
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: window.innerWidth - 100, // Approximate start pos (where rabbit was)
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
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "white";
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
  }, [mode, mousePos]); // dependency on mousePos to ensure access in closure if needed, but ref particles handles state


  return (
    <>
      {/* Particle Canvas Layer */}
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

      {/* Decorations Container */}
      <div className="fixed bottom-0 w-full z-40 hidden lg:flex items-end justify-between px-4 pointer-events-none">

        {/* Jade Rabbit - Click to Disperse - LEFT SIDE */}
        <div className="pointer-events-auto relative w-32 h-32 mb-12 ml-32">
          <AnimatePresence>
            {mode === 'normal' && (
              <motion.div
                className="w-full h-full cursor-pointer mix-blend-screen"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, filter: "blur(20px)" }}
                transition={{ duration: 0.5 }}
                onClick={() => setMode('particles')}
                whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 10px white)" }}
              >
                <Image
                  src="/images/decorations/jade_rabbit.png"
                  alt="Jade Rabbit"
                  fill
                  className="object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Osmanthus Tree - Click to Restore - RIGHT SIDE */}
        <div
          className="pointer-events-auto relative w-64 h-80 -mr-8 translate-y-8 cursor-pointer hover:scale-105 transition-transform duration-500 origin-bottom"
          onClick={() => setMode('normal')}
          title="Click the tree to call the rabbit back"
        >
          <Image
            src="/images/decorations/osmanthus_tree.png"
            alt="Osmanthus Tree"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] mix-blend-screen"
          />
          {/* Falling petals effect could be added here later */}
        </div>
      </div>
    </>
  );
}
