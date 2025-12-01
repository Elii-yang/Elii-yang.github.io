'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'Latest News' }: NewsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayItems = isExpanded ? items : items.slice(0, 1);
    const hasMoreNews = items.length > 1;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-2">{title}</h2>

            <div className="relative group">
                {/* Background gradient effects */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-2xl" />
                </div>

                <div className="relative bg-white dark:bg-neutral-900/50 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl px-3 py-2.5 shadow-md hover:shadow-xl hover:border-accent/30 dark:hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.01]">
                    <div className="space-y-1">
                        <AnimatePresence initial={false}>
                            {displayItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-start space-x-3"
                                >
                                    <span className="text-sm text-neutral-500 dark:text-accent mt-0.5 w-16 flex-shrink-0 font-semibold">{item.date}</span>
                                    <p className="text-base text-neutral-700 dark:text-white leading-tight">{item.content}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Expand/Collapse Button */}
                    {hasMoreNews && (
                        <motion.button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-1.5 w-full flex items-center justify-center space-x-1.5 text-xs font-medium text-accent hover:text-accent-dark dark:text-accent-light dark:hover:text-accent transition-colors duration-200 py-0.5 rounded-lg hover:bg-accent/5"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>{isExpanded ? 'Show Less' : `Show More (${items.length - 1})`}</span>
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
