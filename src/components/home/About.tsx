'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title = 'About' }: AboutProps) {
    const { language } = useLanguage();
    const translatedTitle = getTranslation(language, 'sections', 'about');
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-2">{translatedTitle}</h2>

            <div className="relative group">
                {/* Background gradient effects */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-accent/5 to-transparent rounded-2xl" />
                </div>

                <div className="relative bg-white dark:bg-neutral-900/50 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-accent/30 dark:hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.01]">
                    <div className="text-neutral-700 dark:text-white leading-relaxed">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary dark:text-white mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-semibold text-primary dark:text-white mt-6 mb-3">{children}</h3>,
                                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                a: ({ ...props }) => (
                                    <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent dark:text-accent-light font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                                    />
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-300">
                                        {children}
                                    </blockquote>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-primary dark:text-accent">{children}</strong>,
                                em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-300">{children}</em>,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
