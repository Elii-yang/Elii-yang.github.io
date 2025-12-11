import CardPage from '@/components/pages/CardPage';
import TextPage from '@/components/pages/TextPage';
import PublicationsList from '@/components/publications/PublicationsList';
import { parseBibTeX } from '@/lib/bibtexParser';
import { getConfig } from '@/lib/config';
import { getBibtexContent, getMarkdownContent, getPageConfig } from '@/lib/content';
import {
    BasePageConfig,
    CardPageConfig,
    PublicationPageConfig,
    TextPageConfig
} from '@/types/page';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';

export function generateStaticParams() {
    const config = getConfig();
    return config.navigation
        .filter(nav => nav.type === 'page' && nav.target !== 'about') // 'about' is handled by root page
        .map(nav => ({
            slug: nav.target,
        }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        return {};
    }

    return {
        title: pageConfig.title,
        description: pageConfig.description,
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {pageConfig.type === 'publication' && (
                <PublicationPage config={pageConfig as PublicationPageConfig} />
            )}
            {pageConfig.type === 'text' && (
                <TextPageWrapper config={pageConfig as TextPageConfig} />
            )}
            {pageConfig.type === 'card' && (
                <CardPage config={pageConfig as CardPageConfig} />
            )}
        </div>
    );
}

function PublicationPage({ config }: { config: PublicationPageConfig }) {
    const bibtex = getBibtexContent(config.source);
    const publications = parseBibTeX(bibtex);
    return <PublicationsList config={config} publications={publications} />;
}

function TextPageWrapper({ config }: { config: TextPageConfig }) {
    const content = getMarkdownContent(config.source);
    // Try to load Chinese version if exists
    const sourceWithoutExt = config.source.replace(/\.md$/, '');
    const zhSource = `${sourceWithoutExt}_zh.md`;
    let contentZh = '';
    try {
        contentZh = getMarkdownContent(zhSource);
    } catch {
        // If Chinese version doesn't exist, use English version
        contentZh = content;
    }
    return <TextPage config={config} content={content} contentZh={contentZh} />;
}
