'use client';

import { motion } from 'framer-motion';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>

            <div className="relative group">
                {/* Background gradient effects */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-2xl" />
                </div>

                <div className="relative bg-white dark:bg-neutral-900/50 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-accent/30 dark:hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.01]">
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <span className="text-xs text-neutral-500 dark:text-accent mt-1 w-16 flex-shrink-0 font-semibold">{item.date}</span>
                                <p className="text-sm text-neutral-700 dark:text-white">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
