import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Bookmark,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Users,
  Info,
  Type,
  FileText,
  Download,
  Languages,
  Layers,
  Globe2,
  Search,
  ExternalLink as LinkIcon,
} from 'lucide-react';
import { NewsArticle } from '../types/news';
import { downloadArticleAsDoc, copyFormattedArticleForGoogleDocs } from '../services/docExport';
import { translateArticleToNepali } from '../services/translationService';
import { getMediaOutletsForArticle, getSafeWorkingSourceUrl } from '../services/mediaCoverage';

interface ReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  article,
  onClose,
  onToggleBookmark,
  isBookmarked,
}) => {
  // Reading preferences
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark'>('dark');
  
  // Language Converter (English vs Nepali)
  const [currentLang, setCurrentLang] = useState<'en' | 'ne'>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedArticle, setTranslatedArticle] = useState<{
    titleNepali?: string;
    summaryNepali?: string;
    contentNepali?: string;
    keyTakeawaysNepali?: string[];
  }>({});

  // Action status messages
  const [copied, setCopied] = useState(false);
  const [googleDocsOpened, setGoogleDocsOpened] = useState(false);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Related media coverage active tab
  const [showRelatedMedia, setShowRelatedMedia] = useState(true);

  useEffect(() => {
    // Reset state on article change
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    }
    setCurrentLang('en');
    setTranslatedArticle({});
    setGoogleDocsOpened(false);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article]);

  if (!article) return null;

  // Language conversion trigger
  const handleToggleLanguage = async (targetLang: 'en' | 'ne') => {
    setCurrentLang(targetLang);

    if (targetLang === 'ne' && (!article.contentNepali && !translatedArticle.contentNepali)) {
      setIsTranslating(true);
      try {
        const result = await translateArticleToNepali(article);
        setTranslatedArticle(result);
      } catch (err) {
        console.warn('Translation error:', err);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  // Content based on active language
  const isNe = currentLang === 'ne';
  const activeTitle = isNe && (article.titleNepali || translatedArticle.titleNepali)
    ? (article.titleNepali || translatedArticle.titleNepali)!
    : article.title;

  const activeSummary = isNe && (article.summaryNepali || translatedArticle.summaryNepali)
    ? (article.summaryNepali || translatedArticle.summaryNepali)!
    : article.summary;

  const activeContent = isNe && (article.contentNepali || translatedArticle.contentNepali)
    ? (article.contentNepali || translatedArticle.contentNepali)!
    : article.content;

  const activeTakeaways = isNe && (article.keyTakeawaysNepali || translatedArticle.keyTakeawaysNepali)
    ? (article.keyTakeawaysNepali || translatedArticle.keyTakeawaysNepali)!
    : article.keyTakeaways;

  // Audio Speech Synthesis
  const handleStartSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPausedAudio) {
      window.speechSynthesis.resume();
      setIsPausedAudio(false);
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = `${activeTitle}. ${activeSummary}. ${activeContent}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick appropriate voice for Nepali or English
    const voices = window.speechSynthesis.getVoices();
    if (isNe) {
      const neVoice = voices.find((v) => v.lang.startsWith('ne') || v.lang.startsWith('hi'));
      if (neVoice) utterance.voice = neVoice;
    } else {
      const enVoice = voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  };

  const handlePauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
      setIsPausedAudio(true);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    }
  };

  // Direct Word Doc (.doc) download
  const handleDownloadWordDoc = () => {
    downloadArticleAsDoc(article, currentLang);
  };

  // Google Docs 1-click export
  const handleOpenGoogleDocs = () => {
    copyFormattedArticleForGoogleDocs(article, currentLang);
    setGoogleDocsOpened(true);
    setTimeout(() => setGoogleDocsOpened(false), 4000);
    // Open blank Google Docs tab
    window.open('https://docs.google.com/document/create', '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = () => {
    const text = `${activeTitle}\nSource: ${article.source.name} (${article.source.url})\n\n${activeSummary}\n\n${activeContent}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const safeSource = getSafeWorkingSourceUrl(article);
  const mediaOutlets = getMediaOutletsForArticle(article);

  // Color schemes
  const themeClasses = {
    light: 'bg-white text-stone-900 border-stone-200',
    sepia: 'bg-[#FAF6ED] text-[#38332E] border-[#E8DFD0]',
    dark: 'bg-[#18181B] text-[#EDEDED] border-stone-800',
  }[themeMode];

  const bodyBgClasses = {
    light: 'bg-white',
    sepia: 'bg-[#FAF6ED]',
    dark: 'bg-[#18181B]',
  }[themeMode];

  const fontSizeClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    xlarge: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-4xl rounded-xl shadow-2xl border flex flex-col my-auto max-h-[92vh] overflow-hidden transition-colors ${themeClasses}`}
      >
        {/* Top Control Bar */}
        <div className={`px-4 sm:px-6 py-2.5 border-b flex items-center justify-between gap-3 shrink-0 ${themeClasses}`}>
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto text-xs py-0.5">
            {/* Audio Voice Player Controls */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
              {!isPlayingAudio ? (
                <button
                  onClick={handleStartSpeech}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                  title="Listen to report"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseSpeech}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors cursor-pointer"
                  title="Pause speech"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
              )}

              {(isPlayingAudio || isPausedAudio) && (
                <button
                  onClick={handleStopSpeech}
                  className="p-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 rounded-md cursor-pointer"
                  title="Stop voice"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setSpeechRate(speechRate === 1 ? 1.25 : speechRate === 1.25 ? 1.5 : 1)}
                className="px-1.5 py-0.5 text-[11px] font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
                title="Playback speed"
              >
                {speechRate}x
              </button>
            </div>

            {/* Language Converter Toggle (English vs Nepali) */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
              <button
                onClick={() => handleToggleLanguage('en')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleToggleLanguage('ne')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  currentLang === 'ne'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                <Languages className="w-3 h-3" />
                <span>नेपाली</span>
              </button>
            </div>

            {/* Typography family */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg hidden sm:flex">
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-2 py-1 rounded font-serif ${
                  fontFamily === 'serif' ? 'bg-white dark:bg-stone-700 font-bold shadow-xs' : 'text-stone-600 dark:text-stone-300'
                } cursor-pointer`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-2 py-1 rounded font-sans ${
                  fontFamily === 'sans' ? 'bg-white dark:bg-stone-700 font-bold shadow-xs' : 'text-stone-600 dark:text-stone-300'
                } cursor-pointer`}
              >
                Sans
              </button>
            </div>

            {/* Font size */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg hidden md:flex">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded text-xs ${fontSize === 'normal' ? 'bg-white dark:bg-stone-700 font-bold shadow-xs' : 'text-stone-600 dark:text-stone-300'} cursor-pointer`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded text-sm ${fontSize === 'large' ? 'bg-white dark:bg-stone-700 font-bold shadow-xs' : 'text-stone-600 dark:text-stone-300'} cursor-pointer`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded text-base ${fontSize === 'xlarge' ? 'bg-white dark:bg-stone-700 font-bold shadow-xs' : 'text-stone-600 dark:text-stone-300'} cursor-pointer`}
              >
                A++
              </button>
            </div>

            {/* Color Theme */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
              <button
                onClick={() => setThemeMode('light')}
                className={`w-4.5 h-4.5 rounded-full bg-white border border-stone-300 ${themeMode === 'light' ? 'ring-2 ring-stone-900' : ''} cursor-pointer`}
                title="Light mode"
              />
              <button
                onClick={() => setThemeMode('sepia')}
                className={`w-4.5 h-4.5 rounded-full bg-[#FAF6ED] border border-[#d6cbba] ${themeMode === 'sepia' ? 'ring-2 ring-amber-800' : ''} cursor-pointer`}
                title="Warm paper mode"
              />
              <button
                onClick={() => setThemeMode('dark')}
                className={`w-4.5 h-4.5 rounded-full bg-stone-900 border border-stone-700 ${themeMode === 'dark' ? 'ring-2 ring-stone-400' : ''} cursor-pointer`}
                title="Night dark mode"
              />
            </div>
          </div>

          {/* Right action icons (Word Doc, Google Docs, Bookmark, Close) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Download as Word .doc */}
            <button
              onClick={handleDownloadWordDoc}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer"
              title="Download formatted .doc file (Word / Google Docs)"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">.doc</span>
            </button>

            {/* Open in Google Docs */}
            <button
              onClick={handleOpenGoogleDocs}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
              title="Open Google Docs and copy formatted report"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Google Docs</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'text-stone-500 hover:text-stone-800 border-transparent hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark this report'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-rose-600' : ''}`} />
            </button>

            {/* Copy Clean text */}
            <button
              onClick={handleCopyText}
              className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Copy plain text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer ml-1"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google Docs helper notice toast */}
        {googleDocsOpened && (
          <div className="bg-blue-600 text-white px-4 py-2 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>
                Formatted document copied to clipboard! Paste (Ctrl+V / Cmd+V) directly into your new Google Doc.
              </span>
            </div>
            <button onClick={() => setGoogleDocsOpened(false)} className="text-white hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Translating loader banner */}
        {isTranslating && (
          <div className="bg-rose-600 text-white px-4 py-1.5 text-xs flex items-center justify-center gap-2 animate-pulse">
            <Languages className="w-3.5 h-3.5" />
            <span>Translating article to natural Nepali (देवनागरी)...</span>
          </div>
        )}

        {/* Reader Scrollable Content */}
        <div className={`overflow-y-auto px-6 sm:px-12 md:px-16 py-8 flex-1 ${bodyBgClasses}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Metadata unboxed header with verified source search */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-medium">
              <div className="flex items-center gap-2">
                <span>{article.location.province} Province</span>
                {article.location.district && (
                  <>
                    <span>·</span>
                    <span>{article.location.district}</span>
                  </>
                )}
                <span>·</span>
                <span>{article.source.name}</span>
              </div>

              {/* Working Source links */}
              <div className="flex items-center gap-2 lowercase normal-case">
                <a
                  href={safeSource.portalSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-rose-500 hover:text-rose-400 hover:underline"
                  title="Search this exact coverage on original portal"
                >
                  <Search className="w-3 h-3" />
                  <span>Verify on {article.source.domain.replace('www.', '')}</span>
                </a>
              </div>
            </div>

            {/* Main Headline */}
            <h1
              className={`font-black text-stone-900 dark:text-stone-100 leading-tight ${
                fontFamily === 'serif' ? 'font-editorial text-2xl sm:text-3xl md:text-4xl' : 'font-sans text-2xl sm:text-3xl'
              }`}
            >
              {activeTitle}
            </h1>

            {/* Bilingual kicker if in English mode but Nepali title exists */}
            {!isNe && article.titleNepali && (
              <p className="text-base text-stone-600 dark:text-stone-300 font-medium italic border-l-2 border-stone-300 pl-3">
                {article.titleNepali}
              </p>
            )}

            {/* Byline and Dateline */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 py-3 border-y border-stone-200 dark:border-stone-800">
              <div>
                <span>By {article.author}</span>
                <span className="mx-2">·</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={safeSource.googleNewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-500 hover:underline"
                  title="Search on Google News Nepal"
                >
                  <span>Google News</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={safeSource.primaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-rose-500 hover:underline"
                  title="Open original publication portal"
                >
                  <span>Live Portal Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Executive Summary Takeaways Box */}
            {activeTakeaways && activeTakeaways.length > 0 && (
              <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg p-4">
                <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  {isNe ? 'मुख्य सार बुँदाहरू' : 'Executive Key Takeaways'}
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-stone-800 dark:text-stone-200 list-disc list-inside">
                  {activeTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="leading-snug">
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Displacement Dossier Box */}
            {article.displacement?.isDisplacementIncident && (
              <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <Users className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                  <span>{isNe ? 'द्वन्द्व विस्थापन अनुगमन विवरण' : 'Conflict Displacement Dossier'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-rose-950 dark:text-rose-200">
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">{isNe ? 'विस्थापित:' : 'Displaced Population:'} </span>
                    <strong>{article.displacement.familiesCount} {isNe ? 'परिवार' : 'Families'}</strong>
                    {article.displacement.individualsCount && ` (~${article.displacement.individualsCount} ${isNe ? 'नागरिक' : 'persons'})`}
                  </div>
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">{isNe ? 'आश्रयस्थल:' : 'Current Shelter:'} </span>
                    <span>{article.displacement.currentShelterLocation}</span>
                  </div>
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">{isNe ? 'कारण:' : 'Cause:'} </span>
                    <span className="capitalize">{article.displacement.displacementCause.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">{isNe ? 'राहत स्थिति:' : 'Relief Status:'} </span>
                    <span className="font-semibold">{article.displacement.reliefStatus.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                {article.displacement.aidRequired && article.displacement.aidRequired.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-900 text-xs">
                    <span className="text-rose-700 dark:text-rose-400 font-medium">{isNe ? 'तत्काल आवश्यक राहत:' : 'Urgent Aid Required:'} </span>
                    <span>{article.displacement.aidRequired.join(' · ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Police Report Blotter Dossier Box */}
            {article.policeReport?.isPoliceReportMentioned && (
              <div className="bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                  <span>{isNe ? 'नेपाल प्रहरी जाहेरी तथा अनुसन्धान विवरण' : 'Nepal Police Blotter Record'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-indigo-950 dark:text-indigo-200">
                  <div>
                    <span className="text-indigo-700 dark:text-indigo-400 font-medium">{isNe ? 'प्रहरी इकाई:' : 'Police Unit:'} </span>
                    <strong>{article.policeReport.policeStationOrDivision}</strong>
                  </div>
                  {article.policeReport.firNumber && (
                    <div>
                      <span className="text-indigo-700 dark:text-indigo-400 font-medium">{isNe ? 'जाहेरी (FIR) नं:' : 'FIR Number:'} </span>
                      <span className="font-mono">{article.policeReport.firNumber}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-indigo-700 dark:text-indigo-400 font-medium">{isNe ? 'मुद्दा / कसुर:' : 'Offense Type:'} </span>
                    <span>{article.policeReport.offenseType || 'Public Order & Incident'}</span>
                  </div>
                  <div>
                    <span className="text-indigo-700 dark:text-indigo-400 font-medium">{isNe ? 'पक्राउ संख्या:' : 'Arrests:'} </span>
                    <strong>{article.policeReport.arrestsCount} {isNe ? 'जना नियन्त्रणमा' : 'Persons in Custody'}</strong>
                  </div>
                </div>
                {article.policeReport.officialStatement && (
                  <div className="mt-2.5 pt-2 border-t border-indigo-200/60 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 italic">
                    "{article.policeReport.officialStatement}"
                  </div>
                )}
              </div>
            )}

            {/* Story Content Body */}
            <div
              className={`prose dark:prose-invert max-w-none space-y-4 ${
                fontFamily === 'serif' ? 'font-editorial' : 'font-sans'
              } ${fontSizeClasses}`}
            >
              {activeContent.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* MULTI-MEDIA COVERAGE SECTION: Similar News Covered by Other Online Media */}
            <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  <Globe2 className="w-4 h-4 text-emerald-500" />
                  <span>Other Online News Media Covering This Story ({mediaOutlets.length})</span>
                </div>
                <span className="text-[11px] text-stone-500">Cross-Media Coverage Track</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mediaOutlets.map((outlet, idx) => (
                  <a
                    key={idx}
                    href={outlet.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 hover:border-stone-400 dark:hover:border-stone-600 transition-colors block group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-500 transition-colors">
                        {outlet.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-stone-200" />
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                      {outlet.perspectiveAngle}
                    </div>
                    <div className="text-[10px] text-rose-500 font-medium mt-1">
                      Search archive on {outlet.domain} →
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Nepali Civic Glossary */}
            {article.nepaliKeywords && article.nepaliKeywords.length > 0 && (
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  <Info className="w-3.5 h-3.5" />
                  <span>Nepal Civic & Legal Glossary</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {article.nepaliKeywords.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-stone-50 dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-700"
                    >
                      <div className="font-bold text-stone-900 dark:text-stone-100">{item.term}</div>
                      <div className="text-stone-600 dark:text-stone-300 text-[11px] mt-0.5">{item.meaningEn}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
