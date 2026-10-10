import { NewsArticle } from '../types/news';

export function generateDocHtml(article: NewsArticle, language: 'en' | 'ne' = 'en'): string {
  const isNe = language === 'ne';
  const title = isNe && article.titleNepali ? article.titleNepali : article.title;
  const summary = isNe && article.summaryNepali ? article.summaryNepali : article.summary;
  const content = isNe && article.contentNepali ? article.contentNepali : article.content;
  const takeaways = isNe && article.keyTakeawaysNepali ? article.keyTakeawaysNepali : article.keyTakeaways;

  const dateFormatted = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let policeSection = '';
  if (article.policeReport?.isPoliceReportMentioned) {
    const p = article.policeReport;
    policeSection = `
      <div style="background-color: #f0f4ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 16px 0;">
        <h3 style="margin-top:0; color:#1e3a8a; font-size:12pt;">${isNe ? 'नेपाल प्रहरी विवरण / जाहेरी' : 'Nepal Police Blotter & FIR Record'}</h3>
        <table style="width:100%; border-collapse:collapse; font-size:10pt;">
          <tr>
            <td style="padding:4px 8px; font-weight:bold; width:30%;">${isNe ? 'प्रहरी कार्यालय:' : 'Police Unit:'}</td>
            <td style="padding:4px 8px;">${p.policeStationOrDivision}</td>
          </tr>
          ${p.firNumber ? `<tr><td style="padding:4px 8px; font-weight:bold;">${isNe ? 'जाहेरी (FIR) नं:' : 'FIR Number:'}</td><td style="padding:4px 8px; font-family:monospace;">${p.firNumber}</td></tr>` : ''}
          <tr>
            <td style="padding:4px 8px; font-weight:bold;">${isNe ? 'मुद्दा / कसुर:' : 'Offense Classification:'}</td>
            <td style="padding:4px 8px;">${p.offenseType || (isNe ? 'सार्वजनिक शान्ति विरुद्ध' : 'Public Offense')}</td>
          </tr>
          <tr>
            <td style="padding:4px 8px; font-weight:bold;">${isNe ? 'पक्राउ संख्या:' : 'Arrests Count:'}</td>
            <td style="padding:4px 8px; color:#b91c1c; font-weight:bold;">${p.arrestsCount} ${isNe ? 'जना नियन्त्रणमा' : 'Persons in Custody'}</td>
          </tr>
          ${p.officialStatement ? `<tr><td style="padding:4px 8px; font-weight:bold;">${isNe ? 'प्रवक्ता भनाइ:' : 'Official Statement:'}</td><td style="padding:4px 8px; font-style:italic;">"${p.officialStatement}"</td></tr>` : ''}
        </table>
      </div>
    `;
  }

  let displacementSection = '';
  if (article.displacement?.isDisplacementIncident) {
    const d = article.displacement;
    displacementSection = `
      <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 12px; margin: 16px 0;">
        <h3 style="margin-top:0; color:#881337; font-size:12pt;">${isNe ? 'द्वन्द्व विस्थापन विवरण (IDP Watch)' : 'Conflict Displacement Record'}</h3>
        <table style="width:100%; border-collapse:collapse; font-size:10pt;">
          <tr>
            <td style="padding:4px 8px; font-weight:bold; width:30%;">${isNe ? 'विस्थापित परिवार संख्या:' : 'Displaced Families:'}</td>
            <td style="padding:4px 8px; font-weight:bold; color:#be123c;">${d.familiesCount} ${isNe ? 'परिवार' : 'Families'} ${d.individualsCount ? `(~${d.individualsCount} ${isNe ? 'नागरिक' : 'individuals'})` : ''}</td>
          </tr>
          <tr>
            <td style="padding:4px 8px; font-weight:bold;">${isNe ? 'उत्पत्ति स्थान:' : 'Origin Location:'}</td>
            <td style="padding:4px 8px;">${d.originLocation}</td>
          </tr>
          <tr>
            <td style="padding:4px 8px; font-weight:bold;">${isNe ? 'हालको आश्रयस्थल:' : 'Current Shelter:'}</td>
            <td style="padding:4px 8px;">${d.currentShelterLocation}</td>
          </tr>
          <tr>
            <td style="padding:4px 8px; font-weight:bold;">${isNe ? 'कारण:' : 'Cause:'}</td>
            <td style="padding:4px 8px;">${d.displacementCause.replace(/_/g, ' ')}</td>
          </tr>
          <tr>
            <td style="padding:4px 8px; font-weight:bold;">${isNe ? 'आवश्यक राहत सामग्री:' : 'Urgent Relief Aid Needed:'}</td>
            <td style="padding:4px 8px;">${d.aidRequired.join(', ')}</td>
          </tr>
        </table>
      </div>
    `;
  }

  let takeawaysSection = '';
  if (takeaways && takeaways.length > 0) {
    takeawaysSection = `
      <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; padding: 12px; margin: 16px 0;">
        <h4 style="margin:0 0 8px 0; text-transform:uppercase; font-size:10pt; color:#57534e;">${isNe ? 'मुख्य बुँदाहरू' : 'Executive Takeaways'}</h4>
        <ul style="margin:0; padding-left:20px; font-size:10pt; line-height:1.5;">
          ${takeaways.map((t) => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  const contentParagraphs = content
    .split('\n\n')
    .map((p) => `<p style="font-size:11pt; line-height:1.6; margin-bottom:12px; text-align:justify;">${p}</p>`)
    .join('');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #1c1917; margin: 40px; }
        h1 { font-family: 'Georgia', serif; font-size: 20pt; color: #0c0a09; margin-bottom: 6px; }
        .byline { font-size: 9.5pt; color: #78716c; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px; margin-bottom: 14px; }
        .lead { font-size: 11.5pt; font-weight: 500; color: #44403c; line-height: 1.5; margin-bottom: 16px; }
        footer { margin-top: 40px; border-top: 1px solid #d6d3d1; padding-top: 10px; font-size: 8.5pt; color: #a8a29e; }
      </style>
    </head>
    <body>
      <div style="font-size:9pt; text-transform:uppercase; color:#78716c; letter-spacing:1px; margin-bottom:4px;">
        ${article.location.province} Province · ${article.location.district || 'Nepal'} · ${article.source.name}
      </div>
      <h1>${title}</h1>
      <div class="byline">
        By ${article.author} · ${dateFormatted} · Verified Link: ${article.source.url}
      </div>
      <div class="lead">${summary}</div>
      ${takeawaysSection}
      ${policeSection}
      ${displacementSection}
      <hr style="border:none; border-top:1px solid #e7e5e4; margin:20px 0;" />
      ${contentParagraphs}
      <footer>
        Report compiled by The Nepal Monitor · Civic, Political & Incident Intelligence Portal · https://the-nepal-monitor.org
      </footer>
    </body>
    </html>
  `;
}

export function downloadArticleAsDoc(article: NewsArticle, language: 'en' | 'ne' = 'en') {
  const html = generateDocHtml(article, language);
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const langSuffix = language === 'ne' ? '-nepali' : '';
  a.download = `${article.slug || 'nepal-news'}${langSuffix}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyFormattedArticleForGoogleDocs(article: NewsArticle, language: 'en' | 'ne' = 'en'): boolean {
  try {
    const html = generateDocHtml(article, language);
    const blobHtml = new Blob([html], { type: 'text/html' });
    const isNe = language === 'ne';
    const title = isNe && article.titleNepali ? article.titleNepali : article.title;
    const summary = isNe && article.summaryNepali ? article.summaryNepali : article.summary;
    const content = isNe && article.contentNepali ? article.contentNepali : article.content;
    const plainText = `${title}\n\nBy ${article.author} | ${article.location.province}\n\n${summary}\n\n${content}`;
    const blobText = new Blob([plainText], { type: 'text/plain' });

    if (navigator.clipboard && window.ClipboardItem) {
      navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText,
        }),
      ]);
      return true;
    } else {
      navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (e) {
    console.warn('Clipboard write HTML fallback:', e);
    return false;
  }
}
