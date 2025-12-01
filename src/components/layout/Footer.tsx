'use client';

import { Pin } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTooltipPinned, setIsTooltipPinned] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    if (!isTooltipPinned) setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    if (!isTooltipPinned) {
      const timeout = setTimeout(() => {
        setShowTooltip(false);
      }, 100); // 延迟100ms关闭
      setHideTimeout(timeout);
    }
  };

  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="relative">
            <p
              className="text-xs text-neutral-500 cursor-help font-bold"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setIsTooltipPinned(!isTooltipPinned);
                setShowTooltip(!isTooltipPinned);
              }}
            >
              © {new Date().getFullYear()} Yitao Yang. All Rights Reserved.
            </p>

            {(showTooltip || isTooltipPinned) && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-neutral-800 text-white text-xs rounded-lg shadow-xl p-5 z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-600 pb-2">
                    <p className="font-bold text-sm text-center flex-1">COPYRIGHT AND LEGAL NOTICE</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTooltipPinned(!isTooltipPinned);
                        setShowTooltip(!isTooltipPinned);
                      }}
                      className="flex items-center space-x-1 text-xs px-2 py-0.5 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors ml-2"
                    >
                      <Pin className={`h-3 w-3 dark:text-neutral-300 ${isTooltipPinned ? 'rotate-45' : ''} transition-transform`} />
                      <span className="dark:text-neutral-300">{isTooltipPinned ? 'Unpin' : 'Pin'}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <p className="leading-relaxed hover:bg-neutral-700/50 rounded px-2 py-1 transition-colors duration-200 cursor-default">
                      <span className="font-semibold">1. Intellectual Property Rights:</span> All content, including but not limited to text, images, documents, code, and multimedia materials published on this website, are the exclusive intellectual property of Yitao Yang and are protected under applicable international copyright laws and treaties.
                    </p>

                    <p className="leading-relaxed hover:bg-neutral-700/50 rounded px-2 py-1 transition-colors duration-200 cursor-default">
                      <span className="font-semibold">2. Prohibited Uses:</span> Any unauthorized reproduction, modification, distribution, transmission, republication, display, or commercial exploitation of the content herein is strictly prohibited without prior written consent from the copyright holder.
                    </p>

                    <p className="leading-relaxed hover:bg-neutral-700/50 rounded px-2 py-1 transition-colors duration-200 cursor-default">
                      <span className="font-semibold">3. Permitted Use:</span> Content may be accessed and downloaded solely for personal, non-commercial, educational purposes. Proper attribution must be provided when referencing any materials from this website.
                    </p>

                    <p className="leading-relaxed hover:bg-neutral-700/50 rounded px-2 py-1 transition-colors duration-200 cursor-default">
                      <span className="font-semibold">4. Disclaimer:</span> While reasonable efforts have been made to ensure accuracy, the information is provided &quot;as is&quot; without warranties of any kind. The author assumes no liability for errors, omissions, or damages arising from the use of this content.
                    </p>

                    <p className="leading-relaxed hover:bg-neutral-700/50 rounded px-2 py-1 transition-colors duration-200 cursor-default">
                      <span className="font-semibold">5. Third-Party Links:</span> This website may contain links to external websites or resources. Yitao Yang is not responsible for the content, accuracy, or availability of such third-party sites and does not endorse or assume liability for any materials or services provided by them.
                    </p>

                    <p className="leading-relaxed hover:bg-neutral-700/50 rounded px-2 py-1 transition-colors duration-200 cursor-default">
                      <span className="font-semibold">6. Modifications to Content:</span> Yitao Yang reserves the right to modify, update, remove, or discontinue any content on this website at any time without prior notice. Continued use of the website constitutes acceptance of such changes.
                    </p>

                    <p className="font-bold text-center pt-2 border-t border-neutral-600 hover:bg-neutral-700/50 rounded px-2 py-1 transition-colors duration-200 cursor-default">
                      Yitao Yang reserves all rights and final interpretation of this notice.
                    </p>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
              </div>
            )}
          </div>

          <p className="text-xs text-neutral-500 flex items-center">
            <a href="https://github.com/xyjoey/PRISM" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Built with PRISM
            </a>
            <span className="ml-2">🚀</span>
          </p>
        </div>
      </div>
    </footer>
  );
}