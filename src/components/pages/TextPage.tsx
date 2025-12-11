'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { TextPageConfig } from '@/types/page';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    contentZh?: string; // Chinese version of content
    embedded?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TextPage({ config, content, contentZh, embedded = false }: TextPageProps) {
    const { language } = useLanguage();

    // Use Chinese content if available and language is zh
    const currentContent = (language === 'zh' && contentZh) ? contentZh : content;

    // Translate page title if it's CV
    const pageTitle = config.title === 'CV'
        ? getTranslation(language, 'sections', 'cv')
        : config.title;

    // Check if this is CV page and extract profile section
    const isCVPage = config.title === 'CV';
    let profileSection = '';
    let mainContent = currentContent;

    if (isCVPage) {
        const profileMatch = currentContent.match(/<!-- PROFILE_START -->([\s\S]*?)<!-- PROFILE_END -->/);
        if (profileMatch) {
            profileSection = profileMatch[1].trim();
            mainContent = currentContent.replace(/<!-- PROFILE_START -->[\s\S]*?<!-- PROFILE_END -->\n\n/, '');
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{pageTitle}</h1>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}

            {/* CV Profile Section with Photo */}
            {isCVPage && profileSection && (
                <div className="mb-8 p-6 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Photo - ID card size */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <Image
                                src="/yyt.jpg"
                                alt="Yitao Yang"
                                width={120}
                                height={160}
                                className="rounded-lg object-cover shadow-md"
                                style={{ width: '120px', height: '160px' }}
                            />
                        </div>
                        {/* Profile Info */}
                        <div className="flex-1 text-neutral-700 dark:text-neutral-600">
                            <ReactMarkdown
                                components={{
                                    h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mb-3">{children}</h3>,
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    strong: ({ children }) => <strong className="font-semibold text-primary mr-2">{children}</strong>,
                                }}
                            >
                                {profileSection}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            <div className={`text-neutral-700 dark:text-neutral-600 leading-relaxed ${isCVPage ? 'p-8 bg-[#faf8f3] dark:bg-neutral-800/80 rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-700/50' : ''}`}>
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium hover:underline transition-colors"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {mainContent}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
