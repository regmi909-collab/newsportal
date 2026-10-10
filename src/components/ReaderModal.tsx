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
} from 'lucide-react';
import { NewsArticle } from '../types/news';

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
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Active glossary tooltip
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);

  useEffect(() => {
    // Reset audio state when article changes or opens
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article]);

  if (!article) return null;

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

    // Prepare read-aloud text
    const textToRead = `${article.title}. Published by ${article.source.name}. ${article.summary}. ${article.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

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

  const handleCopyText = () => {
    const text = `${article.title}\nSource: ${article.source.name} (${article.source.url})\n\n${article.summary}\n\n${article.content}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    let md = `# ${article.title}\n`;
    if (article.titleNepali) md += `*${article.titleNepali}*\n\n`;
    md += `**Source:** [${article.source.name}](${article.source.url}) | **Location:** ${article.location.province} (${article.location.district || ''})\n\n`;
    md += `## Executive Summary\n${article.summary}\n\n`;
    if (article.keyTakeaways && article.keyTakeaways.length > 0) {
      md += `## Key Takeaways\n`;
      article.keyTakeaways.forEach((t) => (md += `- ${t}\n`));
      md += `\n`;
    }
    if (article.policeReport?.isPoliceReportMentioned) {
      md += `## Nepal Police Report Dossier\n`;
      md += `- **Station/Office:** ${article.policeReport.policeStationOrDivision}\n`;
      if (article.policeReport.firNumber) md += `- **FIR Number:** ${article.policeReport.firNumber}\n`;
      md += `- **Offense Type:** ${article.policeReport.offenseType || 'General Incident'}\n`;
      md += `- **Arrests Recorded:** ${article.policeReport.arrestsCount}\n\n`;
    }
    if (article.displacement?.isDisplacementIncident) {
      md += `## Conflict Displacement Dossier\n`;
      md += `- **Displaced Families:** ${article.displacement.familiesCount}\n`;
      md += `- **Origin:** ${article.displacement.originLocation}\n`;
      md += `- **Current Shelter:** ${article.displacement.currentShelterLocation}\n`;
      md += `- **Relief Status:** ${article.displacement.reliefStatus}\n\n`;
    }
    md += `## Full Report\n${article.content}\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug || 'nepal-news'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Color schemes for reader modes
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
        <div className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 shrink-0 ${themeClasses}`}>
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs">
            {/* Audio Voice Player Controls */}
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
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

              {/* Speed toggle */}
              <button
                onClick={() => setSpeechRate(speechRate === 1 ? 1.25 : speechRate === 1.25 ? 1.5 : 1)}
                className="px-1.5 py-0.5 text-[11px] font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
                title="Playback speed"
              >
                {speechRate}x
              </button>
            </div>

            {/* Typography family */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
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
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
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
                className={`w-5 h-5 rounded-full bg-white border border-stone-300 ${themeMode === 'light' ? 'ring-2 ring-stone-900' : ''} cursor-pointer`}
                title="Light mode"
              />
              <button
                onClick={() => setThemeMode('sepia')}
                className={`w-5 h-5 rounded-full bg-[#FAF6ED] border border-[#d6cbba] ${themeMode === 'sepia' ? 'ring-2 ring-amber-800' : ''} cursor-pointer`}
                title="Warm paper mode"
              />
              <button
                onClick={() => setThemeMode('dark')}
                className={`w-5 h-5 rounded-full bg-stone-900 border border-stone-700 ${themeMode === 'dark' ? 'ring-2 ring-stone-400' : ''} cursor-pointer`}
                title="Night dark mode"
              />
            </div>
          </div>

          {/* Right action icons */}
          <div className="flex items-center gap-2 shrink-0">
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

            <button
              onClick={handleCopyText}
              className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Copy clean report text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleExportMarkdown}
              className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Download Markdown report"
            >
              <FileText className="w-4 h-4" />
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

        {/* Reader Scrollable Content */}
        <div className={`overflow-y-auto px-6 sm:px-12 md:px-16 py-8 flex-1 ${bodyBgClasses}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Metadata unboxed header */}
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-medium">
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

            {/* Main Headline */}
            <h1
              className={`font-black text-stone-900 dark:text-stone-100 leading-tight ${
                fontFamily === 'serif' ? 'font-editorial text-2xl sm:text-3xl md:text-4xl' : 'font-sans text-2xl sm:text-3xl'
              }`}
            >
              {article.title}
            </h1>

            {/* Nepali Title if present */}
            {article.titleNepali && (
              <p className="text-base text-stone-600 dark:text-stone-300 font-medium italic border-l-2 border-stone-300 pl-3">
                {article.titleNepali}
              </p>
            )}

            {/* Byline and Dateline */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 py-3 border-y border-stone-200 dark:border-stone-800">
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

              {article.source.url && (
                <a
                  href={article.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline"
                >
                  <span>Original Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Executive Summary Takeaways Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg p-4">
                <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Key Takeaways
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-stone-800 dark:text-stone-200 list-disc list-inside">
                  {article.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="leading-snug">
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Displacement Dossier Box (if applicable) */}
            {article.displacement?.isDisplacementIncident && (
              <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <Users className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                  <span>Conflict Displacement Dossier</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-rose-950 dark:text-rose-200">
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">Displaced Population: </span>
                    <strong>{article.displacement.familiesCount} Families</strong>
                    {article.displacement.individualsCount && ` (~${article.displacement.individualsCount} persons)`}
                  </div>
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">Current Shelter: </span>
                    <span>{article.displacement.currentShelterLocation}</span>
                  </div>
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">Cause: </span>
                    <span className="capitalize">{article.displacement.displacementCause.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-rose-700 dark:text-rose-400 font-medium">Relief Status: </span>
                    <span className="font-semibold">{article.displacement.reliefStatus.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                {article.displacement.aidRequired && article.displacement.aidRequired.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-900 text-xs">
                    <span className="text-rose-700 dark:text-rose-400 font-medium">Urgent Aid Required: </span>
                    <span>{article.displacement.aidRequired.join(' · ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Police Report Blotter Dossier Box (if applicable) */}
            {article.policeReport?.isPoliceReportMentioned && (
              <div className="bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                  <span>Nepal Police blotter Record</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-indigo-950 dark:text-indigo-200">
                  <div>
                    <span className="text-indigo-700 dark:text-indigo-400 font-medium">Police Unit: </span>
                    <strong>{article.policeReport.policeStationOrDivision}</strong>
                  </div>
                  {article.policeReport.firNumber && (
                    <div>
                      <span className="text-indigo-700 dark:text-indigo-400 font-medium">FIR Number: </span>
                      <span className="font-mono">{article.policeReport.firNumber}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-indigo-700 dark:text-indigo-400 font-medium">Offense Type: </span>
                    <span>{article.policeReport.offenseType || 'Public Order & Incident'}</span>
                  </div>
                  <div>
                    <span className="text-indigo-700 dark:text-indigo-400 font-medium">Arrests: </span>
                    <strong>{article.policeReport.arrestsCount} Persons in Custody</strong>
                  </div>
                </div>
                {article.policeReport.officialStatement && (
                  <div className="mt-2.5 pt-2 border-t border-indigo-200/60 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 italic">
                    "{article.policeReport.officialStatement}"
                  </div>
                )}
              </div>
            )}

            {/* Full Story Content Body */}
            <div
              className={`prose dark:prose-invert max-w-none space-y-4 ${
                fontFamily === 'serif' ? 'font-editorial' : 'font-sans'
              } ${fontSizeClasses}`}
            >
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Nepali Civic Glossary Interactive Drawer */}
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
