'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Link from 'next/link';

interface ResourceItem {
    title: string;
    subtitle?: string;
    date: string;
    content: string;
    tags?: string[];
    link?: string;
}

interface LatestResourcesProps {
    resources: ResourceItem[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function LatestResources({ resources, title = 'Latest Resources', enableOnePageMode = false }: LatestResourcesProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
        >
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#resources" : "/resources"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All &rarr;
                </Link>
            </div>
            <div className="space-y-4">
                {resources.map((resource, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-accent/5 to-transparent rounded-2xl" />
                        </div>

                        <div className="relative bg-white dark:bg-neutral-900/50 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-md hover:shadow-xl hover:border-accent/30 dark:hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.01]">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-primary dark:text-white leading-tight">
                                        {resource.title}
                                    </h3>
                                    {resource.subtitle && (
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                            {resource.subtitle}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
                                    {resource.date}
                                </span>
                            </div>

                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                                {resource.content}
                            </p>

                            <div className="flex items-center justify-between">
                                {resource.tags && resource.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {resource.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block px-2 py-0.5 text-xs bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-accent-light rounded-full border border-accent/30"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {resource.link && (
                                    <a
                                        href={resource.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-accent-dark transition-colors duration-200"
                                        aria-label="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
