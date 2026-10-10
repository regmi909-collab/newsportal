import React from 'react';
import { Bookmark, ShieldAlert, Users, Clock, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface ArticleCardProps {
  article: NewsArticle;
  onOpenArticle: (article: NewsArticle) => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onOpenArticle,
  onToggleBookmark,
  isBookmarked,
  featured = false,
}) => {
  // Format publication date relative or clean string
  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  // Location kicker text
  const locationKicker = `${article.location.province.toUpperCase()} ${
    article.location.district ? `· ${article.location.district.toUpperCase()}` : ''
  }`;

  return (
    <article
      className={`group bg-white rounded-lg border border-stone-200 transition-all duration-150 hover:border-stone-400 hover:shadow-sm flex flex-col justify-between ${
        featured ? 'p-6 md:p-8 bg-gradient-to-b from-stone-50/50 to-white' : 'p-5'
      }`}
    >
      <div>
        {/* Quiet 1-line text kicker (NO PILLS) */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium tracking-wider uppercase text-[11px]">
            <span className={article.severity === 'critical' ? 'text-rose-700 font-bold' : 'text-stone-700'}>
              {locationKicker}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.source.name}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-rose-600 bg-rose-50'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Save article'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Primary Title */}
        <h2
          onClick={() => onOpenArticle(article)}
          className={`font-editorial font-bold text-stone-900 group-hover:text-stone-800 transition-colors cursor-pointer leading-snug mb-2 ${
            featured ? 'text-2xl md:text-3xl font-black' : 'text-lg md:text-xl'
          }`}
        >
          {article.title}
        </h2>

        {/* Summary text */}
        <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed font-sans">
          {article.summary}
        </p>

        {/* Domain-specific metadata badges (unboxed text style) */}
        <div className="space-y-1.5 mb-4 text-xs">
          {/* Displaced Families Indicator */}
          {article.displacement?.isDisplacementIncident && (
            <div className="flex items-center gap-2 text-rose-800 font-semibold bg-rose-50/70 border border-rose-100 rounded-md px-2.5 py-1">
              <Users className="w-3.5 h-3.5 shrink-0 text-rose-700" />
              <span>
                {article.displacement.familiesCount} Families Displaced
                {article.displacement.individualsCount ? ` (~${article.displacement.individualsCount} persons)` : ''}
                {' · '}
                <span className="font-normal text-rose-900 text-[11px]">
                  {article.displacement.currentShelterLocation}
                </span>
              </span>
            </div>
          )}

          {/* Police Report Blotter Indicator */}
          {article.policeReport?.isPoliceReportMentioned && (
            <div className="flex items-center gap-2 text-indigo-900 font-medium bg-indigo-50/70 border border-indigo-100 rounded-md px-2.5 py-1 text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-indigo-700" />
              <span>
                <strong>{article.policeReport.policeStationOrDivision}</strong>
                {article.policeReport.firNumber ? ` · ${article.policeReport.firNumber}` : ''}
                {article.policeReport.arrestsCount > 0 ? ` · ${article.policeReport.arrestsCount} Arrests` : ''}
              </span>
            </div>
          )}

          {/* Political Parties Involved */}
          {article.politicalContext && article.politicalContext.partiesInvolved.length > 0 && (
            <div className="text-stone-600 text-[11px] pt-1">
              <span className="text-stone-400">Parties: </span>
              <span className="font-semibold text-stone-800">
                {article.politicalContext.partiesInvolved.join(' · ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: unboxed metadata and read button */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span>{formatTime(article.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTimeMinutes} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          {article.source.url && (
            <a
              href={article.source.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-stone-400 hover:text-stone-700 transition-colors p-1"
              title="Open original portal source"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={() => onOpenArticle(article)}
            className="font-semibold text-stone-900 hover:text-rose-700 transition-colors cursor-pointer text-xs"
          >
            Read Report →
          </button>
        </div>
      </div>
    </article>
  );
};
