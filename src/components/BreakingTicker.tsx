import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface BreakingTickerProps {
  urgentArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ urgentArticles, onSelectArticle }) => {
  if (urgentArticles.length === 0) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-stone-900 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 font-bold text-amber-900 uppercase tracking-wider text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Civic Alert
          </span>
          <span className="text-amber-400">·</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="truncate">
            {urgentArticles.slice(0, 3).map((art, idx) => (
              <button
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="inline-flex items-center gap-1 text-stone-800 hover:text-stone-950 font-medium hover:underline mr-6 cursor-pointer text-left"
              >
                <span className="text-stone-500 font-semibold">[{art.location.province}]</span>
                <span>{art.title}</span>
                {idx < 2 && idx < urgentArticles.length - 1 && (
                  <span className="text-stone-400 ml-4 font-normal">|</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSelectArticle(urgentArticles[0])}
          className="inline-flex items-center gap-1 font-semibold text-amber-900 hover:text-amber-950 text-xs shrink-0 cursor-pointer"
        >
          <span>View Details</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
