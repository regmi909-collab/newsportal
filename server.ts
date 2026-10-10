import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { analyzeNewsText, convertExtractedToArticle } from './src/services/scraperEngine';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: !!apiKey,
      serverTime: new Date().toISOString(),
      nepalTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }),
    });
  });

  // URL Scraper endpoint
  app.post('/api/scrape/url', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Valid URL is required.' });
      }

      // Fetch external URL
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        return res.status(502).json({
          error: `Failed to fetch target URL: HTTP status ${response.status}`,
        });
      }

      const html = await response.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      let pageTitle = titleMatch ? titleMatch[1].trim() : 'Scraped Article';
      pageTitle = pageTitle.replace(/\s*[-|–]\s*(The Kathmandu Post|OnlineKhabar|Setopati|Kantipur|MyRepublica).*$/i, '');

      // Strip tags to get clean paragraphs
      const bodyClean = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
        .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
        .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '');

      // Extract p tags
      const pMatches = bodyClean.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
      const paragraphs = pMatches
        .map((p) => p.replace(/<[^>]+>/g, '').trim())
        .filter((text) => text.length > 40 && !text.includes('Copyright') && !text.includes('Cookie'));

      const cleanContent = paragraphs.join('\n\n') || html.replace(/<[^>]+>/g, ' ').slice(0, 3000);

      // Analyze news text
      const extracted = analyzeNewsText(cleanContent, pageTitle, new URL(url).hostname);
      extracted.sourceUrl = url;
      const article = convertExtractedToArticle(extracted);

      res.json({
        success: true,
        article,
        charCount: cleanContent.length,
        paragraphsExtracted: paragraphs.length,
      });
    } catch (err: any) {
      console.error('Scrape error:', err);
      res.status(500).json({
        error: err.message || 'Scraping failed',
      });
    }
  });

  // AI-powered analysis endpoint using gemini-3.8-flash
  app.post('/api/ai/analyze', async (req, res) => {
    const { text, title } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'News text is required.' });
    }

    if (ai) {
      try {
        const prompt = `You are a specialist news analyst for Nepal political and civic affairs. Analyze the following news report from Nepal and return a STRICT JSON object with these keys:
{
  "title": "Clear concise English title",
  "summary": "2-3 sentence executive summary",
  "province": "Bagmati" | "Koshi" | "Madhesh" | "Gandaki" | "Lumbini" | "Karnali" | "Sudurpashchim" | "National",
  "district": "district name in Nepal",
  "categories": array of ["politics" | "police_report" | "displacement" | "incident" | "general"],
  "severity": "critical" | "high" | "medium" | "low",
  "partiesInvolved": array of ["Nepali Congress", "CPN-UML", "CPN (Maoist Centre)", "Rastriya Swatantra Party (RSP)", "Rastriya Prajatantra Party (RPP)", "Janata Samajbadi Party (JSP)", "CPN (Unified Socialist)", "Janamat Party", "Independent / Others"],
  "policeReport": {
    "isPoliceReportMentioned": boolean,
    "policeStationOrDivision": string,
    "firNumber": string or null,
    "firStatus": "registered" | "investigating" | "chargesheet_filed" | "remand_extended" | "arrest_warrant" | null,
    "offenseType": string or null,
    "arrestsCount": number,
    "officialStatement": string or null
  },
  "displacement": {
    "isDisplacementIncident": boolean,
    "familiesCount": number,
    "individualsCount": number,
    "originLocation": string,
    "currentShelterLocation": string,
    "displacementCause": "inter_party_violence" | "land_dispute_political" | "intimidation_and_threats" | "strike_blockade_hardship" | "communal_tension_partisan" | "flooding_post_conflict_neglect",
    "aidRequired": array of strings,
    "reliefStatus": "critical_no_aid" | "partial_local_relief" | "red_cross_deployed" | "resettlement_negotiations" | "safe_return_initiated"
  },
  "keyTakeaways": array of 3 bullet points,
  "nepaliKeywords": array of objects with { "term": string, "transliteration": string, "meaningEn": string }
}

Article Title: ${title || 'News Item'}
Article Body:
${text.slice(0, 4000)}

Output raw JSON only. No markdown formatting.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const reply = geminiRes.text || '{}';
        const cleaned = reply.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return res.json({
          success: true,
          method: 'gemini-3.8-flash',
          data: parsed,
        });
      } catch (geminiError) {
        console.warn('Gemini extraction failed, falling back to local NLP:', geminiError);
      }
    }

    // Heuristic NLP fallback
    const fallback = analyzeNewsText(text, title);
    res.json({
      success: true,
      method: 'heuristic_nlp',
      data: fallback,
    });
  });

  // Daily Digest AI generation endpoint
  app.post('/api/ai/daily-digest', async (req, res) => {
    const { articles, preferences, timeframe } = req.body;
    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: 'Articles array is required.' });
    }

    // If Gemini is available, we can synthesize a high-caliber journalistic summary
    if (ai) {
      try {
        const context = articles.slice(0, 10).map((a: any) => `- [${a.location?.province}] ${a.title}: ${a.summary}`).join('\n');
        const prompt = `You are the Chief Editor of the Nepal Civic & Political Monitor.
Generate an executive briefing in JSON for Nepal standard time today.
Preference focus: Parties: ${preferences?.preferredParties?.join(', ') || 'All'}; Police Reports: ${preferences?.includePoliceReports}; Displaced Families: ${preferences?.includeDisplacementAlerts}.
Articles available:
${context}

Return JSON with:
{
  "executiveSummary": "3-4 sentences synthesizing national political temperature, police actions, and displaced families status",
  "politicalPulse": "2 sentences focusing on party coalitions and movements",
  "policeBlotterSummary": "2 sentences on law enforcement and FIRs",
  "audioScript": "Spoken radio news script for 90 seconds reading in conversational broadcast tone"
}
Output raw JSON only.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        const reply = (geminiRes.text || '{}').replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(reply);
        return res.json({ success: true, aiGenerated: true, data: parsed });
      } catch (err) {
        console.warn('Gemini digest generation fallback:', err);
      }
    }

    res.json({ success: true, aiGenerated: false });
  });

  // Dedicated AI Translation endpoint for stories
  app.post('/api/ai/translate', async (req, res) => {
    const { title, summary, content, takeaways } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    if (ai) {
      try {
        const prompt = `You are a professional bilingual journalist for Nepal's leading newspapers.
Translate the following news article into natural, professional Nepali (देवनागरी लिपि).
Use standard Nepali journalistic terms (e.g., जाहेरी for FIR, विस्थापित for displaced, निषेधाज्ञा for prohibitory order, मन्थन/छलफल for deliberation).

Title: ${title}
Summary: ${summary}
Content: ${content}
Takeaways: ${JSON.stringify(takeaways || [])}

Return a STRICT JSON object only with these exact keys:
{
  "titleNepali": "नेपाली शीर्षक",
  "summaryNepali": "नेपालीमा संक्षिप्त सार (२-३ वाक्य)",
  "contentNepali": "नेपालीमा सम्पूर्ण समाचार विवरण (अनुच्छेदहरू बीच \\n\\n राख्नुहोस्)",
  "keyTakeawaysNepali": ["मुख्य बुँदा १", "मुख्य बुँदा २", "मुख्य बुँदा ३"]
}
Output raw JSON only. Do not add markdown or backticks.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const reply = (geminiRes.text || '{}').replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(reply);
        return res.json({ success: true, translation: parsed });
      } catch (err) {
        console.warn('Gemini translation error:', err);
      }
    }

    // Fallback translation response
    res.json({
      success: true,
      translation: {
        titleNepali: title,
        summaryNepali: summary,
        contentNepali: content,
        keyTakeawaysNepali: takeaways || [],
      },
    });
  });

  // Live RSS feed aggregator from Nepali news portals
  app.get('/api/scrape/live-feeds', async (req, res) => {
    const feeds = [
      { name: 'OnlineKhabar English', url: 'https://english.onlinekhabar.com/feed', domain: 'english.onlinekhabar.com' },
      { name: 'The Himalayan Times', url: 'https://thehimalayantimes.com/feed', domain: 'thehimalayantimes.com' },
    ];

    const scrapedArticles: any[] = [];

    for (const feed of feeds) {
      try {
        const response = await fetch(feed.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NepalNewsMonitor/1.0)' },
          signal: AbortSignal.timeout(6000),
        });

        if (response.ok) {
          const xml = await response.text();
          const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

          for (const itemXml of items.slice(0, 3)) {
            const titleMatch = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
            const linkMatch = itemXml.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
            const descMatch = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
            const pubDateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);

            if (titleMatch && linkMatch) {
              const itemTitle = titleMatch[1].replace(/<[^>]+>/g, '').trim();
              const itemLink = linkMatch[1].trim();
              const rawDesc = (descMatch ? descMatch[1] : '').replace(/<[^>]+>/g, ' ').trim();
              const itemDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

              const analyzed = analyzeNewsText(rawDesc + '\n\n' + itemTitle, itemTitle, feed.domain);
              analyzed.sourceUrl = itemLink;
              analyzed.sourceName = feed.name;

              const art = convertExtractedToArticle(analyzed, `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
              art.publishedAt = itemDate;
              scrapedArticles.push(art);
            }
          }
        }
      } catch (feedErr) {
        console.warn(`Feed ${feed.name} fetch skipped:`, feedErr);
      }
    }

    res.json({
      success: true,
      count: scrapedArticles.length,
      articles: scrapedArticles,
    });
  });
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nepal News Monitor server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
