import React, { useState } from 'react';
import {
  X,
  Radio,
  RefreshCw,
  Plus,
  Play,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ScraperSource, ScraperLog, NewsArticle } from '../types/news';
import { scrapeArticleFromUrl, requestAIExtraction } from '../services/apiClient';
import { convertExtractedToArticle } from '../services/scraperEngine';

interface ScraperDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: ScraperSource[];
  logs: ScraperLog[];
  isSyncing: boolean;
  onTriggerFullScrape: () => void;
  onArticleScraped: (newArticle: NewsArticle) => void;
}

export const ScraperDashboardModal: React.FC<ScraperDashboardModalProps> = ({
  isOpen,
  onClose,
  sources,
  logs,
  isSyncing,
  onTriggerFullScrape,
  onArticleScraped,
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'custom_url' | 'raw_text' | 'logs'>('sources');
  const [customUrl, setCustomUrl] = useState('');
  const [isUrlScraping, setIsUrlScraping] = useState(false);
  const [urlScrapeError, setUrlScrapeError] = useState<string | null>(null);
  const [urlScrapeSuccess, setUrlScrapeSuccess] = useState<string | null>(null);

  // Raw text extraction state
  const [rawTextTitle, setRawTextTitle] = useState('');
  const [rawTextBody, setRawTextBody] = useState('');
  const [isTextExtracting, setIsTextExtracting] = useState(false);

  if (!isOpen) return null;

  const handleScrapeCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setIsUrlScraping(true);
    setUrlScrapeError(null);
    setUrlScrapeSuccess(null);

    try {
      const article = await scrapeArticleFromUrl(customUrl.trim());
      onArticleScraped(article);
      setUrlScrapeSuccess(`Successfully parsed "${article.title}". Added to news stream.`);
      setCustomUrl('');
    } catch (err: any) {
      setUrlScrapeError(err.message || 'Failed to scrape target URL');
    } finally {
      setIsUrlScraping(false);
    }
  };

  const handleExtractRawText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTextBody.trim()) return;

    setIsTextExtracting(true);
    try {
      const extracted = await requestAIExtraction(rawTextBody, rawTextTitle);
      const article = convertExtractedToArticle(extracted);
      onArticleScraped(article);
      setRawTextTitle('');
      setRawTextBody('');
      setUrlScrapeSuccess(`Report parsed and published: "${article.title}"`);
    } catch (err: any) {
      setUrlScrapeError(err.message || 'Failed to analyze text');
    } finally {
      setIsTextExtracting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-stone-200 flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-3 bg-stone-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-xs">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Portal Crawler & Extraction Control</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-editorial text-stone-900 mt-0.5">
              News Portal Scraper Engine
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 border-b border-stone-200 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'sources'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Monitored Portals ({sources.length})
            </button>
            <button
              onClick={() => setActiveTab('custom_url')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'custom_url'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Scrape Custom URL
            </button>
            <button
              onClick={() => setActiveTab('raw_text')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'raw_text'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Paste & Parse Article
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'logs'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Activity Logs ({logs.length})
            </button>
          </div>

          <button
            onClick={onTriggerFullScrape}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-50 pb-2 mb-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-rose-400' : ''}`} />
            <span>{isSyncing ? 'Crawling All Portals...' : 'Run Scrape Cycle'}</span>
          </button>
        </div>

        {/* Status banner */}
        {urlScrapeSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{urlScrapeSuccess}</span>
            </div>
            <button onClick={() => setUrlScrapeSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {urlScrapeError && (
          <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-6 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{urlScrapeError}</span>
            </div>
            <button onClick={() => setUrlScrapeError(null)} className="text-rose-700 hover:text-rose-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Body */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          {/* TAB 1: MONITORED SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  The scraper regularly queries major Nepal news outlets and police bulletins for political, police, and displacement reporting.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className="p-4 rounded-lg border border-stone-200 bg-white hover:border-stone-400 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-900">{src.name}</span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {src.status.toUpperCase()}
                        </span>
                      </div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-500 hover:text-stone-800 text-xs truncate block hover:underline"
                      >
                        {src.url}
                      </a>
                      <div className="text-xs text-stone-600 mt-2 font-medium">
                        Focus: <span className="text-stone-800">{src.categoryFocus}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                      <span>Every {src.frequencyMinutes}m · Last: {src.lastScraped}</span>
                      <span className="font-semibold text-stone-800">{src.articlesFound} articles logged</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SCRAPE CUSTOM URL */}
          {activeTab === 'custom_url' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-stone-900">Scrape from any Nepali News URL</h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Enter an article link from The Kathmandu Post, MyRepublica, OnlineKhabar, Setopati, or any local news site. The backend scraper will extract content and automatically parse political party tags, police blotter details, and displacement counts.
                </p>
              </div>

              <form onSubmit={handleScrapeCustomUrl} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Target Article Web Address (URL)
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://kathmandupost.com/national/2026/10/..."
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isUrlScraping}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isUrlScraping ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scraping & Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        <span>Scrape & Process Article</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick sample links for testing */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
                <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Quick Test Portals (Click to fill)
                </div>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setCustomUrl('https://kathmandupost.com/national/2026/10/political-clash-madhesh-police-fir')}
                    className="text-left text-stone-600 hover:text-stone-900 hover:underline block truncate cursor-pointer"
                  >
                    → kathmandupost.com/national/political-clash-madhesh-police-fir
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomUrl('https://english.onlinekhabar.com/cib-investigates-cooperative-fraud-fir.html')}
                    className="text-left text-stone-600 hover:text-stone-900 hover:underline block truncate cursor-pointer"
                  >
                    → english.onlinekhabar.com/cib-investigates-cooperative-fraud-fir.html
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomUrl('https://en.setopati.com/social/karnali-land-conflict-families-displaced.html')}
                    className="text-left text-stone-600 hover:text-stone-900 hover:underline block truncate cursor-pointer"
                  >
                    → en.setopati.com/social/karnali-land-conflict-families-displaced.html
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW TEXT PARSER */}
          {activeTab === 'raw_text' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-stone-900">Paste & Parse Raw News Text</h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Paste raw text from a press release, police blotter statement, or local dispatch. The entity extractor will structure it and identify political movements, FIRs, and displaced families.
                </p>
              </div>

              <form onSubmit={handleExtractRawText} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={rawTextTitle}
                    onChange={(e) => setRawTextTitle(e.target.value)}
                    placeholder="e.g. Police register FIR after clash in Dhangadhi"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Article or Police Statement Body
                  </label>
                  <textarea
                    rows={6}
                    value={rawTextBody}
                    onChange={(e) => setRawTextBody(e.target.value)}
                    placeholder="Paste article text here... (e.g. In Biratnagar, 14 families were displaced following a dispute between cadres of Nepali Congress and CPN-UML. District Police Office Morang registered 2 FIRs and arrested 3 people...)"
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTextExtracting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isTextExtracting ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting Entities...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>Parse & Publish to Monitor</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SCRAPER LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-500">
                Live stream of scraper network requests, DOM extractions, and classification outcomes.
              </div>

              <div className="bg-stone-900 text-stone-200 p-4 rounded-lg font-mono text-[11px] space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 border-b border-stone-800 pb-1.5">
                    <span className="text-stone-500 shrink-0">
                      [{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                    </span>
                    <span className="text-amber-400 font-bold shrink-0">{log.sourceName}:</span>
                    <span className={log.status === 'success' ? 'text-emerald-400' : 'text-stone-300'}>
                      {log.message}
                    </span>
                    <span className="text-stone-500 ml-auto shrink-0">
                      +{log.articlesParsed} parsed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
