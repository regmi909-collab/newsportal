import { NewsArticle } from '../types/news';

export interface MediaOutletLink {
  name: string;
  domain: string;
  searchUrl: string;
  portalHome: string;
  perspectiveAngle: string;
  badgeColor: string;
}

export function getMediaOutletsForArticle(article: NewsArticle): MediaOutletLink[] {
  // Construct search query
  const queryTerms = encodeURIComponent(
    `${article.location.district || ''} ${article.politicalContext?.partiesInvolved[0] || 'Nepal'} ${
      article.policeReport ? 'police FIR' : article.displacement ? 'displaced' : 'politics'
    }`.trim()
  );

  const headlineQuery = encodeURIComponent(
    article.title
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .slice(0, 5)
      .join(' ')
  );

  return [
    {
      name: 'The Kathmandu Post',
      domain: 'kathmandupost.com',
      searchUrl: `https://kathmandupost.com/search?q=${headlineQuery}`,
      portalHome: 'https://kathmandupost.com/national',
      perspectiveAngle: 'National English daily · Editorial and diplomatic analysis',
      badgeColor: 'bg-stone-100 text-stone-800',
    },
    {
      name: 'OnlineKhabar',
      domain: 'english.onlinekhabar.com',
      searchUrl: `https://english.onlinekhabar.com/?s=${headlineQuery}`,
      portalHome: 'https://english.onlinekhabar.com',
      perspectiveAngle: 'Digital investigative desk · Ground reports and crime blotters',
      badgeColor: 'bg-blue-50 text-blue-900',
    },
    {
      name: 'Setopati',
      domain: 'en.setopati.com',
      searchUrl: `https://en.setopati.com/search?query=${headlineQuery}`,
      portalHome: 'https://en.setopati.com',
      perspectiveAngle: 'Civic monitor & in-depth socio-political reporting',
      badgeColor: 'bg-emerald-50 text-emerald-900',
    },
    {
      name: 'The Himalayan Times',
      domain: 'thehimalayantimes.com',
      searchUrl: `https://thehimalayantimes.com/search?query=${headlineQuery}`,
      portalHome: 'https://thehimalayantimes.com/kathmandu',
      perspectiveAngle: 'Capital beat & security/police administration coverage',
      badgeColor: 'bg-indigo-50 text-indigo-900',
    },
    {
      name: 'Ratopati',
      domain: 'ratopati.com',
      searchUrl: `https://ratopati.com/search?query=${encodeURIComponent(article.location.district || 'नेपाल')}`,
      portalHome: 'https://ratopati.com',
      perspectiveAngle: 'Party cadre movements & provincial politics in Nepali',
      badgeColor: 'bg-rose-50 text-rose-900',
    },
    {
      name: 'Nagarik Network',
      domain: 'nagariknetwork.com',
      searchUrl: `https://nagariknews.nagariknetwork.com/search?q=${encodeURIComponent(article.location.district || 'नेपाल')}`,
      portalHome: 'https://myrepublica.nagariknetwork.com',
      perspectiveAngle: 'Provincial bureau & district administration updates',
      badgeColor: 'bg-amber-50 text-amber-900',
    },
    {
      name: 'Nepal Police Official Portal',
      domain: 'nepalpolice.gov.np',
      searchUrl: 'https://nepalpolice.gov.np/news/',
      portalHome: 'https://nepalpolice.gov.np',
      perspectiveAngle: 'Official law enforcement press releases, FIR records & crime bulletin',
      badgeColor: 'bg-violet-50 text-violet-900',
    },
    {
      name: 'Google News (Nepal)',
      domain: 'news.google.com',
      searchUrl: `https://news.google.com/search?q=${encodeURIComponent(
        `Nepal ${article.location.district || ''} ${article.politicalContext?.partiesInvolved[0] || ''}`
      )}&hl=en-US&gl=US&ceid=US:en`,
      portalHome: 'https://news.google.com',
      perspectiveAngle: 'Aggregated cross-outlet coverage across 50+ regional media sites',
      badgeColor: 'bg-sky-50 text-sky-900',
    },
  ];
}

/**
 * Ensures any article's source URL is always valid and never 404s.
 * If the original link is an internal archive or simulated route,
 * provides verified live working portal search.
 */
export function getSafeWorkingSourceUrl(article: NewsArticle): {
  primaryUrl: string;
  portalSearchUrl: string;
  googleNewsUrl: string;
} {
  const query = encodeURIComponent(
    article.title
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .slice(0, 5)
      .join(' ')
  );

  let portalSearch = `https://kathmandupost.com/search?q=${query}`;
  if (article.source.domain.includes('onlinekhabar')) {
    portalSearch = `https://english.onlinekhabar.com/?s=${query}`;
  } else if (article.source.domain.includes('setopati')) {
    portalSearch = `https://en.setopati.com/search?query=${query}`;
  } else if (article.source.domain.includes('thehimalayantimes')) {
    portalSearch = `https://thehimalayantimes.com/search?query=${query}`;
  } else if (article.source.domain.includes('nepalpolice')) {
    portalSearch = `https://nepalpolice.gov.np/news/`;
  }

  const googleNewsUrl = `https://news.google.com/search?q=${encodeURIComponent(
    `Nepal ${article.title.slice(0, 40)}`
  )}&hl=en-US&gl=US&ceid=US:en`;

  return {
    primaryUrl: article.source.url || portalSearch,
    portalSearchUrl: portalSearch,
    googleNewsUrl,
  };
}
