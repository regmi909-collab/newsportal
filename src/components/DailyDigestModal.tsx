import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Bell,
  Check,
  Copy,
  Download,
  Send,
  Sliders,
  Radio,
  Users,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import {
  NewsArticle,
  UserDigestPreferences,
  GeneratedDigest,
  NotificationItem,
  PoliticalParty,
  NepalProvince,
} from '../types/news';
import { formatDigestAsMarkdown } from '../services/digestEngine';

interface DailyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  preferences: UserDigestPreferences;
  onUpdatePreferences: (newPrefs: UserDigestPreferences) => void;
  currentDigest: GeneratedDigest | null;
  onGenerateDigest: (timeframe: 'Morning Briefing' | 'Evening Briefing' | 'On-Demand Digest') => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onSendTestNotification: () => void;
  onSelectArticle: (article: NewsArticle) => void;
}

const ALL_PARTIES: PoliticalParty[] = [
  'Nepali Congress',
  'CPN-UML',
  'CPN (Maoist Centre)',
  'Rastriya Swatantra Party (RSP)',
  'Rastriya Prajatantra Party (RPP)',
  'Janata Samajbadi Party (JSP)',
  'Janamat Party',
];

const ALL_PROVINCES: NepalProvince[] = [
  'Bagmati',
  'Koshi',
  'Madhesh',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
];

