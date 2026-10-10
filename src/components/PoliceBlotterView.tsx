import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle2, Search, ArrowRight, Gavel, Scale } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface PoliceBlotterViewProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const PoliceBlotterView: React.FC<PoliceBlotterViewProps> = ({
  articles,
  onSelectArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const policeArticles = articles.filter(
    (a) => a.policeReport && a.policeReport.isPoliceReportMentioned
  );

  const filtered = policeArticles.filter((a) => {
    const p = a.policeReport!;
    const matchStation = p.policeStationOrDivision.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFir = p.firNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchOffense = p.offenseType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTitle = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStation || matchFir || matchOffense || matchTitle;
  });

  const totalArrests = policeArticles.reduce(
    (acc, a) => acc + (a.policeReport?.arrestsCount || 0),
    0
  );

  const firCount = policeArticles.filter((a) => !!a.policeReport?.firNumber).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-indigo-700 font-bold uppercase tracking-wider text-xs mb-1">
          <ShieldAlert className="w-4 h-4 text-indigo-600" />
          <span>Nepal Police & Judicial Intelligence Blotter</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black font-editorial text-stone-900">
          Police Reports, FIRs & Court Remands Log
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl">
          Aggregating and structuring every First Information Report (FIR), arrest warrant, chargesheet, and official police statement mentioned across national and provincial news broadcasts in Nepal.
        </p>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Monitored Police Blotters
          </div>
          <div className="text-3xl font-black text-indigo-900 mt-1 font-editorial">
            {policeArticles.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">From DPO ranges and Valley divisions</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Formal FIRs Tagged
          </div>
          <div className="text-3xl font-black text-stone-900 mt-1 font-editorial">
            {firCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Verified case register numbers</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Individuals Apprehended
          </div>
          <div className="text-3xl font-black text-rose-700 mt-1 font-editorial">
            {totalArrests}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">In judicial or custodial detention</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Active Court Remands
          </div>
          <div className="text-lg font-bold text-stone-800 mt-2">
            District Courts Granted
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Sarlahi, Kaski, Parsa, Kathmandu</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold font-editorial text-stone-900">
          All Police blotter Records ({filtered.length})
        </h3>
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FIR, station, or offense..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>
      </div>

      {/* Grid of Police Reports */}
      <div className="space-y-4">
        {filtered.map((art) => {
          const p = art.policeReport!;
          return (
            <div
              key={art.id}
              className="bg-white rounded-lg border border-stone-200 p-5 hover:border-stone-400 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-bold text-indigo-900 uppercase tracking-wider">
                      {p.policeStationOrDivision}
                    </span>
                    {p.firNumber && (
                      <>
                        <span>·</span>
                        <span className="font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px]">
                          {p.firNumber}
                        </span>
                      </>
                    )}
                    {p.firStatus && (
                      <>
                        <span>·</span>
                        <span className="capitalize text-stone-600 font-medium">
                          Status: {p.firStatus.replace(/_/g, ' ')}
                        </span>
                      </>
                    )}
                  </div>

                  <h4
                    onClick={() => onSelectArticle(art)}
                    className="font-editorial font-bold text-lg text-stone-900 hover:text-indigo-800 transition-colors cursor-pointer leading-snug"
                  >
                    {art.title}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-500">Offense: </span>
                      <strong className="text-stone-800">{p.offenseType || 'General Offense'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500">Arrests Made: </span>
                      <strong className="text-stone-900">{p.arrestsCount} Persons</strong>
                    </div>
                    <div>
                      <span className="text-stone-500">Judicial Court: </span>
                      <span className="text-stone-800 font-medium">{p.courtName || 'District Administration Office'}</span>
                    </div>
                  </div>

                  {p.officialStatement && (
                    <p className="text-xs text-stone-600 italic bg-indigo-50/50 p-2.5 rounded border border-indigo-100">
                      Spokesperson Statement: "{p.officialStatement}"
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-2 pt-2 md:pt-0">
                  <span className="text-xs text-stone-400">
                    {new Date(art.publishedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onSelectArticle(art)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    <span>Read Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
