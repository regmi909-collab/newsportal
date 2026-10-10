import React, { useState } from 'react';
import { NepalProvince, PoliticalParty, NewsCategory } from '../types/news';
import { SlidersHorizontal, RotateCcw, Calendar, Search, ExternalLink, Globe } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: NewsCategory | 'all';
  onCategoryChange: (cat: NewsCategory | 'all') => void;
  selectedProvince: NepalProvince | 'all';
  onProvinceChange: (prov: NepalProvince | 'all') => void;
  selectedParty: PoliticalParty | 'all';
  onPartyChange: (party: PoliticalParty | 'all') => void;
  selectedSeverity: 'all' | 'critical' | 'high';
  onSeverityChange: (sev: 'all' | 'critical' | 'high') => void;
  datePeriod: 'all' | '2026' | '2025' | '2024' | 'month' | 'custom';
  onDatePeriodChange: (period: 'all' | '2026' | '2025' | '2024' | 'month' | 'custom') => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  totalArticlesCount: number;
  filteredArticlesCount: number;
  onResetFilters: () => void;
  searchKeyword?: string;
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
  datePeriod,
  onDatePeriodChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  totalArticlesCount,
  filteredArticlesCount,
  onResetFilters,
  searchKeyword = '',
}) => {
  const [showPortalSearchModal, setShowPortalSearchModal] = useState(false);

  const isFiltered =
    selectedCategory !== 'all' ||
    selectedProvince !== 'all' ||
    selectedParty !== 'all' ||
    selectedSeverity !== 'all' ||
    datePeriod !== 'all' ||
    fromDate !== '' ||
    toDate !== '';

  // Generate external date-bounded search links for news portals
  const effectiveKeyword = searchKeyword.trim() || 'Nepal politics';
  const effectiveFrom = fromDate || (datePeriod === '2026' ? '2026-01-01' : datePeriod === '2025' ? '2025-01-01' : datePeriod === '2024' ? '2024-01-01' : '2025-01-01');
  const effectiveTo = toDate || (datePeriod === '2026' ? '2026-12-31' : datePeriod === '2025' ? '2025-12-31' : datePeriod === '2024' ? '2024-12-31' : new Date().toISOString().slice(0, 10));

  const portalDateSearches = [
    {
      portal: 'Google News (Date-Filtered Archive)',
      url: `https://news.google.com/search?q=${encodeURIComponent(`${effectiveKeyword} after:${effectiveFrom} before:${effectiveTo}`)}`,
      desc: `Search Google News archives strictly between ${effectiveFrom} and ${effectiveTo}`,
    },
    {
      portal: 'The Kathmandu Post',
      url: `https://kathmandupost.com/search?q=${encodeURIComponent(effectiveKeyword)}`,
      desc: 'National daily politics and diplomacy coverage',
    },
    {
      portal: 'OnlineKhabar English',
      url: `https://english.onlinekhabar.com/?s=${encodeURIComponent(effectiveKeyword)}`,
      desc: 'Digital investigative desk and crime blotters',
    },
    {
      portal: 'Setopati English',
      url: `https://en.setopati.com/search?query=${encodeURIComponent(effectiveKeyword)}`,
      desc: 'Conflict, governance & social reporting',
    },
    {
      portal: 'The Himalayan Times',
      url: `https://thehimalayantimes.com/search?query=${encodeURIComponent(effectiveKeyword)}`,
      desc: 'Security, law enforcement and national desk',
    },
    {
      portal: 'Ratopati (नेपाली)',
      url: `https://ratopati.com/search?query=${encodeURIComponent(effectiveKeyword)}`,
      desc: 'Provincial politics and party cadre movements in Nepali',
    },
  ];

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
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Secondary dropdown-style filters (Provinces, Party, Year Period, Severity) */}
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
            <span className="text-stone-400">Party:</span>
            <select
              value={selectedParty}
              onChange={(e) => onPartyChange(e.target.value as PoliticalParty | 'all')}
              className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer max-w-[190px] truncate"
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

          {/* Year Period / Date Range filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-500" />
              Year / Period:
            </span>
            <select
              value={datePeriod}
              onChange={(e) => onDatePeriodChange(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
            >
              <option value="all">All Years & Dates</option>
              <option value="2026">Year 2026 (2082/83 BS)</option>
              <option value="2025">Year 2025 (2081/82 BS)</option>
              <option value="2024">Year 2024 (2080/81 BS)</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Date Range (From - To)</option>
            </select>
          </div>

          {/* If Custom Date Range selected: show From and To inputs */}
          {datePeriod === 'custom' && (
            <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
              <span className="text-stone-500 text-[11px]">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="bg-white border border-stone-200 rounded px-1.5 py-0.5 text-xs text-stone-800 focus:outline-none"
              />
              <span className="text-stone-500 text-[11px]">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                className="bg-white border border-stone-200 rounded px-1.5 py-0.5 text-xs text-stone-800 focus:outline-none"
              />
            </div>
          )}

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

          {/* Button to search external news portals for this date period */}
          <button
            onClick={() => setShowPortalSearchModal(true)}
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md font-semibold text-xs transition-colors cursor-pointer"
            title="Search news portals for this date period"
          >
            <Globe className="w-3 h-3 text-emerald-600" />
            <span>Search Portals By Date Range</span>
          </button>
        </div>
      </div>

      {/* Date Period Portal Search Modal */}
      {showPortalSearchModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 p-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Search Nepali News Portals by Date Period
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Period: <strong>{effectiveFrom}</strong> to <strong>{effectiveTo}</strong>
                  {searchKeyword ? ` · Keyword: "${searchKeyword}"` : ''}
                </p>
              </div>
              <button
                onClick={() => setShowPortalSearchModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {portalDateSearches.map((portal, idx) => (
                <a
                  key={idx}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-colors block text-xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 group-hover:text-rose-700">
                      {portal.portal}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{portal.desc}</div>
                </a>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowPortalSearchModal(false)}
                className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
