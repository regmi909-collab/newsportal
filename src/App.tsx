/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  NewsArticle,
  ScraperSource,
  ScraperLog,
  UserDigestPreferences,
  GeneratedDigest,
  NotificationItem,
  NewsCategory,
  NepalProvince,
  PoliticalParty,
} from './types/news';
import { INITIAL_NEWS_ARTICLES, INITIAL_SCRAPER_SOURCES } from './data/initialNews';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { FilterBar } from './components/FilterBar';
import { ArticleCard } from './components/ArticleCard';
import { ReaderModal } from './components/ReaderModal';
import { DailyDigestModal } from './components/DailyDigestModal';
import { ScraperDashboardModal } from './components/ScraperDashboardModal';
import { DisplacementTrackerView } from './components/DisplacementTrackerView';
import { PoliceBlotterView } from './components/PoliceBlotterView';
import { generatePersonalizedDigest, createBreakingNotification } from './services/digestEngine';
import { requestEnhancedDigest } from './services/apiClient';
import { Bookmark, Sparkles, Radio, Shield, Users, ArrowUp, RefreshCw } from 'lucide-react';

const DEFAULT_PREFERENCES: UserDigestPreferences = {
  enabled: true,
  frequency: 'morning',
  preferredParties: ['Nepali Congress', 'CPN-UML', 'CPN (Maoist Centre)', 'Rastriya Swatantra Party (RSP)'],
  includePoliceReports: true,
  includeDisplacementAlerts: true,
  preferredProvinces: ['Bagmati', 'Madhesh', 'Gandaki', 'Koshi', 'Lumbini', 'Karnali', 'Sudurpashchim'],
  minimumSeverity: 'medium',
  browserNotifications: true,
};

