import { NewsArticle, NepalProvince, PoliticalParty, NewsCategory } from '../types/news';

export interface ExtractedNewsData {
  title: string;
  summary: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  province: NepalProvince;
  district?: string;
  categories: NewsCategory[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  partiesInvolved: PoliticalParty[];
  policeReport?: {
    isPoliceReportMentioned: boolean;
    policeStationOrDivision: string;
    firNumber?: string;
    firStatus?: 'registered' | 'investigating' | 'chargesheet_filed' | 'remand_extended' | 'arrest_warrant';
    offenseType?: string;
    arrestsCount: number;
    seizedItems?: string[];
    remandDays?: number;
    officialStatement?: string;
  };
  displacement?: {
    isDisplacementIncident: boolean;
    familiesCount: number;
    individualsCount?: number;
    originLocation: string;
    currentShelterLocation: string;
    displacementCause: 'inter_party_violence' | 'land_dispute_political' | 'intimidation_and_threats' | 'strike_blockade_hardship' | 'communal_tension_partisan' | 'flooding_post_conflict_neglect';
    aidRequired: string[];
    reliefStatus: 'critical_no_aid' | 'partial_local_relief' | 'red_cross_deployed' | 'resettlement_negotiations' | 'safe_return_initiated';
  };
  nepaliKeywords: { term: string; transliteration: string; meaningEn: string }[];
  keyTakeaways: string[];
}

export function analyzeNewsText(rawText: string, titleHint?: string, sourceHint?: string): ExtractedNewsData {
  const text = rawText.toLowerCase();
  const title = titleHint || (rawText.split('\n')[0]?.trim() || 'Scraped News Report');
  
  // Detect Political Parties
  const parties: PoliticalParty[] = [];
  if (text.includes('congress') || text.includes('nc') || text.includes('deuba') || text.includes('gagan')) {
    parties.push('Nepali Congress');
  }
  if (text.includes('cpn-uml') || text.includes('uml') || text.includes('oli') || text.includes('chyasal')) {
    parties.push('CPN-UML');
  }
  if (text.includes('maoist') || text.includes('prachanda') || text.includes('dahal') || text.includes('ycl')) {
    parties.push('CPN (Maoist Centre)');
  }
  if (text.includes('swatantra') || text.includes('rsp') || text.includes('rabi') || text.includes('lamichhane')) {
    parties.push('Rastriya Swatantra Party (RSP)');
  }
  if (text.includes('prajatantra') || text.includes('rpp') || text.includes('lingden') || text.includes('monarchy')) {
    parties.push('Rastriya Prajatantra Party (RPP)');
  }
  if (text.includes('samajbadi') || text.includes('jsp') || text.includes('upendra yadav')) {
    parties.push('Janata Samajbadi Party (JSP)');
  }
  if (text.includes('janamat') || text.includes('ck raut')) {
    parties.push('Janamat Party');
  }

  // Detect Provinces & Districts
  let province: NepalProvince = 'National';
  let district = 'Kathmandu';

  if (text.includes('kathmandu') || text.includes('lalitpur') || text.includes('bhaktapur') || text.includes('dhading') || text.includes('chitwan') || text.includes('hetauda') || text.includes('bagmati')) {
    province = 'Bagmati';
    if (text.includes('lalitpur')) district = 'Lalitpur';
    else if (text.includes('dhading')) district = 'Dhading';
    else if (text.includes('chitwan')) district = 'Chitwan';
    else district = 'Kathmandu';
  } else if (text.includes('sarlahi') || text.includes('rautahat') || text.includes('birgunj') || text.includes('parsa') || text.includes('dhanusha') || text.includes('janakpur') || text.includes('madhesh') || text.includes('terai')) {
    province = 'Madhesh';
    if (text.includes('sarlahi')) district = 'Sarlahi';
    else if (text.includes('rautahat')) district = 'Rautahat';
    else if (text.includes('parsa') || text.includes('birgunj')) district = 'Parsa';
    else district = 'Dhanusha';
  } else if (text.includes('pokhara') || text.includes('kaski') || text.includes('gandaki') || text.includes('syangja') || text.includes('tanahun')) {
    province = 'Gandaki';
    district = 'Kaski';
  } else if (text.includes('butwal') || text.includes('rupandehi') || text.includes('banke') || text.includes('nepalgunj') || text.includes('dang') || text.includes('lumbini')) {
    province = 'Lumbini';
    if (text.includes('banke') || text.includes('nepalgunj')) district = 'Banke';
    else if (text.includes('dang')) district = 'Dang';
    else district = 'Rupandehi';
  } else if (text.includes('rukum') || text.includes('surkhet') || text.includes('karnali') || text.includes('jumla') || text.includes('jaajarkot')) {
    province = 'Karnali';
    if (text.includes('rukum')) district = 'Rukum West';
    else district = 'Surkhet';
  } else if (text.includes('bajhang') || text.includes('kailali') || text.includes('dhangadhi') || text.includes('sudurpashchim') || text.includes('kanchanpur')) {
    province = 'Sudurpashchim';
    if (text.includes('bajhang')) district = 'Bajhang';
    else district = 'Kailali';
  } else if (text.includes('biratnagar') || text.includes('morang') || text.includes('jhapa') || text.includes('koshi') || text.includes('sunsari')) {
    province = 'Koshi';
    if (text.includes('jhapa')) district = 'Jhapa';
    else district = 'Morang';
  }

  // Detect Police Blotter
  const policeKeywords = ['police', 'prahari', 'fir', 'cib', 'arrest', 'detained', 'chargesheet', 'remand', 'interrogation', 'spokesperson', 'offense', 'seized'];
  const hasPoliceMention = policeKeywords.some((kw) => text.includes(kw));

  // Extract Arrests Count regex
  let arrestsCount = 0;
  const arrestMatch = text.match(/(\d+)\s+(people|persons|individuals|suspects|cadres|demonstrators|accused)\s+(were\s+)?(arrested|detained|taken into custody|held)/i);
  if (arrestMatch && arrestMatch[1]) {
    arrestsCount = parseInt(arrestMatch[1], 10);
  } else if (text.includes('arrested') || text.includes('detained')) {
    arrestsCount = 2;
  }

  // Detect Displacement
  const displacementKeywords = ['displaced', 'displaces', 'evicted', 'fled', 'homeless', 'abandon', 'shelter', 'uprooted', 'bistaphit', 'makeshift'];
  const hasDisplacement = displacementKeywords.some((kw) => text.includes(kw));

  let familiesCount = 0;
  const famMatch = text.match(/(\d+)\s+families/i);
  if (famMatch && famMatch[1]) {
    familiesCount = parseInt(famMatch[1], 10);
  } else if (hasDisplacement) {
    familiesCount = 12;
  }

  // Determine Categories
  const categories: NewsCategory[] = [];
  if (parties.length > 0 || text.includes('parliament') || text.includes('election') || text.includes('minister') || text.includes('rally')) {
    categories.push('politics');
  }
  if (hasPoliceMention) {
    categories.push('police_report');
  }
  if (hasDisplacement) {
    categories.push('displacement');
  }
  if (text.includes('bandh') || text.includes('chakka jam') || text.includes('highway') || text.includes('protest') || text.includes('clash')) {
    categories.push('incident');
  }
  if (categories.length === 0) {
    categories.push('general');
  }

  // Severity Rating
  let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
  if (familiesCount >= 10 || (hasPoliceMention && arrestsCount >= 10) || text.includes('curfew') || text.includes('prohibitory')) {
    severity = 'critical';
  } else if (familiesCount > 0 || arrestsCount > 3 || text.includes('arson') || text.includes('chargesheet') || text.includes('tear gas')) {
    severity = 'high';
  } else if (parties.length > 1 || text.includes('protest') || text.includes('blockade')) {
    severity = 'medium';
  }

  // Build Takeaways
  const keyTakeaways: string[] = [];
  if (hasDisplacement && familiesCount > 0) {
    keyTakeaways.push(`${familiesCount} families internally displaced in ${district}; immediate shelter and relief monitoring underway.`);
  }
  if (parties.length > 0) {
    keyTakeaways.push(`Political movement involving ${parties.join(' and ')} in ${province}.`);
  }
  if (hasPoliceMention) {
    keyTakeaways.push(`Nepal Police registered reports and took ${arrestsCount > 0 ? arrestsCount : 'multiple'} individuals into custody.`);
  }
  if (keyTakeaways.length === 0) {
    keyTakeaways.push('Official report under ongoing civic monitoring across Nepal.');
  }

  // Build Nepali keywords
  const nepaliKeywords = [
    { term: 'प्रहरी (Prahari)', transliteration: 'Prahari', meaningEn: 'Nepal Police / Law enforcement personnel' },
    { term: 'जाहेरी (FIR)', transliteration: 'Jahari', meaningEn: 'First Information Report formal criminal complaint' },
    { term: 'विस्थापित (Bistaphit)', transliteration: 'Bistaphit', meaningEn: 'Internally displaced population' },
    { term: 'घेराउ (Gherao)', transliteration: 'Gherao', meaningEn: 'Civil protest surrounding an administrative office' },
  ];

  return {
    title,
    summary: rawText.slice(0, 220) + (rawText.length > 220 ? '...' : ''),
    content: rawText,
    sourceName: sourceHint || 'Scraped Media Portal',
    sourceUrl: 'https://kathmandupost.com/national',
    province,
    district,
    categories,
    severity,
    partiesInvolved: parties.length > 0 ? parties : ['Independent / Others'],
    policeReport: hasPoliceMention
      ? {
          isPoliceReportMentioned: true,
          policeStationOrDivision: `District Police Range ${district}`,
          firNumber: `FIR-${district.toUpperCase().slice(0, 3)}-2083/07-${Math.floor(100 + Math.random() * 900)}`,
          firStatus: 'investigating',
          offenseType: text.includes('arson') ? 'Arson and Public Damage' : text.includes('fraud') ? 'Fraud & Misappropriation' : 'Public Offense & Unlawful Assembly',
          arrestsCount,
          officialStatement: 'Law enforcement actively maintaining public order and documenting case records.',
        }
      : undefined,
    displacement: hasDisplacement
      ? {
          isDisplacementIncident: true,
          familiesCount,
          individualsCount: familiesCount * 4,
          originLocation: `${district} Local Ward`,
          currentShelterLocation: 'Temporary Community Outpost',
          displacementCause: text.includes('land') ? 'land_dispute_political' : 'inter_party_violence',
          aidRequired: ['Emergency food packets', 'Tarpaulin blankets', 'Potable water supply', 'Police security guard'],
          reliefStatus: 'critical_no_aid',
        }
      : undefined,
    nepaliKeywords,
    keyTakeaways,
  };
}

export function convertExtractedToArticle(data: ExtractedNewsData, customId?: string): NewsArticle {
  const id = customId || `art-${Date.now()}`;
  return {
    id,
    title: data.title,
    slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60),
    source: {
      name: data.sourceName,
      domain: data.sourceUrl ? new URL(data.sourceUrl.startsWith('http') ? data.sourceUrl : `https://${data.sourceUrl}`).hostname : 'nepal-portal.org',
      url: data.sourceUrl,
      reliabilityScore: 92,
    },
    publishedAt: new Date().toISOString(),
    author: 'Special Correspondent (Desk)',
    summary: data.summary,
    content: data.content,
    categories: data.categories,
    location: {
      province: data.province,
      district: data.district,
    },
    politicalContext: data.partiesInvolved.length > 0 ? {
      partiesInvolved: data.partiesInvolved,
      activityType: 'party_rally',
      keyLeaders: ['Provincial Coordinators', 'District Representatives'],
      stanceSummary: 'Active monitoring of cadre engagements and party statements.',
    } : undefined,
    policeReport: data.policeReport,
    displacement: data.displacement,
    severity: data.severity,
    nepaliKeywords: data.nepaliKeywords,
    readTimeMinutes: Math.max(2, Math.ceil(data.content.split(/\s+/).length / 180)),
    scrapedAt: new Date().toISOString(),
    scraperMethod: 'user_input',
    keyTakeaways: data.keyTakeaways,
  };
}
