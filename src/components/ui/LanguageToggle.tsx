'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] bg-background dark:bg-neutral-800">
        <div className="w-4 h-4 rounded-full bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-lg',
        'border border-neutral-200 bg-background hover:bg-neutral-50',
        'dark:border-[rgba(148,163,184,0.24)] dark:bg-neutral-800 dark:hover:bg-neutral-700',
        'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        'text-neutral-600 hover:text-primary dark:text-neutral-400 dark:hover:text-white'
      )}
      title={`Current language: ${language === 'en' ? 'English' : '中文'}. Click to toggle.`}
    >
      <motion.div
        key={language}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-xs font-semibold"
      >
        {language === 'en' ? 'EN' : '中'}
      </motion.div>
    </motion.button>
  );
}
