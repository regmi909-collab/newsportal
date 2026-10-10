import React, { useState, useEffect } from 'react';
import { Newspaper, Bell, Radio, Sparkles, Search, Bookmark, RefreshCw } from 'lucide-react';
import { NotificationItem } from '../types/news';

interface HeaderProps {
  onOpenDigest: () => void;
  onOpenScraper: () => void;
  onOpenBookmarks: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: NotificationItem[];
  isScraperSyncing: boolean;
  onTriggerQuickSync: () => void;
  activeView: 'feed' | 'displacement' | 'police' | 'bookmarks';
  onViewChange: (view: 'feed' | 'displacement' | 'police' | 'bookmarks') => void;
  displacedFamiliesTotal: number;
  totalPoliceFIRs: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDigest,
  onOpenScraper,
  onOpenBookmarks,
  searchQuery,
  onSearchChange,
  notifications,
  isScraperSyncing,
  onTriggerQuickSync,
  activeView,
  onViewChange,
  displacedFamiliesTotal,
  totalPoliceFIRs,
}) => {
  const [currentTimeNST, setCurrentTimeNST] = useState<string>('');
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Nepal Standard Time (UTC+5:45)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kathmandu',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTimeNST(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-rose-400 tracking-wider uppercase text-[10px]">
              Civic Watch Nepal
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-300">
              {currentTimeNST ? `${currentTimeNST} (NST)` : 'Kathmandu Time'}
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">
              Active IDP: <strong className="text-stone-200">{displacedFamiliesTotal} Families</strong>
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">
              Police Cases Logged: <strong className="text-stone-200">{totalPoliceFIRs} Reports</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onTriggerQuickSync}
              disabled={isScraperSyncing}
              className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Crawl latest feeds from Nepali portals"
            >
              <RefreshCw className={`w-3 h-3 ${isScraperSyncing ? 'animate-spin text-rose-400' : ''}`} />
              <span>{isScraperSyncing ? 'Scraping Portals...' : 'Sync Live Feeds'}</span>
            </button>
            <span className="text-stone-600">·</span>
            <button
              onClick={onOpenScraper}
              className="inline-flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Scraper Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Journalistic Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1 text-stone-500 text-xs font-medium uppercase tracking-widest">
              <span>National Civic News & Incident Intelligence</span>
              <span>·</span>
              <span>नेपाल नागरिक समाचार अनुगमन</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-editorial tracking-tight text-stone-900 leading-none">
              THE NEPAL MONITOR
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Real-time portal scraper tracking political party movements, Nepal Police blotters & FIRs, and families displaced by political conflicts.
            </p>
          </div>

          {/* Action Center */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Digest CTA */}
            <button
              onClick={onOpenDigest}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Personalized Daily Digest</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenDigest}
              className="relative p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200 cursor-pointer"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                activeView === 'bookmarks'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 border-stone-200'
              }`}
              title="Saved Articles"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
          {/* Main View Tabs (Segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => onViewChange('feed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'feed'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All News Feed
            </button>
            <button
              onClick={() => onViewChange('displacement')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'displacement'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Displaced Families</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-sm font-bold">
                {displacedFamiliesTotal}
              </span>
            </button>
            <button
              onClick={() => onViewChange('police')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'police'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Police Blotters & FIRs</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-sm font-bold">
                {totalPoliceFIRs}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search party, district, FIR, or issue..."
              className="w-full pl-8.5 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
