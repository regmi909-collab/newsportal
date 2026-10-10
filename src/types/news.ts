export type NepalProvince =
  | 'Bagmati'
  | 'Koshi'
  | 'Madhesh'
  | 'Gandaki'
  | 'Lumbini'
  | 'Karnali'
  | 'Sudurpashchim'
  | 'National';

export type PoliticalParty =
  | 'Nepali Congress'
  | 'CPN-UML'
  | 'CPN (Maoist Centre)'
  | 'Rastriya Swatantra Party (RSP)'
  | 'Rastriya Prajatantra Party (RPP)'
  | 'Janata Samajbadi Party (JSP)'
  | 'CPN (Unified Socialist)'
  | 'Nagrik Unmukti Party'
  | 'Janamat Party'
  | 'Independent / Others';

export type NewsCategory =
  | 'politics'
  | 'police_report'
  | 'displacement'
  | 'incident'
  | 'general';

export interface PoliticalContext {
  partiesInvolved: PoliticalParty[];
  activityType:
    | 'coalition_meeting'
    | 'parliament_debate'
    | 'party_rally'
    | 'cadre_clash'
    | 'internal_convention'
    | 'press_statement'
    | 'protest_dharna'
    | 'election_campaign';
  keyLeaders: string[];
  factionDetails?: string;
  stanceSummary?: string;
}

export interface PoliceReportDetail {
  isPoliceReportMentioned: boolean;
  policeStationOrDivision: string;
  firNumber?: string;
  firStatus?: 'registered' | 'investigating' | 'chargesheet_filed' | 'remand_extended' | 'arrest_warrant';
  offenseType?: string;
  arrestsCount: number;
  seizedItems?: string[];
  remandDays?: number;
  officialStatement?: string;
  courtName?: string;
}

export interface DisplacementDetail {
  isDisplacementIncident: boolean;
  familiesCount: number;
  individualsCount?: number;
  originLocation: string;
  currentShelterLocation: string;
  displacementCause:
    | 'inter_party_violence'
    | 'land_dispute_political'
    | 'intimidation_and_threats'
    | 'strike_blockade_hardship'
    | 'communal_tension_partisan'
    | 'flooding_post_conflict_neglect';
  aidRequired: string[];
  reliefStatus:
    | 'critical_no_aid'
    | 'partial_local_relief'
    | 'red_cross_deployed'
    | 'resettlement_negotiations'
    | 'safe_return_initiated';
  childrenCount?: number;
  elderlyCount?: number;
}

export interface NepaliGlossaryItem {
  term: string;
  transliteration: string;
  meaningEn: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleNepali?: string;
  slug: string;
  source: {
    name: string;
    domain: string;
    url: string;
    reliabilityScore: number;
  };
  publishedAt: string;
  author: string;
  summary: string;
  content: string;
  categories: NewsCategory[];
  location: {
    province: NepalProvince;
    district?: string;
    municipalityOrArea?: string;
    coordinates?: [number, number];
  };
  politicalContext?: PoliticalContext;
  policeReport?: PoliceReportDetail;
  displacement?: DisplacementDetail;
  contentNepali?: string;
  summaryNepali?: string;
  relatedMediaCoverage?: {
    mediaName: string;
    mediaDomain: string;
    url: string;
    headline: string;
    angle: string;
    publishedDate?: string;
  }[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  nepaliKeywords: NepaliGlossaryItem[];
  readTimeMinutes: number;
  imageUrl?: string;
  isBookmarked?: boolean;
  scrapedAt: string;
  scraperMethod: 'rss' | 'live_web' | 'curated_feed' | 'user_input';
  keyTakeaways?: string[];
  keyTakeawaysNepali?: string[];
}

export interface UserDigestPreferences {
  enabled: boolean;
  frequency: 'morning' | 'evening' | 'both';
  preferredParties: PoliticalParty[];
  includePoliceReports: boolean;
  includeDisplacementAlerts: boolean;
  preferredProvinces: NepalProvince[];
  minimumSeverity: 'low' | 'medium' | 'high' | 'critical';
  browserNotifications: boolean;
  emailDigestAddress?: string;
}

export interface GeneratedDigest {
  id: string;
  timestamp: string;
  timeframe: 'Morning Briefing' | 'Evening Briefing' | 'On-Demand Digest';
  headline: string;
  executiveSummary: string;
  topStories: {
    articleId: string;
    title: string;
    category: NewsCategory;
    summary: string;
    province: NepalProvince;
    urgency: string;
  }[];
  politicalPulse: string;
  policeBlotterSummary: string;
  displacementWatch: {
    totalFamiliesTracked: number;
    mostUrgentRegion: string;
    humanitarianSummary: string;
  };
  audioScript: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NewsCategory;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  articleId?: string;
  isRead: boolean;
}

export interface ScraperSource {
  id: string;
  name: string;
  url: string;
  feedType: 'rss' | 'html' | 'police_portal';
  frequencyMinutes: number;
  lastScraped?: string;
  articlesFound: number;
  status: 'active' | 'syncing' | 'idle' | 'error';
  categoryFocus: string;
}

export interface ScraperLog {
  id: string;
  timestamp: string;
  sourceName: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  articlesParsed: number;
}
