'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
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
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMoreNews = items.length > 1;
    const translatedTitle = getTranslation(language, 'sections', 'news');
    const showMoreText = getTranslation(language, 'common', 'showMore');
    const showLessText = getTranslation(language, 'common', 'showLess');

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-2">{translatedTitle}</h2>

            <div className="relative group">
                {/* Background gradient effects */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-accent/5 to-transparent rounded-2xl" />
                </div>

                <div className="relative bg-white dark:bg-neutral-900/50 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl px-3 py-2.5 shadow-md hover:shadow-xl hover:border-accent/30 dark:hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.01]">
                    <div className="space-y-0"> {/* 移除垂直间距，确保线条连接 */}
                        {/* First Item - Always visible */}
                        {items.length > 0 && (
                            <div className="flex items-stretch min-h-[2.5rem]">
                                {/* Date Column: Right aligned, close to dot */}
                                <div className="w-[4.5rem] flex-shrink-0 flex justify-end pt-1 pr-3">
                                    <span className={`text-sm font-semibold transition-colors duration-300 leading-tight ${isExpanded ? 'text-accent' : 'text-neutral-500 dark:text-accent'}`}>
                                        {items[0].date}
                                    </span>
                                </div>

                                {/* Timeline Column */}
                                <div className="w-5 flex-shrink-0 relative flex flex-col items-center">
                                    {/* Line Logic and Dot for First Item */}
                                    <AnimatePresence>
                                        {isExpanded && hasMoreNews && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 flex flex-col items-center"
                                            >
                                                {/* Top extension (fading in) */}
                                                <div className="absolute top-0 h-2.5 w-0.5 bg-gradient-to-t from-accent/60 to-transparent" />
                                                {/* Main connecting line (downwards) */}
                                                <div className="absolute top-2.5 bottom-0 w-0.5 bg-accent/60" />
                                                {/* Dot - Centered with text */}
                                                <div className="absolute top-2.5 w-2 h-2 rounded-full bg-accent z-10 ring-2 ring-white dark:ring-neutral-900" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 pt-1 pb-3 pl-1">
                                    <p className="text-base text-neutral-700 dark:text-white leading-tight">
                                        {items[0].content}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Collapsible Content for remaining items */}
                        <AnimatePresence>
                            {isExpanded && hasMoreNews && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    {items.slice(1).map((item, index) => {
                                        const isLast = index === items.slice(1).length - 1;
                                        return (
                                            <div key={index} className="flex items-stretch min-h-[2.5rem]">
                                                {/* Date Column */}
                                                <div className="w-[4.5rem] flex-shrink-0 flex justify-end pt-1 pr-3">
                                                    <span className="text-sm text-accent font-semibold transition-colors duration-300 leading-tight">
                                                        {item.date}
                                                    </span>
                                                </div>

                                                {/* Timeline Column */}
                                                <div className="w-5 flex-shrink-0 relative flex flex-col items-center">
                                                    {/* Dot */}
                                                    <div className="absolute top-2.5 w-2 h-2 rounded-full bg-accent z-10 ring-2 ring-white dark:ring-neutral-900" />

                                                    {/* Lines */}
                                                    {isLast ? (
                                                        <>
                                                            {/* Line from top to dot */}
                                                            <div className="absolute top-0 h-2.5 w-0.5 bg-accent/60" />
                                                            {/* Extension fading out downwards */}
                                                            <div className="absolute top-2.5 h-6 w-0.5 bg-gradient-to-b from-accent/60 to-transparent" />
                                                        </>
                                                    ) : (
                                                        // Middle items: Solid line through
                                                        <div className="absolute inset-y-0 w-0.5 bg-accent/60" />
                                                    )}
                                                </div>

                                                {/* Content Column */}
                                                <div className="flex-1 pt-1 pb-3 pl-1">
                                                    <p className="text-base text-neutral-700 dark:text-white leading-tight">
                                                        {item.content}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
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
                            <span>{isExpanded ? showLessText : `${showMoreText} (${items.length - 1})`}</span>
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