export const DailyDigestModal: React.FC<DailyDigestModalProps> = ({
  isOpen,
  onClose,
  articles,
  preferences,
  onUpdatePreferences,
  currentDigest,
  onGenerateDigest,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onSendTestNotification,
  onSelectArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'digest' | 'preferences' | 'notifications'>('digest');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Morning Briefing' | 'Evening Briefing' | 'On-Demand Digest'>('Morning Briefing');

  if (!isOpen) return null;

  // Audio briefing handler for digest
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window) || !currentDigest) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentDigest.audioScript);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopyMarkdown = () => {
    if (!currentDigest) return;
    const md = formatDigestAsMarkdown(currentDigest);
    navigator.clipboard.writeText(md);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!currentDigest) return;
    const md = formatDigestAsMarkdown(currentDigest);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nepal-daily-digest-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleParty = (party: PoliticalParty) => {
    const exists = preferences.preferredParties.includes(party);
    const updated = exists
      ? preferences.preferredParties.filter((p) => p !== party)
      : [...preferences.preferredParties, party];
    onUpdatePreferences({ ...preferences, preferredParties: updated });
  };

  const toggleProvince = (prov: NepalProvince) => {
    const exists = preferences.preferredProvinces.includes(prov);
    const updated = exists
      ? preferences.preferredProvinces.filter((p) => p !== prov)
      : [...preferences.preferredProvinces, prov];
    onUpdatePreferences({ ...preferences, preferredProvinces: updated });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-stone-200 flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-3 bg-stone-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Personalized Daily Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-editorial text-stone-900 mt-0.5">
              Daily Digest & Notification Center
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

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-stone-200 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('digest')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'digest'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Today's Digest
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'preferences'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Personalized Topics
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>Alert History</span>
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'digest' && (
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={() => {
                  onGenerateDigest(selectedTimeframe);
                }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Re-Synthesize Now</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          {/* TAB 1: DAILY DIGEST */}
          {activeTab === 'digest' && (
            <div className="space-y-6">
              {/* Controls bar: Timeframe selector and Audio player */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-600">Edition:</span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-stone-200 text-xs">
                    {(['Morning Briefing', 'Evening Briefing', 'On-Demand Digest'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setSelectedTimeframe(mode);
                          onGenerateDigest(mode);
                        }}
                        className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                          selectedTimeframe === mode ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Audio Briefing button */}
                  <button
                    onClick={handleToggleAudio}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                    }`}
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingAudio ? 'Stop Radio Briefing' : 'Play Radio News Audio'}</span>
                  </button>

                  <button
                    onClick={handleCopyMarkdown}
                    className="p-1.5 text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-md cursor-pointer"
                    title="Copy digest"
                  >
                    {copiedDigest ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleDownloadMarkdown}
                    className="p-1.5 text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-md cursor-pointer"
                    title="Download Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {currentDigest ? (
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div>
                    <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">
                      {selectedTimeframe} · Nepal Standard Time
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 mb-2">
                      {currentDigest.headline}
                    </h3>
                    <p className="text-sm text-stone-700 leading-relaxed font-sans bg-amber-50/60 p-4 rounded-lg border border-amber-100">
                      {currentDigest.executiveSummary}
                    </p>
                  </div>

                  {/* Two Column Section: Displacement Watch & Police Blotter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Displacement Watch Box */}
                    <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-200">
                      <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider mb-2">
                        <Users className="w-4 h-4 text-rose-700" />
                        <span>Conflict Displacement Watch</span>
                      </div>
                      <div className="text-xs text-rose-950 space-y-1.5 leading-relaxed">
                        <div>
                          <strong>{currentDigest.displacementWatch.totalFamiliesTracked} Families Displaced</strong> across monitored wards.
                        </div>
                        <p>{currentDigest.displacementWatch.humanitarianSummary}</p>
                      </div>
                    </div>

                    {/* Police Blotter Summary */}
                    <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-2">
                        <ShieldAlert className="w-4 h-4 text-indigo-700" />
                        <span>Law Enforcement & FIRs</span>
                      </div>
                      <p className="text-xs text-indigo-950 leading-relaxed">
                        {currentDigest.policeBlotterSummary}
                      </p>
                    </div>
                  </div>

                  {/* Political Party Pulse */}
                  <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Political Movements & Coalition Temperature
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {currentDigest.politicalPulse}
                    </p>
                  </div>

                  {/* Curated Matching Stories */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                      Selected Priority Stories For You ({currentDigest.topStories.length})
                    </h4>
                    <div className="space-y-3">
                      {currentDigest.topStories.map((story, idx) => {
                        const original = articles.find((a) => a.id === story.articleId);
                        return (
                          <div
                            key={idx}
                            onClick={() => original && onSelectArticle(original)}
                            className="p-3.5 bg-white rounded-lg border border-stone-200 hover:border-stone-400 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                              <span className="font-semibold text-stone-700 uppercase">
                                {story.province} Province · {story.urgency}
                              </span>
                            </div>
                            <h5 className="font-editorial font-bold text-stone-900 text-sm sm:text-base hover:text-rose-700 transition-colors">
                              {story.title}
                            </h5>
                            <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                              {story.summary}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-stone-500 text-sm">
                  Click 'Re-Synthesize Now' to generate your personalized briefing.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PREFERENCES CONFIG */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-stone-900">Personalize Your News Digest</h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Choose which political movements, police blotters, and provinces you wish to monitor in your daily notifications.
                </p>
              </div>

              {/* Political Party selection */}
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  Follow Political Parties
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_PARTIES.map((party) => {
                    const isChecked = preferences.preferredParties.includes(party);
                    return (
                      <button
                        key={party}
                        onClick={() => toggleParty(party)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span>{party}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-amber-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Monitors Toggle */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Incident & Security Monitors
                </label>
                
                <label className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Include Nepal Police Reports & FIRs</div>
                    <div className="text-[11px] text-stone-500">
                      Alert me on every police FIR, crime division raid, and arrests mentioned in news
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.includePoliceReports}
                    onChange={(e) =>
                      onUpdatePreferences({ ...preferences, includePoliceReports: e.target.checked })
                    }
                    className="w-4 h-4 text-stone-900 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Conflict Displacement Tracker Alerts</div>
                    <div className="text-[11px] text-stone-500">
                      Priority notification when families are displaced by political clashes or land disputes
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.includeDisplacementAlerts}
                    onChange={(e) =>
                      onUpdatePreferences({ ...preferences, includeDisplacementAlerts: e.target.checked })
                    }
                    className="w-4 h-4 text-stone-900 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Province filter */}
              <div className="pt-2 border-t border-stone-200">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  Provinces of Interest
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_PROVINCES.map((prov) => {
                    const isChecked = preferences.preferredProvinces.includes(prov);
                    return (
                      <button
                        key={prov}
                        onClick={() => toggleProvince(prov)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {prov} Province
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notification Push Settings */}
              <div className="pt-2 border-t border-stone-200 space-y-3">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Notification Delivery
                </label>
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Desktop & Browser Push Notifications</div>
                    <div className="text-[11px] text-stone-500">Receive breaking alerts when high-severity incidents occur</div>
                  </div>
                  <button
                    onClick={onSendTestNotification}
                    className="px-2.5 py-1 text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded cursor-pointer"
                  >
                    Dispatch Test Alert
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS HISTORY */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Alert Log & History</h3>
                  <p className="text-xs text-stone-600">Simulated in-app notification center for breaking events</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onSendTestNotification}
                    className="px-2.5 py-1 text-xs font-semibold bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Simulate Breaking Alert
                  </button>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="px-2.5 py-1 text-xs font-medium text-rose-700 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No alerts currently in your inbox.
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onMarkNotificationRead(item.id)}
                      className={`p-3 rounded-lg border transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                        item.isRead
                          ? 'bg-stone-50/50 border-stone-200 opacity-75'
                          : 'bg-white border-stone-300 shadow-2xs ring-1 ring-stone-900/5'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            item.severity === 'critical'
                              ? 'bg-rose-600'
                              : item.severity === 'high'
                              ? 'bg-amber-600'
                              : 'bg-indigo-600'
                          }`}
                        />
                        <div>
                          <div className="font-bold text-xs text-stone-900">{item.title}</div>
                          <div className="text-xs text-stone-600 mt-0.5">{item.message}</div>
                          <div className="text-[10px] text-stone-400 mt-1">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      {!item.isRead && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                          New
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
