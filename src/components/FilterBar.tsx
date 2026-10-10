import React from 'react';
import { NepalProvince, PoliticalParty, NewsCategory } from '../types/news';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: NewsCategory | 'all';
  onCategoryChange: (cat: NewsCategory | 'all') => void;
  selectedProvince: NepalProvince | 'all';
  onProvinceChange: (prov: NepalProvince | 'all') => void;
  selectedParty: PoliticalParty | 'all';
  onPartyChange: (party: PoliticalParty | 'all') => void;
  selectedSeverity: 'all' | 'critical' | 'high';
  onSeverityChange: (sev: 'all' | 'critical' | 'high') => void;
  totalArticlesCount: number;
  filteredArticlesCount: number;
  onResetFilters: () => void;
}

const PROVINCES: NepalProvince[] = [
  'Bagmati',
  'Koshi',
  'Madhesh',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
];

const PARTIES: PoliticalParty[] = [
  'Nepali Congress',
  'CPN-UML',
  'CPN (Maoist Centre)',
  'Rastriya Swatantra Party (RSP)',
  'Rastriya Prajatantra Party (RPP)',
  'Janata Samajbadi Party (JSP)',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedProvince,
  onProvinceChange,
  selectedParty,
  onPartyChange,
  selectedSeverity,
  onSeverityChange,
  totalArticlesCount,
  filteredArticlesCount,
  onResetFilters,
}) => {
  const isFiltered =
    selectedCategory !== 'all' ||
    selectedProvince !== 'all' ||
    selectedParty !== 'all' ||
    selectedSeverity !== 'all';

  return (
    <div className="bg-white border-b border-stone-200 py-3 px-4">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Row 1: Primary Categories and count */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-stone-500 mr-2 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Focus:
            </span>
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => onCategoryChange('politics')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'politics'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Political Movements
            </button>
            <button
              onClick={() => onCategoryChange('police_report')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'police_report'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Police Blotters & FIRs
            </button>
            <button
              onClick={() => onCategoryChange('displacement')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'displacement'
                  ? 'bg-rose-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Displaced Families
            </button>
            <button
              onClick={() => onCategoryChange('incident')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'incident'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Incidents & Bandhs
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-900">{filteredArticlesCount}</strong> of{' '}
              {totalArticlesCount} reports
            </span>
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Secondary dropdown-style filters (Provinces, Party, Severity) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 text-xs">
          {/* Province selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Province:</span>
            <select
              value={selectedProvince}
              onChange={(e) => onProvinceChange(e.target.value as NepalProvince | 'all')}
              className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
            >
              <option value="all">All 7 Provinces</option>
              {PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov} Province
                </option>
              ))}
            </select>
          </div>

          <span className="text-stone-300">·</span>

          {/* Political Party selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Political Party:</span>
            <select
              value={selectedParty}
              onChange={(e) => onPartyChange(e.target.value as PoliticalParty | 'all')}
              className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer max-w-[210px] truncate"
            >
              <option value="all">All Political Parties</option>
              {PARTIES.map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>

          <span className="text-stone-300">·</span>

          {/* Severity selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Urgency:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => onSeverityChange(e.target.value as 'all' | 'critical' | 'high')}
              className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
            >
              <option value="all">Any Urgency</option>
              <option value="critical">Critical Urgency Only</option>
              <option value="high">High & Critical</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
