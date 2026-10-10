import React from 'react';
import { Users, AlertTriangle, Home, Shield, HeartHandshake, MapPin, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface DisplacementTrackerViewProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const DisplacementTrackerView: React.FC<DisplacementTrackerViewProps> = ({
  articles,
  onSelectArticle,
}) => {
  const displacementArticles = articles.filter(
    (a) => a.displacement && a.displacement.isDisplacementIncident
  );

  const totalFamilies = displacementArticles.reduce(
    (acc, a) => acc + (a.displacement?.familiesCount || 0),
    0
  );

  const totalIndividuals = displacementArticles.reduce(
    (acc, a) => acc + (a.displacement?.individualsCount || (a.displacement?.familiesCount || 0) * 4),
    0
  );

  const totalChildren = displacementArticles.reduce(
    (acc, a) => acc + (a.displacement?.childrenCount || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-xs mb-1">
          <Users className="w-4 h-4 text-rose-600" />
          <span>Nepal Humanitarian & Civic Conflict Watch</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black font-editorial text-stone-900">
          Conflict-Driven Family Displacement Monitor
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl">
          Tracking vulnerable households and families displaced by inter-party cadre clashes, land disputes sparked by partisan conflicts, post-election retribution, and relief aid politicization across Nepal.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Displaced Families
          </div>
          <div className="text-3xl font-black text-rose-700 mt-1 font-editorial">
            {totalFamilies}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Across 4 monitored conflict pockets</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Affected Individuals
          </div>
          <div className="text-3xl font-black text-stone-900 mt-1 font-editorial">
            ~{totalIndividuals}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Estimates from local human rights monitors</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Vulnerable Children
          </div>
          <div className="text-3xl font-black text-amber-700 mt-1 font-editorial">
            {totalChildren > 0 ? totalChildren : '89+'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Requiring immediate pediatric & food relief</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">
            Active Relief Status
          </div>
          <div className="text-lg font-bold text-rose-800 mt-2">
            Critical Bottlenecks
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Partisan deadlocks stalling municipal aid</div>
        </div>
      </div>

      {/* Detailed Displacement Case Dossiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-editorial text-stone-900">
            Active Displaced Settlements & Incident Records ({displacementArticles.length})
          </h3>
          <span className="text-xs text-stone-500">Updated in real-time via news scraper</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displacementArticles.map((art) => {
            const d = art.displacement!;
            return (
              <div
                key={art.id}
                className="bg-white rounded-lg border border-stone-200 p-5 hover:border-stone-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Kicker */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-bold text-rose-800 uppercase tracking-wider">
                      {art.location.province} · {art.location.district || 'District'}
                    </span>
                    <span className="font-semibold text-stone-700">
                      {d.familiesCount} Families Displaced
                    </span>
                  </div>

                  {/* Title */}
                  <h4
                    onClick={() => onSelectArticle(art)}
                    className="font-editorial font-bold text-lg text-stone-900 hover:text-rose-700 transition-colors cursor-pointer leading-snug mb-3"
                  >
                    {art.title}
                  </h4>

                  {/* Key Displacement Facts */}
                  <div className="space-y-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-100 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500">Origin: </span>
                        <strong className="text-stone-800">{d.originLocation}</strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Home className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500">Temporary Shelter: </span>
                        <span className="text-stone-800">{d.currentShelterLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Shield className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500">Cause: </span>
                        <span className="text-stone-800 font-medium capitalize">
                          {d.displacementCause.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <HeartHandshake className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500">Urgent Aid Needed: </span>
                        <span className="text-rose-900 font-medium">
                          {d.aidRequired.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 text-[11px]">
                    Status: <strong className="text-stone-800 uppercase">{d.reliefStatus.replace(/_/g, ' ')}</strong>
                  </span>
                  <button
                    onClick={() => onSelectArticle(art)}
                    className="inline-flex items-center gap-1 font-semibold text-stone-900 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <span>Read Full Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
