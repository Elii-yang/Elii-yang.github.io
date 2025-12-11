'use client';

import { Publication } from '@/types/publication';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All &rarr;
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="relative group"
                    >
                        {/* Background gradient effects */}
                        <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-accent/5 to-transparent rounded-2xl" />
                        </div>

                        <div className="relative bg-white dark:bg-neutral-900/50 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-md hover:shadow-xl hover:border-accent/30 dark:hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.01]">
                            {pub.doi ? (
                                <a
                                    href={`https://doi.org/${pub.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors duration-200 mb-2 leading-tight block cursor-pointer"
                                >
                                    {pub.title}
                                </a>
                            ) : (
                                <h3 className="font-semibold text-primary dark:text-white mb-2 leading-tight">
                                    {pub.title}
                                </h3>
                            )}
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                                {pub.authors.map((author, idx) => (
                                    <span key={idx}>
                                        <span className={author.name === 'Yitao Yang' || author.isHighlighted ? 'font-bold text-accent' : ''}>
                                            {author.name}
                                        </span>
                                        {author.isCorresponding && (
                                            <sup className={`ml-0 ${author.name === 'Yitao Yang' || author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-300'}`}>†</sup>
                                        )}
                                        {idx < pub.authors.length - 1 && ', '}
                                    </span>
                                ))}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                                {pub.journal || pub.conference}
                            </p>
                            {pub.description && (
                                <p className="text-sm text-neutral-500 dark:text-neutral-300 line-clamp-2">
                                    {pub.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
