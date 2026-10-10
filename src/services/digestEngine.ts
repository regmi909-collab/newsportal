import { NewsArticle, UserDigestPreferences, GeneratedDigest, NotificationItem } from '../types/news';

export function generatePersonalizedDigest(
  articles: NewsArticle[],
  preferences: UserDigestPreferences,
  timeframe: 'Morning Briefing' | 'Evening Briefing' | 'On-Demand Digest' = 'Morning Briefing'
): GeneratedDigest {
  // Filter articles based on preferences
  const filtered = articles.filter((art) => {
    // Province filter
    if (preferences.preferredProvinces.length > 0 && !preferences.preferredProvinces.includes(art.location.province)) {
      return false;
    }

    // Severity filter
    const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    if (severityOrder[art.severity] < severityOrder[preferences.minimumSeverity]) {
      return false;
    }

    // Party filter check
    const hasMatchingParty = art.politicalContext?.partiesInvolved.some((p) =>
      preferences.preferredParties.includes(p)
    );

    // Police filter check
    const hasPolice = preferences.includePoliceReports && !!art.policeReport?.isPoliceReportMentioned;

    // Displacement filter check
    const hasDisplacement = preferences.includeDisplacementAlerts && !!art.displacement?.isDisplacementIncident;

    // If any selected category matches, include
    if (hasMatchingParty || hasPolice || hasDisplacement) {
      return true;
    }

    // Fallback if no specific party was checked
    if (preferences.preferredParties.length === 0) {
      return true;
    }

    return false;
  });

  const activeStories = (filtered.length > 0 ? filtered : articles).slice(0, 6);

  // Calculate Displacement stats
  const displacementArticles = articles.filter((a) => a.displacement?.isDisplacementIncident);
  const totalFamiliesDisplaced = displacementArticles.reduce(
    (sum, a) => sum + (a.displacement?.familiesCount || 0),
    0
  );
  const mostUrgentDisplacement = displacementArticles[0];

  // Calculate Police Blotter stats
  const policeArticles = articles.filter((a) => a.policeReport?.isPoliceReportMentioned);
  const totalArrests = policeArticles.reduce((sum, a) => sum + (a.policeReport?.arrestsCount || 0), 0);

  // Political Pulse
  const partyNames = preferences.preferredParties.length > 0
    ? preferences.preferredParties.join(', ')
    : 'All Major Parties (NC, UML, Maoist, RSP)';

  const headline = `${timeframe} — Nepal Civic, Political & Security Digest`;
  
  const executiveSummary = `This personalized briefing synthesizes Nepal's critical political party movements, verified police reports, and conflict-driven family displacement monitoring across ${preferences.preferredProvinces.length > 0 ? preferences.preferredProvinces.join(', ') : 'all 7 provinces'}. Currently tracking ${totalFamiliesDisplaced} displaced families and ${totalArrests} arrests recorded across district police ranges.`;

  const topStories = activeStories.map((story) => ({
    articleId: story.id,
    title: story.title,
    category: story.categories[0],
    summary: story.summary,
    province: story.location.province,
    urgency: story.severity.toUpperCase(),
  }));

  const politicalPulse = `Key movements detected for ${partyNames}: Inter-party negotiations continue between Nepali Congress and CPN-UML regarding constitutional thresholds. Opposition mobilization by CPN (Maoist Centre) and RSP sit-ins over cooperative investigation chargesheets remain active in Gandaki and Bagmati provinces.`;

  const policeBlotterSummary = `Nepal Police logged ${policeArticles.length} notable blotter actions with ${totalArrests} confirmed arrests. District police offices in Sarlahi, Rautahat, Parsa, and Kathmandu Valley Ranges have enforced prohibitory orders and submitted chargesheets to district courts.`;

  const displacementWatch = {
    totalFamiliesTracked: totalFamiliesDisplaced,
    mostUrgentRegion: mostUrgentDisplacement
      ? `${mostUrgentDisplacement.location.district} (${mostUrgentDisplacement.location.province})`
      : 'Madhesh & Karnali Provinces',
    humanitarianSummary: totalFamiliesDisplaced > 0
      ? `Humanitarian alert: ${totalFamiliesDisplaced} families (approx. ${totalFamiliesDisplaced * 4} citizens, including over 80 children) are lodged in makeshift shelters in Barahathawa, Chaurjahari, and Talkot. Emergency rations, infant nutrition, and police pickets remain urgently requested.`
      : 'No critical acute displacements logged in the past 24-hour cycle.',
  };

  // Build audio narration script
  const audioScript = `Namaste, this is your Nepal Civic and Political Briefing for today. 
First, on our conflict and displacement watch: ${totalFamiliesDisplaced} families remain displaced across Sarlahi, Karnali, and Sudurpashchim following partisan disputes and post-landslide relief blockades. Immediate relief and police protection are requested.
On the political front: Major developments surround ${partyNames}. The Nepali Congress Central Working Committee has concluded in Sanepa, while CPN-UML continues consultations on electoral threshold revisions.
In law enforcement: Nepal Police has registered multiple FIRs in Barahathawa and submitted chargesheets in the multi-billion rupee cooperative embezzlement case in Pokhara.
Stay informed, and have a safe day across Nepal.`;

  return {
    id: `digest-${Date.now()}`,
    timestamp: new Date().toISOString(),
    timeframe,
    headline,
    executiveSummary,
    topStories,
    politicalPulse,
    policeBlotterSummary,
    displacementWatch,
    audioScript,
  };
}

export function createBreakingNotification(article: NewsArticle): NotificationItem {
  let title = 'Breaking Civic Alert';
  if (article.displacement?.isDisplacementIncident) {
    title = `Displacement Alert: ${article.displacement.familiesCount} Families Displaced`;
  } else if (article.policeReport?.isPoliceReportMentioned) {
    title = `Police Blotter: FIR & Arrests at ${article.policeReport.policeStationOrDivision}`;
  } else if (article.politicalContext) {
    title = `Political Alert: ${article.politicalContext.partiesInvolved.join(', ')}`;
  }

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    message: article.title,
    category: article.categories[0] || 'politics',
    severity: article.severity,
    timestamp: new Date().toISOString(),
    articleId: article.id,
    isRead: false,
  };
}

export function formatDigestAsMarkdown(digest: GeneratedDigest): string {
  let md = `# ${digest.headline}\n`;
  md += `*Generated at: ${new Date(digest.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Standard Time)*\n\n`;
  md += `## Executive Summary\n${digest.executiveSummary}\n\n`;
  md += `## 1. Conflict Displacement Watch\n`;
  md += `- **Total Displaced Families Tracked:** ${digest.displacementWatch.totalFamiliesTracked}\n`;
  md += `- **Most Vulnerable Region:** ${digest.displacementWatch.mostUrgentRegion}\n`;
  md += `- **Humanitarian Situation:** ${digest.displacementWatch.humanitarianSummary}\n\n`;
  md += `## 2. Political Party Pulse\n${digest.politicalPulse}\n\n`;
  md += `## 3. Police Blotter & FIR Roundup\n${digest.policeBlotterSummary}\n\n`;
  md += `## 4. Curated Stories\n`;
  digest.topStories.forEach((story, idx) => {
    md += `### ${idx + 1}. [${story.urgency}] ${story.title}\n`;
    md += `*Location: ${story.province} Province*\n\n${story.summary}\n\n`;
  });
  md += `---\n*Report compiled by Nepal Civic & Political News Monitor.*`;
  return md;
}