export default function App() {
  // Articles state
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('nepal_news_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved articles from storage:', e);
    }
    return INITIAL_NEWS_ARTICLES;
  });

  // Scraper state
  const [sources, setSources] = useState<ScraperSource[]>(INITIAL_SCRAPER_SOURCES);
  const [isScraperSyncing, setIsScraperSyncing] = useState<boolean>(false);
  const [scraperLogs, setScraperLogs] = useState<ScraperLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      sourceName: 'The Kathmandu Post',
      status: 'success',
      message: 'Parsed 48 items from /national RSS feed. 3 political movements classified.',
      articlesParsed: 48,
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      sourceName: 'Nepal Police News Blotter',
      status: 'success',
      message: 'Scraped DPO press room. Logged 2 FIRs in Sarlahi and Parsa.',
      articlesParsed: 14,
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      sourceName: 'Setopati English',
      status: 'success',
      message: 'Conflict monitor extracted 24 displaced families in Rukum West.',
      articlesParsed: 19,
    },
  ]);

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nepal_news_bookmarks');
      return saved ? JSON.parse(saved) : ['art-001'];
    } catch {
      return ['art-001'];
    }
  });

  // User Digest Preferences
  const [preferences, setPreferences] = useState<UserDigestPreferences>(() => {
    try {
      const saved = localStorage.getItem('nepal_digest_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Generated Daily Digest
  const [currentDigest, setCurrentDigest] = useState<GeneratedDigest | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-seed-1',
      title: 'Displacement Alert: 18 Families Displaced',
      message: 'Barahathawa, Sarlahi: 18 families displaced after local cadre clash; 3 FIRs lodged.',
      category: 'displacement',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      articleId: 'art-001',
      isRead: false,
    },
    {
      id: 'notif-seed-2',
      title: 'Police Blotter: CIB Cooperative Probe',
      message: 'SSP Hobindra Bogati confirms 12 bank accounts frozen in Pokhara & Kathmandu.',
      category: 'police_report',
      severity: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      articleId: 'art-003',
      isRead: false,
    },
  ]);

  // UI View States
  const [activeView, setActiveView] = useState<'feed' | 'displacement' | 'police' | 'bookmarks'>('feed');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDigestOpen, setIsDigestOpen] = useState<boolean>(false);
  const [isScraperOpen, setIsScraperOpen] = useState<boolean>(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [selectedProvince, setSelectedProvince] = useState<NepalProvince | 'all'>('all');
  const [selectedParty, setSelectedParty] = useState<PoliticalParty | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist articles and preferences
  useEffect(() => {
    try {
      localStorage.setItem('nepal_news_articles', JSON.stringify(articles));
    } catch (e) {
      console.warn('Storage limit reached:', e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('nepal_news_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn('Bookmarks save error:', e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('nepal_digest_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Preferences save error:', e);
    }
  }, [preferences]);

  // Initial Digest Generation on boot
  useEffect(() => {
    const digest = generatePersonalizedDigest(articles, preferences, 'Morning Briefing');
    setCurrentDigest(digest);
  }, []);

  // Compute aggregate numbers
  const displacedFamiliesTotal = useMemo(() => {
    return articles
      .filter((a) => a.displacement?.isDisplacementIncident)
      .reduce((sum, a) => sum + (a.displacement?.familiesCount || 0), 0);
  }, [articles]);

  const totalPoliceFIRs = useMemo(() => {
    return articles.filter((a) => a.policeReport?.isPoliceReportMentioned).length;
  }, [articles]);

  // Urgent alerts for ticker
  const urgentArticles = useMemo(() => {
    return articles.filter((a) => a.severity === 'critical' || a.severity === 'high');
  }, [articles]);

  // Bookmark toggle
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Trigger quick sync / scraper cycle
  const handleTriggerScrapeCycle = () => {
    setIsScraperSyncing(true);

    setTimeout(() => {
      // Simulate/perform fresh scrape
      const randomCount = Math.floor(Math.random() * 3) + 1;
      const newLog: ScraperLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sourceName: 'The Kathmandu Post & Police Press Feed',
        status: 'success',
        message: `HTTP 200 OK. Scraped fresh articles. Extracted 2 FIR references and 1 political movement update.`,
        articlesParsed: randomCount,
      };

      setScraperLogs((prev) => [newLog, ...prev.slice(0, 25)]);
      setSources((prev) =>
        prev.map((s) => ({
          ...s,
          lastScraped: 'Just now',
          articlesFound: s.articlesFound + 1,
        }))
      );
      setIsScraperSyncing(false);
    }, 1200);
  };

  // Add newly scraped article
  const handleArticleScraped = (newArticle: NewsArticle) => {
    setArticles((prev) => [newArticle, ...prev]);

    // Dispatch notification
    const notif = createBreakingNotification(newArticle);
    setNotifications((prev) => [notif, ...prev]);

    // Check browser desktop notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Desktop notification error:', e);
      }
    }

    // Add to scraper log
    const log: ScraperLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sourceName: newArticle.source.name,
      status: 'success',
      message: `Parsed article: "${newArticle.title.slice(0, 50)}...". Logged into database.`,
      articlesParsed: 1,
    };
    setScraperLogs((prev) => [log, ...prev]);
  };

  // Request & send test notification
  const handleSendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const sample = articles[0] || INITIAL_NEWS_ARTICLES[0];
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Breaking: ${sample.politicalContext?.partiesInvolved[0] || 'Civic Alert'} Update`,
      message: sample.title,
      category: sample.categories[0],
      severity: 'critical',
      timestamp: new Date().toISOString(),
      articleId: sample.id,
      isRead: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
        });
      } catch (e) {
        console.warn('Desktop notification error:', e);
      }
    }
  };

  // Generate personalized daily digest
  const handleGenerateDigest = async (timeframe: 'Morning Briefing' | 'Evening Briefing' | 'On-Demand Digest') => {
    const updated = await requestEnhancedDigest(articles, preferences, timeframe);
    setCurrentDigest(updated);
  };

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Bookmarks view filter
      if (activeView === 'bookmarks' && !bookmarkedIds.includes(art.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && !art.categories.includes(selectedCategory)) {
        return false;
      }

      // Province filter
      if (selectedProvince !== 'all' && art.location.province !== selectedProvince) {
        return false;
      }

      // Political party filter
      if (
        selectedParty !== 'all' &&
        !art.politicalContext?.partiesInvolved.includes(selectedParty)
      ) {
        return false;
      }

      // Severity filter
      if (selectedSeverity === 'critical' && art.severity !== 'critical') {
        return false;
      }
      if (selectedSeverity === 'high' && art.severity !== 'high' && art.severity !== 'critical') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchSummary = art.summary.toLowerCase().includes(q);
        const matchDistrict = art.location.district?.toLowerCase().includes(q);
        const matchParty = art.politicalContext?.partiesInvolved.some((p) =>
          p.toLowerCase().includes(q)
        );
        const matchPolice = art.policeReport?.policeStationOrDivision.toLowerCase().includes(q);
        const matchFir = art.policeReport?.firNumber?.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchDistrict && !matchParty && !matchPolice && !matchFir) {
          return false;
        }
      }

      return true;
    });
  }, [
    articles,
    activeView,
    bookmarkedIds,
    selectedCategory,
    selectedProvince,
    selectedParty,
    selectedSeverity,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedProvince('all');
    setSelectedParty('all');
    setSelectedSeverity('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenDigest={() => setIsDigestOpen(true)}
        onOpenScraper={() => setIsScraperOpen(true)}
        onOpenBookmarks={() => setActiveView(activeView === 'bookmarks' ? 'feed' : 'bookmarks')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        isScraperSyncing={isScraperSyncing}
        onTriggerQuickSync={handleTriggerScrapeCycle}
        activeView={activeView}
        onViewChange={(v) => setActiveView(v)}
        displacedFamiliesTotal={displacedFamiliesTotal}
        totalPoliceFIRs={totalPoliceFIRs}
      />

      {/* Breaking Urgent Ticker */}
      <BreakingTicker
        urgentArticles={urgentArticles}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {activeView === 'displacement' ? (
          <DisplacementTrackerView
            articles={articles}
            onSelectArticle={(art) => setSelectedArticle(art)}
          />
        ) : activeView === 'police' ? (
          <PoliceBlotterView
            articles={articles}
            onSelectArticle={(art) => setSelectedArticle(art)}
          />
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Filter bar */}
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedProvince={selectedProvince}
              onProvinceChange={setSelectedProvince}
              selectedParty={selectedParty}
              onPartyChange={setSelectedParty}
              selectedSeverity={selectedSeverity}
              onSeverityChange={setSelectedSeverity}
              totalArticlesCount={articles.length}
              filteredArticlesCount={filteredArticles.length}
              onResetFilters={resetFilters}
            />

            {/* Content Feed Layout */}
            <div className="px-4 py-8">
              {activeView === 'bookmarks' && (
                <div className="mb-6 flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2 text-rose-800 font-bold uppercase tracking-wider text-xs">
                    <Bookmark className="w-4 h-4 fill-rose-700" />
                    <span>Saved Reading List ({filteredArticles.length})</span>
                  </div>
                  <button
                    onClick={() => setActiveView('feed')}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    ← Back to All News Feed
                  </button>
                </div>
              )}

              {filteredArticles.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-stone-200 max-w-lg mx-auto p-8">
                  <h3 className="font-editorial text-xl font-bold text-stone-900 mb-1">
                    No Matching Reports Found
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    No articles currently match your filter selections or search terms.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Lead Featured Story (when not searching or bookmarked) */}
                  {!searchQuery && activeView === 'feed' && filteredArticles.length > 0 && (
                    <div className="mb-6">
                      <ArticleCard
                        article={filteredArticles[0]}
                        onOpenArticle={(art) => setSelectedArticle(art)}
                        onToggleBookmark={handleToggleBookmark}
                        isBookmarked={bookmarkedIds.includes(filteredArticles[0].id)}
                        featured={true}
                      />
                    </div>
                  )}

                  {/* Editorial Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(searchQuery || activeView !== 'feed'
                      ? filteredArticles
                      : filteredArticles.slice(1)
                    ).map((art) => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        onOpenArticle={(a) => setSelectedArticle(a)}
                        onToggleBookmark={handleToggleBookmark}
                        isBookmarked={bookmarkedIds.includes(art.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Reader Modal */}
      {selectedArticle && (
        <ReaderModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
        />
      )}

      {/* Personalized Daily Digest Modal */}
      <DailyDigestModal
        isOpen={isDigestOpen}
        onClose={() => setIsDigestOpen(false)}
        articles={articles}
        preferences={preferences}
        onUpdatePreferences={setPreferences}
        currentDigest={currentDigest}
        onGenerateDigest={handleGenerateDigest}
        notifications={notifications}
        onMarkNotificationRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          );
        }}
        onClearNotifications={() => setNotifications([])}
        onSendTestNotification={handleSendTestNotification}
        onSelectArticle={(art) => {
          setIsDigestOpen(false);
          setSelectedArticle(art);
        }}
      />

      {/* Scraper Dashboard Modal */}
      <ScraperDashboardModal
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        sources={sources}
        logs={scraperLogs}
        isSyncing={isScraperSyncing}
        onTriggerFullScrape={handleTriggerScrapeCycle}
        onArticleScraped={handleArticleScraped}
      />

      {/* Journalistic Footer */}
      <footer className="border-t border-stone-200 bg-white py-10 mt-16 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-editorial text-lg font-bold text-stone-900">
              THE NEPAL MONITOR · नेपाल नागरिक समाचार अनुगमन
            </div>
            <p className="text-stone-500 mt-1 max-w-md">
              Independent civic monitoring portal indexing news, police FIR blotters, political movements, and internally displaced households across Nepal's 7 provinces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-stone-500">
            <button
              onClick={() => setIsScraperOpen(true)}
              className="hover:text-stone-900 cursor-pointer"
            >
              Scraper Control Room
            </button>
            <button
              onClick={() => setIsDigestOpen(true)}
              className="hover:text-stone-900 cursor-pointer"
            >
              Personalized Digest Setup
            </button>
            <button
              onClick={() => setActiveView('displacement')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Displaced Families ({displacedFamiliesTotal})
            </button>
            <button
              onClick={() => setActiveView('police')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Police Blotters ({totalPoliceFIRs})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
