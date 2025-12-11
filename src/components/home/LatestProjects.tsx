'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectItem {
    title: string;
    date: string;
    content: string;
    tags?: string[];
    image?: string;
}

interface LatestProjectsProps {
    projects: ProjectItem[];
    title?: string;
    enableOnePageMode?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LatestProjects({ projects, title: _title = 'Latest Projects', enableOnePageMode = false }: LatestProjectsProps) {
    const { language } = useLanguage();
    const translatedTitle = getTranslation(language, 'sections', 'latestProjects');
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-serif font-bold text-primary">{translatedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#projects" : "/projects"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All &rarr;
                </Link>
            </div>
            <div className="space-y-4">
                {projects.map((project, index) => (
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
                            <div className="flex flex-col sm:flex-row gap-4">
                                {project.image && (
                                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover hover:scale-110 transition-all duration-300"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-semibold text-primary dark:text-white leading-tight">
                                            {project.title}
                                        </h3>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
                                            {project.date}
                                        </span>
                                    </div>

                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2 line-clamp-2">
                                        {project.content.split('\n\n')[0].replace(/\*\*/g, '')}
                                    </p>

                                    {project.tags && project.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block px-2 py-0.5 text-xs bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-accent-light rounded-full border border-accent/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
