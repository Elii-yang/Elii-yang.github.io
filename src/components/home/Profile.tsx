'use client';

import { SiteConfig } from '@/lib/config';
import {
    AcademicCapIcon,
    EnvelopeIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { EnvelopeIcon as EnvelopeSolidIcon, MapPinIcon as MapPinSolidIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Github, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
}

export default function Profile({ author, social, features, researchInterests }: ProfileProps) {
    const [viewCount, setViewCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [isAddressPinned, setIsAddressPinned] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [isEmailPinned, setIsEmailPinned] = useState(false);
    const [lastClickedTooltip, setLastClickedTooltip] = useState<'email' | 'address' | 'donate' | null>(null);
    const [emailCopied, setEmailCopied] = useState(false);
    const [showDonate, setShowDonate] = useState(false);
    const [hasWechatPay, setHasWechatPay] = useState(false);
    const [hasAlipay, setHasAlipay] = useState(false);
    const [qrImageSizes, setQrImageSizes] = useState<{ wechat?: { width: number; height: number }; alipay?: { width: number; height: number } }>({});

    // Check for payment QR codes and get image sizes
    useEffect(() => {
        const checkAndLoadImage = (url: string, type: 'wechat' | 'alipay') => {
            const img = document.createElement('img');
            img.onload = () => {
                if (type === 'wechat') {
                    setHasWechatPay(true);
                    setQrImageSizes(prev => ({ ...prev, wechat: { width: img.naturalWidth, height: img.naturalHeight } }));
                } else {
                    setHasAlipay(true);
                    setQrImageSizes(prev => ({ ...prev, alipay: { width: img.naturalWidth, height: img.naturalHeight } }));
                }
            };
            img.onerror = () => {
                if (type === 'wechat') setHasWechatPay(false);
                else setHasAlipay(false);
            };
            img.src = url;
        };

        checkAndLoadImage('/wechat-pay.jpg', 'wechat');
        checkAndLoadImage('/alipay.jpg', 'alipay');
    }, []);

    // Close donate modal on scroll or click outside
    useEffect(() => {
        const handleScroll = () => {
            if (showDonate) {
                setShowDonate(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showDonate && !target.closest('.donate-modal-container')) {
                setShowDonate(false);
            }
        };

        if (showDonate) {
            window.addEventListener('scroll', handleScroll, true);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDonate]);

    // Track page views with GitHub Gist
    useEffect(() => {
        if (!features.enable_likes) return;

        const GIST_ID = process.env.NEXT_PUBLIC_GIST_ID;
        const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

        // Check if this is a new session
        const sessionViewed = sessionStorage.getItem('website-session-viewed');
        const sessionLiked = sessionStorage.getItem('website-session-liked');
        setHasLiked(sessionLiked === 'true');

        // Fetch current counts from GitHub Gist
        const fetchCounts = async () => {
            if (!GIST_ID || !GITHUB_TOKEN) {
                // Fallback to localStorage if no Gist configured
                const storedCount = localStorage.getItem('website-view-count');
                const storedLikeCount = localStorage.getItem('website-like-count');
                setViewCount(storedCount ? parseInt(storedCount, 10) : 0);
                setLikeCount(storedLikeCount ? parseInt(storedLikeCount, 10) : 0);
                return;
            }

            try {
                const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github+json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const statsFile = data.files['website-stats.json'];
                    if (statsFile && statsFile.content) {
                        const stats = JSON.parse(statsFile.content);

                        // Increment view count for new sessions
                        if (!sessionViewed) {
                            const newVisits = stats.visits + 1;
                            setViewCount(newVisits);
                            setLikeCount(stats.likes || 0);
                            await updateGistCount('visits', newVisits, stats.likes);
                            sessionStorage.setItem('website-session-viewed', 'true');
                        } else {
                            setViewCount(stats.visits || 0);
                            setLikeCount(stats.likes || 0);
                        }
                    }
                } else {
                    // Fallback to localStorage on error
                    const storedCount = localStorage.getItem('website-view-count');
                    const storedLikeCount = localStorage.getItem('website-like-count');
                    setViewCount(storedCount ? parseInt(storedCount, 10) : 0);
                    setLikeCount(storedLikeCount ? parseInt(storedLikeCount, 10) : 0);
                }
            } catch {
                // Fallback to localStorage on error
                const storedCount = localStorage.getItem('website-view-count');
                const storedLikeCount = localStorage.getItem('website-like-count');
                setViewCount(storedCount ? parseInt(storedCount, 10) : 0);
                setLikeCount(storedLikeCount ? parseInt(storedLikeCount, 10) : 0);
            }
        };

        fetchCounts();
    }, [features.enable_likes]);

    // Helper function to update Gist
    const updateGistCount = async (type: 'visits' | 'likes', visits: number, likes: number) => {
        const GIST_ID = process.env.NEXT_PUBLIC_GIST_ID;
        const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

        if (!GIST_ID || !GITHUB_TOKEN) {
            // Fallback to localStorage
            if (type === 'visits') {
                localStorage.setItem('website-view-count', visits.toString());
            } else {
                localStorage.setItem('website-like-count', likes.toString());
            }
            return;
        }

        try {
            await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        'website-stats.json': {
                            content: JSON.stringify({ visits, likes }, null, 2)
                        }
                    }
                })
            });
        } catch {
            // Fallback to localStorage
            if (type === 'visits') {
                localStorage.setItem('website-view-count', visits.toString());
            } else {
                localStorage.setItem('website-like-count', likes.toString());
            }
        }
    };

    const handleLike = async () => {
        if (hasLiked) {
            // Unlike - decrement via Gist
            const newLikeCount = Math.max(0, likeCount - 1);
            setLikeCount(newLikeCount);
            setHasLiked(false);
            sessionStorage.removeItem('website-session-liked');
            await updateGistCount('likes', viewCount, newLikeCount);
        } else {
            // Like - increment via Gist
            const newLikeCount = likeCount + 1;
            setLikeCount(newLikeCount);
            setHasLiked(true);
            sessionStorage.setItem('website-session-liked', 'true');
            await updateGistCount('likes', viewCount, newLikeCount);
        }
    };

    const handleCopyEmail = async () => {
        if (social.email) {
            try {
                await navigator.clipboard.writeText(social.email);
                setEmailCopied(true);
                setTimeout(() => setEmailCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy email:', err);
            }
        }
    };

    const socialLinks = [
        ...(social.email ? [{
            name: 'Email',
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: 'Location',
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-8"
        >
            {/* Profile Image */}
            <Link href="/cv" className="block relative w-64 h-64 mx-auto mb-6 group cursor-pointer">
                {/* Decorative border layers */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/10 to-transparent group-hover:from-accent/50 group-hover:via-accent/20 transition-all duration-500 blur-xl group-hover:blur-2xl"></div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-accent/20 to-accent/30 group-hover:via-accent/30 group-hover:to-accent/50 transition-all duration-500 blur-xl group-hover:blur-2xl"></div>

                {/* Main image container */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 border-4 border-white dark:border-neutral-800 group-hover:border-accent/30 dark:group-hover:border-accent/30">
                    <Image
                        src={author.avatar}
                        alt={author.name}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover object-[32%_center] transition-transform duration-500 group-hover:scale-110"
                        priority
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-12 group-hover:h-12"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-12 group-hover:h-12"></div>
            </Link>

            {/* Name and Title */}
            <div className="text-center mb-6">
                <Link href="/cv" className="inline-block group">
                    <h1 className="text-3xl font-serif font-bold text-primary mb-2 hover:text-accent transition-colors duration-300 cursor-pointer">
                        {author.name}
                    </h1>
                </Link>
                {author.english_name && (
                    <p className="text-base text-neutral-500 dark:text-neutral-400 mb-2 italic">
                        (English name: {author.english_name})
                    </p>
                )}
                <p className="text-lg text-accent font-medium mb-1">
                    {author.title}
                </p>
                <p className="text-neutral-600 mb-2">
                    {author.institution}
                </p>
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 relative px-2">
                {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    if (link.isLocation) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isAddressPinned) setShowAddress(true);
                                        setLastClickedTooltip('address');
                                    }}
                                    onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                    onClick={() => {
                                        setIsAddressPinned(!isAddressPinned);
                                        setShowAddress(!isAddressPinned);
                                        setLastClickedTooltip('address');
                                    }}
                                    className={`p-2 sm:p-2 transition-colors duration-200 ${isAddressPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isAddressPinned ? (
                                        <MapPinSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <MapPinIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Address tooltip */}
                                <AnimatePresence>
                                    {(showAddress || isAddressPinned) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'address' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isAddressPinned) setShowAddress(true);
                                                setLastClickedTooltip('address');
                                            }}
                                            onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-between space-x-3 mb-1">
                                                    <p className="font-semibold">Work Address</p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsAddressPinned(!isAddressPinned);
                                                            setShowAddress(!isAddressPinned);
                                                        }}
                                                        className="flex items-center space-x-1 text-xs px-2 py-0.5 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors"
                                                    >
                                                        <Pin className={`h-3 w-3 dark:text-neutral-300 ${isAddressPinned ? 'rotate-45' : ''} transition-transform`} />
                                                        <span className="dark:text-neutral-300">{isAddressPinned ? 'Unpin' : 'Pin'}</span>
                                                    </button>
                                                </div>
                                                {social.location_details?.map((line, i) => (
                                                    <p key={i} className="break-words">{line}</p>
                                                ))}
                                                <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                                                    {social.location_url && (
                                                        <a
                                                            href={social.location_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                        >
                                                            <MapPinIcon className="h-4 w-4" />
                                                            <span>Google Map</span>
                                                        </a>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    if (link.isEmail) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isEmailPinned) setShowEmail(true);
                                        setLastClickedTooltip('email');
                                    }}
                                    onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                    onClick={() => {
                                        setIsEmailPinned(!isEmailPinned);
                                        setShowEmail(!isEmailPinned);
                                        setLastClickedTooltip('email');
                                    }}
                                    className={`p-2 sm:p-2 transition-colors duration-200 ${isEmailPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isEmailPinned ? (
                                        <EnvelopeSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <EnvelopeIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Email tooltip */}
                                <AnimatePresence>
                                    {(showEmail || isEmailPinned) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'email' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isEmailPinned) setShowEmail(true);
                                                setLastClickedTooltip('email');
                                            }}
                                            onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-between space-x-3 mb-1">
                                                    <p className="font-semibold">Email</p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsEmailPinned(!isEmailPinned);
                                                            setShowEmail(!isEmailPinned);
                                                        }}
                                                        className="flex items-center space-x-1 text-xs px-2 py-0.5 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors"
                                                    >
                                                        <Pin className={`h-3 w-3 dark:text-neutral-300 ${isEmailPinned ? 'rotate-45' : ''} transition-transform`} />
                                                        <span className="dark:text-neutral-300">{isEmailPinned ? 'Unpin' : 'Pin'}</span>
                                                    </button>
                                                </div>
                                                <p className="break-words">{social.email?.replace('@', ' (at) ')}</p>
                                                <div className="mt-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopyEmail();
                                                        }}
                                                        className={`inline-flex items-center justify-center space-x-2 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 w-full sm:w-auto ${emailCopied
                                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                                            : 'bg-accent hover:bg-accent-dark text-white'
                                                            }`}
                                                    >
                                                        {emailCopied ? (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                                <span>Copied!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                                                </svg>
                                                                <span className="sm:hidden">Copy</span>
                                                                <span className="hidden sm:inline">Copy Email</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>

            {/* Research Interests */}
            {researchInterests && researchInterests.length > 0 && (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <h3 className="font-semibold text-primary mb-3">Research Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {researchInterests.map((interest, index) => (
                            <span
                                key={index}
                                className="inline-block px-3 py-1.5 text-sm bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-accent-light rounded-full border border-accent/30 hover:bg-accent/20 hover:scale-105 transition-all duration-200 cursor-default"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Donate Button - Only show if payment methods available */}
            {features.enable_likes && (hasWechatPay || hasAlipay) && (
                <div className="flex justify-center mb-4">
                    <div className="relative donate-modal-container">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setShowDonate(!showDonate)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-all duration-300 cursor-pointer"
                            aria-label="Buy me a coffee"
                        >
                            <Coffee className="h-4 w-4" />
                            <span>Coffee</span>
                        </motion.button>

                        {/* Donate QR Code Modal */}
                        <AnimatePresence>
                            {showDonate && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-3 border-2 border-amber-200 dark:border-amber-700 z-50"
                                    style={{ minWidth: hasWechatPay && hasAlipay ? '400px' : '250px' }}
                                >
                                    <div className="text-center mb-2">
                                        <h3 className="text-base font-bold text-primary dark:text-white mb-0.5">Buy Me a Coffee</h3>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Thank you for your support!</p>
                                    </div>

                                    <div className={`grid ${hasWechatPay && hasAlipay ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                                        {/* WeChat Pay */}
                                        {hasWechatPay && qrImageSizes.wechat && (
                                            <div className="text-center">
                                                <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1 mb-2">
                                                    <div className="bg-white rounded flex items-center justify-center mx-auto" style={{ width: 'auto', maxWidth: '200px' }}>
                                                        <Image
                                                            src="/wechat-pay.jpg"
                                                            alt="WeChat Pay"
                                                            width={qrImageSizes.wechat.width}
                                                            height={qrImageSizes.wechat.height}
                                                            className="rounded w-full h-auto"
                                                            style={{ maxWidth: '200px', height: 'auto' }}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs font-medium text-green-600 dark:text-green-400">WeChat</p>
                                            </div>
                                        )}

                                        {/* Alipay */}
                                        {hasAlipay && qrImageSizes.alipay && (
                                            <div className="text-center">
                                                <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1 mb-2">
                                                    <div className="bg-white rounded flex items-center justify-center mx-auto" style={{ width: 'auto', maxWidth: '200px' }}>
                                                        <Image
                                                            src="/alipay.jpg"
                                                            alt="Alipay"
                                                            width={qrImageSizes.alipay.width}
                                                            height={qrImageSizes.alipay.height}
                                                            className="rounded w-full h-auto"
                                                            style={{ maxWidth: '200px', height: 'auto' }}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Alipay</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* View Counter and Like Button */}
            {features.enable_likes && (
                <div className="flex justify-center gap-3">
                    {/* View Counter */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-300 cursor-default"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span>{viewCount.toLocaleString()} {viewCount === 1 ? 'Visit' : 'Visits'}</span>
                    </motion.div>

                    {/* Like Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        onClick={handleLike}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer ${hasLiked
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400'
                            }`}
                        aria-label={hasLiked ? "Unlike this website" : "Like this website"}
                    >
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            fill={hasLiked ? 'currentColor' : 'none'}
                            className="h-4 w-4"
                            key={hasLiked ? 'liked' : 'unliked'}
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.3 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </motion.svg>
                        <span>{likeCount.toLocaleString()} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
}
