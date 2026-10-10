import { NewsArticle, ScraperSource } from '../types/news';

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'art-001',
    title: 'Sarlahi Political Clash Displaces 18 Families; Nepal Police Registers Multiple FIRs in Barahathawa',
    titleNepali: 'सर्लाहीमा राजनीतिक झडप: १८ परिवार विस्थापित, प्रहरीद्वारा किटानी जाहेरी दर्ता',
    slug: 'sarlahi-political-clash-displaces-18-families-barahathawa-fir',
    source: {
      name: 'Kathmandu Post & Police Blotter',
      domain: 'kathmandupost.com',
      url: 'https://kathmandupost.com/national/2026/10/08/sarlahi-clash-displaces-families',
      reliabilityScore: 94,
    },
    publishedAt: '2026-10-09T08:15:00.000Z',
    author: 'Anil Shrestha (Janakpur Bureau)',
    summary: 'Violent confrontations between local cadre factions in Barahathawa, Sarlahi have forced 18 Dalit and marginalized farmer families to flee their homes into makeshift school shelters. District Police Office Sarlahi registered 3 separate FIRs and arrested 7 individuals.',
    content: `BARAHATHAWA, SARLAHI — Clashes ignited between opposing local political cadres in Barahathawa Municipality Ward 6 over control of community forestry funds and local ward development contracts have escalated into targeted intimidation, forcing 18 families to abandon their homesteads late Wednesday night.

According to human rights monitors on the ground, thatched roofs of four homes were set ablaze, and water tube wells were contaminated. The affected families, comprising 84 individuals including 29 children, are currently taking temporary refuge in the classrooms of Shree Janata Secondary School under heavy armed guard.

"We ran into the sugarcane fields when cadres carrying bamboo lathis surrounded our tole. We cannot return until the administration guarantees our security and neutralizes partisan intimidation," said Ram Prasad Paswan, 52, a displaced community elder.

Nepal Police District Range Sarlahi dispatched a 60-member combined team of Nepal Police and Armed Police Force (APF) to enforce an emergency prohibitory order.

Superintendent of Police (SP) Rabindra Regmi confirmed: "We have registered three specific FIRs under public offense, arson, and criminal intimidation. Seven suspects directly implicated in instigating the violence have been apprehended and produced before the Sarlahi District Court, which granted a five-day judicial remand for custodial interrogation. We will not allow political flags to shield criminals."

Local Red Cross volunteers have supplied 20 tarpaulin sheets and emergency dry rations, but displaced mothers have urgently appealed for infant milk, clean drinking water, and blankets as nighttime temperatures drop.`,
    categories: ['displacement', 'police_report', 'politics'],
    location: {
      province: 'Madhesh',
      district: 'Sarlahi',
      municipalityOrArea: 'Barahathawa Ward 6',
      coordinates: [26.9748, 85.4526],
    },
    politicalContext: {
      partiesInvolved: ['Nepali Congress', 'CPN-UML', 'Janata Samajbadi Party (JSP)'],
      activityType: 'cadre_clash',
      keyLeaders: ['Local Ward Chairperson', 'District Committee Members'],
      factionDetails: 'Dispute over public procurement tenders and local ward development committee seats.',
      stanceSummary: 'Both district committees traded accusations of orchestrating attacks, while civil society demanded an impartial probe.',
    },
    policeReport: {
      isPoliceReportMentioned: true,
      policeStationOrDivision: 'District Police Office Sarlahi',
      firNumber: 'FIR-SAR-2083/07-142',
      firStatus: 'remand_extended',
      offenseType: 'Arson, Public Offense & Criminal Intimidation during Partisan Riot',
      arrestsCount: 7,
      seizedItems: ['Iron rods', 'Bamboo staves', 'Kerosene canisters', 'Unregistered motorcycles'],
      remandDays: 5,
      officialStatement: 'Prohibitory orders enforced under Local Administration Act; perpetrators booked regardless of political affiliation.',
      courtName: 'Sarlahi District Court',
    },
    displacement: {
      isDisplacementIncident: true,
      familiesCount: 18,
      individualsCount: 84,
      originLocation: 'Barahathawa Ward 6, Sarlahi',
      currentShelterLocation: 'Shree Janata Secondary School Classrooms',
      displacementCause: 'inter_party_violence',
      aidRequired: ['Baby formula & nutrition', 'Clean drinking water & purifiers', 'Winter bedding', '24/7 Police Security Picket'],
      reliefStatus: 'partial_local_relief',
      childrenCount: 29,
      elderlyCount: 14,
    },
    severity: 'critical',
    nepaliKeywords: [
      { term: 'जाहेरी (FIR)', transliteration: 'Jahari', meaningEn: 'First Information Report lodged with Nepal Police' },
      { term: 'विस्थापित (Bistaphit)', transliteration: 'Bistaphit', meaningEn: 'Displaced persons / families forced to flee' },
      { term: 'झडप (Jhadap)', transliteration: 'Jhadap', meaningEn: 'Violent physical clash between party cadres' },
      { term: 'निषेधाज्ञा (Nisedhagya)', transliteration: 'Nishedhagya', meaningEn: 'Prohibitory curfew order issued by Chief District Officer' },
    ],
    readTimeMinutes: 4,
    scrapedAt: '2026-10-09T08:30:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      '18 families (84 individuals) displaced in Barahathawa following inter-party cadre clashes.',
      'Sarlahi District Police filed 3 FIRs and arrested 7 individuals on arson & criminal intimidation charges.',
      'Displaced families staying in school building urgently need rations, infant nutrition, and security protection.',
    ],
  },
  {
    id: 'art-002',
    title: 'Nepali Congress Central Working Committee Concludes Marathon Session on Coalition Friction and Local Election Alliances',
    titleNepali: 'नेपाली कांग्रेस केन्द्रीय कार्यसमिति बैठक: सत्ता गठबन्धन र चुनावी समीकरणबारे मन्थन',
    slug: 'nepali-congress-cwc-coalition-friction-alliances',
    source: {
      name: 'The Record Nepal & RSS Feed',
      domain: 'therecordnepal.com',
      url: 'https://therecordnepal.com/politics/nepali-congress-cwc-resolutions',
      reliabilityScore: 92,
    },
    publishedAt: '2026-10-09T06:40:00.000Z',
    author: 'Prashant Kharel',
    summary: 'The Nepali Congress CWC concluded its five-day deliberative assembly in Sanepa. Party President Sher Bahadur Deuba faces internal pushback from reformist factions led by Gagan Thapa demanding an exit from compromises with UML.',
    content: `KATHMANDU — After five days of heated closed-door discussions at the central party headquarters in Sanepa, Lalitpur, the Nepali Congress Central Working Committee (CWC) adopted a nine-point declaration addressing government functioning, corruption probes, and organizational revitalisation.

Internal tensions between the establishment camp aligned with party chief Sher Bahadur Deuba and the reformist bloc helmed by General Secretaries Gagan Kumar Thapa and Bishwa Prakash Sharma dominated deliberations. The rival faction argued that the current ruling equation with CPN-UML has eroded the party's democratic credentials and stalled key constitutional amendments.

"We cannot become hostage to backroom power sharing while grassroots cadres in the provinces are marginalized. Our primary allegiance must remain to good governance and addressing youth disillusionment," General Secretary Gagan Thapa stated during the closing address.

The CWC resolved to convene a special policy convention in mid-November and instructed all provincial coordination committees in Koshi, Gandaki, and Lumbini to prepare grassroots status reports. The committee also adopted a resolution demanding prompt investigation into cooperative fraud scandals without political shielding.`,
    categories: ['politics'],
    location: {
      province: 'Bagmati',
      district: 'Lalitpur',
      municipalityOrArea: 'Sanepa Party Headquarters',
      coordinates: [27.6833, 85.3115],
    },
    politicalContext: {
      partiesInvolved: ['Nepali Congress', 'CPN-UML'],
      activityType: 'internal_convention',
      keyLeaders: ['Sher Bahadur Deuba', 'Gagan Kumar Thapa', 'Bishwa Prakash Sharma', 'Dr. Shekhar Koirala'],
      factionDetails: 'Deuba establishment vs Thapa-Koirala reformist coordination group.',
      stanceSummary: 'Reaffirmed commitment to constitutional stability while mandating rigorous oversight over coalition ministers.',
    },
    severity: 'medium',
    nepaliKeywords: [
      { term: 'केन्द्रीय कार्यसमिति (CWC)', transliteration: 'Kendriya Karyasamiti', meaningEn: 'Central Working Committee executive apex body' },
      { term: 'महामन्त्री (Mahamantri)', transliteration: 'Mahamantri', meaningEn: 'General Secretary' },
      { term: 'गठबन्धन (Gathabandhan)', transliteration: 'Gathabandhan', meaningEn: 'Political coalition or alliance' },
    ],
    readTimeMinutes: 3,
    scrapedAt: '2026-10-09T07:15:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      'NC wraps up 5-day CWC session in Sanepa with 9-point resolution.',
      'General Secretary Gagan Thapa presses for independent party identity free from UML coalition constraints.',
      'Special policy convention announced for mid-November across all 7 provinces.',
    ],
  },
  {
    id: 'art-003',
    title: 'Nepal Police CIB Submits Chargesheet in Cooperative Embezzlement; 12 Bank Accounts Frozen Across Pokhara and Kathmandu',
    titleNepali: 'सहकारी ठगी प्रकरण: सिआइबीद्वारा अनुसन्धान प्रतिवेदन पेश, पोखरा र काठमाडौंका १२ खाता रोक्का',
    slug: 'nepal-police-cib-cooperative-chargesheet-pokhara-kathmandu',
    source: {
      name: 'Nepal Police News Blotter & OnlineKhabar',
      domain: 'onlinekhabar.com',
      url: 'https://onlinekhabar.com/2026/10/cib-cooperative-probe-chargesheet',
      reliabilityScore: 96,
    },
    publishedAt: '2026-10-09T05:20:00.000Z',
    author: 'Suman Adhikari (Crime Desk)',
    summary: 'The Central Investigation Bureau (CIB) of Nepal Police has concluded its financial forensic analysis of Suryadarshan and Supreme Cooperatives, identifying Rs 1.42 billion in diverted depositor funds. Chargesheets filed against 19 individuals.',
    content: `KATHMANDU / POKHARA — In one of the most politically sensitive investigations of the current fiscal year, the Central Investigation Bureau (CIB) of Nepal Police, in close coordination with District Police Office Kaski, has submitted its 480-page forensic chargesheet to the Government Attorney's Office.

The investigation scrutinized systemic siphonings from Suryadarshan Savings and Credit Cooperative in Pokhara, Supreme Cooperative in Butwal, and Sahara Cooperative in Chitwan. The report documents shell enterprise transfers, unauthorized personal overdrafts, and forged collateral documents.

Senior Superintendent of Police (SSP) Hobindra Bogati, spokesperson for CIB, stated in an official press briefing at CIB Headquarters in Lazimpat: "Our financial crime division analyzed over 8,400 transaction vouchers. The report details specific fund flows routed into media conglomerates and private shell ventures. We have placed travel bans on 22 directors and requested freezing of 12 corporate bank accounts."

Meanwhile, leaders of the Rastriya Swatantra Party (RSP) staged a peaceful sit-in outside the District Police Office Kaski in Pokhara, alleging that state machinery was being weaponized for political vendetta, an assertion Nepal Police firmly rebutted as professional criminal procedure.`,
    categories: ['police_report', 'politics'],
    location: {
      province: 'Gandaki',
      district: 'Kaski',
      municipalityOrArea: 'Pokhara & Lazimpat CIB HQ',
      coordinates: [28.2096, 83.9856],
    },
    politicalContext: {
      partiesInvolved: ['Rastriya Swatantra Party (RSP)', 'Nepali Congress', 'CPN-UML'],
      activityType: 'protest_dharna',
      keyLeaders: ['Rabi Lamichhane', 'Swarnim Wagle', 'Local Parliamentary Representatives'],
      factionDetails: 'Opposition party protesting investigative conduct vs ruling parties demanding judicial trial.',
      stanceSummary: 'RSP claims judicial prejudice; ruling coalition leaders insist law must take its course without political interference.',
    },
    policeReport: {
      isPoliceReportMentioned: true,
      policeStationOrDivision: 'Nepal Police Central Investigation Bureau (CIB) & DPO Kaski',
      firNumber: 'CIB-COOP-80/81-089',
      firStatus: 'chargesheet_filed',
      offenseType: 'Cooperative Fraud, Forgery & Organized Embezzlement (Organized Crime Act 2070)',
      arrestsCount: 6,
      seizedItems: ['Audit hard drives', 'Forged loan ledgers', 'Cheque leaves', 'Bank freeze certificates'],
      officialStatement: 'Evidence forwarded to District Attorney; 12 commercial bank accounts frozen under Court order.',
      courtName: 'Kaski District Court',
    },
    severity: 'high',
    nepaliKeywords: [
      { term: 'सिआइबी (CIB)', transliteration: 'CIB', meaningEn: 'Central Investigation Bureau - elite criminal probe arm of Nepal Police' },
      { term: 'अभियोगपत्र (Chargesheet)', transliteration: 'Abhiyogpatra', meaningEn: 'Formal prosecution chargesheet submitted to court' },
      { term: 'सहकारी ठगी (Coop Fraud)', transliteration: 'Sahakari Thagi', meaningEn: 'Embezzlement of cooperative savings depositor funds' },
      { term: 'रोक्का (Frozen)', transliteration: 'Rokka', meaningEn: 'Freezing of bank accounts or property by state authority' },
    ],
    readTimeMinutes: 4,
    scrapedAt: '2026-10-09T06:00:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      'Nepal Police CIB submits 480-page chargesheet regarding Rs 1.42B cooperative embezzlement.',
      '12 bank accounts frozen and travel restrictions imposed on 22 directors.',
      'RSP cadres stage peaceful demonstrations alleging political vendetta; CIB asserts objective financial evidence.',
    ],
  },
  {
    id: 'art-004',
    title: 'Political Standoff Over Land Demarcation Leaves 24 Families Displaced in Chaurjahari, Karnali',
    titleNepali: 'रुकुम पश्चिमको चौरजहारीमा राजनीतिक विवादपछि २४ परिवार विस्थापित, राहतको पर्खाइमा',
    slug: 'chaurjahari-karnali-land-standoff-24-families-displaced',
    source: {
      name: 'Setopati & Regional Monitor',
      domain: 'en.setopati.com',
      url: 'https://en.setopati.com/social/chaurjahari-displacement-karnali-clash',
      reliabilityScore: 91,
    },
    publishedAt: '2026-10-08T17:45:00.000Z',
    author: 'Dipak Oli (Karnali Bureau)',
    summary: 'A partisan feud between cadres of CPN (Maoist Centre) and CPN-UML regarding resettlement boundaries and ward development borders in Rukum West has displaced 24 families who had their livestock seized and food stocks vandalized.',
    content: `CHAURJAHARI, RUKUM WEST — Amid simmering political tensions over the demarcation of municipal grazing lands and irrigation channel rights, 24 peasant families in Chaurjahari Ward 11 have been forced into internal displacement.

The incident originated when rival party-affiliated youth organizations clashed during a ward assembly meeting discussing distribution of cooperative agricultural subsidies. Following the disruption, aggressive factions erected barricades around the lower village, cutting off water pipelines and threatening residents who refused to sign partisan allegiance pledges.

As of Thursday morning, 112 villagers, including 41 children and 18 senior citizens, are camping at a community grain shed in neighboring Ward 9. Temperature drops in the hill district have heightened health risks for infants.

"We have lived here for three generations. Now politicians from both sides are using our homesteads as bargaining chips. We don't care about their party flags; we just need our homes back," said Maya Budha, 38, holding her seven-month-old daughter.

Chief District Officer (CDO) Hari Prasad Pant held an all-party dialogue in Khalanga to broker a truce, but local leaders failed to agree on compensation terms. District Police Office Rukum West deployed an armed security detachment to guard the deserted settlement to prevent further looting.`,
    categories: ['displacement', 'politics'],
    location: {
      province: 'Karnali',
      district: 'Rukum West',
      municipalityOrArea: 'Chaurjahari Municipality Ward 11',
      coordinates: [28.6272, 82.2618],
    },
    politicalContext: {
      partiesInvolved: ['CPN (Maoist Centre)', 'CPN-UML'],
      activityType: 'cadre_clash',
      keyLeaders: ['Local Ward Committee Secretaries', 'Youth Wing Leaders'],
      factionDetails: 'Partisan rivalry over irrigation control, municipal budget allocation, and community forest rights.',
      stanceSummary: 'Both sides boycotted CDO reconciliation dialogue demanding criminal charges against the other.',
    },
    displacement: {
      isDisplacementIncident: true,
      familiesCount: 24,
      individualsCount: 112,
      originLocation: 'Chaurjahari Ward 11, Rukum West',
      currentShelterLocation: 'Ward 9 Community Grain Shed & Temporary Tarps',
      displacementCause: 'land_dispute_political',
      aidRequired: ['Warm winter blankets', 'Child healthcare / pediatrician checkup', 'Dry lentils and rice', 'Sanitary kits'],
      reliefStatus: 'critical_no_aid',
      childrenCount: 41,
      elderlyCount: 18,
    },
    severity: 'critical',
    nepaliKeywords: [
      { term: 'विवाद (Bibad)', transliteration: 'Bibad', meaningEn: 'Dispute or contention between groups' },
      { term: 'सर्वदलीय बैठक (Sarbadaliya Baithak)', transliteration: 'Sarbadaliya Baithak', meaningEn: 'All-party consensus meeting convened by administration' },
      { term: 'पीडित (Pidit)', transliteration: 'Pidit', meaningEn: 'Victims or affected displaced citizens' },
    ],
    readTimeMinutes: 4,
    scrapedAt: '2026-10-08T18:30:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      '24 families (112 individuals) displaced in Chaurjahari Ward 11 due to escalating party turf wars.',
      'Essential water lines severed; families seeking shelter in community grain shed in Ward 9.',
      'All-party mediation in Khalanga deadlocked; urgent humanitarian relief needed for 41 children.',
    ],
  },
  {
    id: 'art-005',
    title: 'Maitighar Mandala Protests: Nepal Police Detains 15 Demonstrators During RPP Pro-Monarchy March Towards Singha Durbar',
    titleNepali: 'माइतीघर मण्डला प्रदर्शन: सिंहदरबारतर्फ अघि बढेको राप्रपा जुलुसबाट १५ जना पक्राउ',
    slug: 'maitighar-mandala-rpp-protest-nepal-police-detains-15',
    source: {
      name: 'MyRepublica & Kathmandu Valley Police',
      domain: 'myrepublica.nagariknetwork.com',
      url: 'https://myrepublica.nagariknetwork.com/news/maitighar-protest-rpp-police-detention',
      reliabilityScore: 93,
    },
    publishedAt: '2026-10-09T03:30:00.000Z',
    author: 'Bikash Karki',
    summary: 'Rastriya Prajatantra Party (RPP) cadres attempting to march towards the restricted Singha Durbar zone were intercepted by riot police with water cannons. 15 cadres detained by Kathmandu Police Range.',
    content: `KATHMANDU — Traffic came to a standstill along the Maitighar-Baneshwor arterial corridor for over three hours this afternoon after cadres of the Rastriya Prajatantra Party (RPP) defied prohibitory zone orders and clashed with Nepal Police personnel.

The demonstrators, advocating for constitutional monarchy reinstatement and the rollback of federal provinces, surged past steel barricades at Bhadrakali towards Singha Durbar, the seat of government. Riot police deployed water cannons and tear gas canisters to disperse the crowd after projectiles were hurled at security lines.

Kathmandu Valley Police Office (Ranipokhari) confirmed that 15 cadres, including two central committee members, were taken into preventive detention.

"The District Administration Office Kathmandu had strictly notified all groups that Singha Durbar perimeter and Baluwatar are designated prohibitory zones. Demonstrators dismantled police barricades and damaged a traffic surveillance pole. The detained individuals are being held at Nepal Police Circle Singha Durbar for verification," said Senior Superintendent of Police (SSP) Nawaraj Adhikari.

RPP Chairman Rajendra Lingden condemned the police action, calling the use of water cannons unprovoked suppression of constitutional speech, and warned of nationwide district headquarters gheraos if detainees were not released immediately.`,
    categories: ['incident', 'politics', 'police_report'],
    location: {
      province: 'Bagmati',
      district: 'Kathmandu',
      municipalityOrArea: 'Maitighar Mandala to Singha Durbar',
      coordinates: [27.6939, 85.3206],
    },
    politicalContext: {
      partiesInvolved: ['Rastriya Prajatantra Party (RPP)'],
      activityType: 'party_rally',
      keyLeaders: ['Rajendra Lingden', 'Buddhiman Tamang', 'Dhawal Shamsher Rana'],
      factionDetails: 'Royalist campaign demanding scrapping of secular federal structure.',
      stanceSummary: 'Vowed to intensify urban civil disobedience; warned of continuous highway pickets.',
    },
    policeReport: {
      isPoliceReportMentioned: true,
      policeStationOrDivision: 'District Police Range Kathmandu & Police Circle Singha Durbar',
      firNumber: 'DPR-KTM-2083-PROT-044',
      firStatus: 'investigating',
      offenseType: 'Violation of Prohibitory Zone Order & Vandalism of Public Property',
      arrestsCount: 15,
      seizedItems: ['Party flags', 'Loudspeaker rigs', 'Dismantled barricade pins'],
      officialStatement: 'Water cannons and mild force used to protect high-security Singha Durbar zone.',
    },
    severity: 'high',
    nepaliKeywords: [
      { term: 'माइतीघर मण्डला (Maitighar)', transliteration: 'Maitighar Mandala', meaningEn: 'Historic public protest intersection in central Kathmandu' },
      { term: 'सिंहदरबार (Singha Durbar)', transliteration: 'Singha Durbar', meaningEn: 'Main administrative secretariat and prime minister complex of Nepal' },
      { term: 'घेराउ (Gherao)', transliteration: 'Gherao', meaningEn: 'Encircling / blockade protest around a government office' },
      { term: 'सार्वजनिक सम्पत्ति (Public Property)', transliteration: 'Sarwajanik Sampatti', meaningEn: 'State property protected under public security law' },
    ],
    readTimeMinutes: 3,
    scrapedAt: '2026-10-09T04:15:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      '15 RPP demonstrators arrested near Singha Durbar after breaching barricades at Maitighar.',
      'Water cannons and tear gas deployed; traffic paralyzed across Kathmandu corridor.',
      'RPP chief Rajendra Lingden warns of nationwide district strikes if detainees are prosecuted.',
    ],
  },
  {
    id: 'art-006',
    title: 'CPN (Maoist Centre) Mobilizes Nationwide Protests Against Price Surges; Chakka Jam Partially Stalls Prithvi Highway',
    titleNepali: 'महङ्गीविरुद्ध माओवादी केन्द्रको देशव्यापी प्रदर्शन: पृथ्वी राजमार्गमा चक्काजामको आंशिक प्रभाव',
    slug: 'maoist-centre-nationwide-protests-prithvi-highway-chakka-jam',
    source: {
      name: 'Himalayan Times & Traffic Police Blotter',
      domain: 'thehimalayantimes.com',
      url: 'https://thehimalayantimes.com/nepal/maoist-centre-price-hike-protests-highway',
      reliabilityScore: 90,
    },
    publishedAt: '2026-10-08T14:10:00.000Z',
    author: 'Kishore Shrestha (Dhading Correspondent)',
    summary: 'Maoist youth cadres enforced brief highway blockades (Chakka Jam) along key choke points of the Prithvi Highway in Dhading and Chitwan. Nepal Police cleared blockades within two hours.',
    content: `MALKHU, DHADING — Commuters traveling between Kathmandu and the western provinces experienced severe delays this morning after cadres of the Young Communist League (YCL), the youth affiliate of CPN (Maoist Centre), enforced a symbolic two-hour 'Chakka Jam' (vehicular strike) at Malekhu and Mugling.

The demonstrations were part of a coordinated nationwide campaign spearheaded by party Chairman Pushpa Kamal Dahal 'Prachanda' demanding immediate rollback of recent petroleum tariff hikes, stabilization of chemical fertilizer supplies for farmers, and action against market cartels.

Vehicles transporting emergency oxygen cylinders, ambulances, and milk tankers were permitted through after intervention by Nepal Police Highway Patrol units.

District Police Office Dhading mobilized riot units with tow trucks to clear burning tires from the asphalt. "We opened one-way vehicular movement within 90 minutes. Four youths who resisted police instructions to douse burning tires were briefly detained and released after formal reprimand in the presence of guardians," confirmed Deputy Superintendent of Police (DSP) Santosh Pathak.

The Maoist party has slated phase-two demonstrations for next Tuesday, targeting regional provincial ministries in Hetauda, Pokhara, and Butwal.`,
    categories: ['incident', 'politics'],
    location: {
      province: 'Bagmati',
      district: 'Dhading',
      municipalityOrArea: 'Malekhu & Prithvi Highway Stretch',
      coordinates: [27.8041, 84.8291],
    },
    politicalContext: {
      partiesInvolved: ['CPN (Maoist Centre)'],
      activityType: 'party_rally',
      keyLeaders: ['Pushpa Kamal Dahal (Prachanda)', 'YCL Central Leadership'],
      factionDetails: 'Maoist youth organization executing central leadership agitation directives.',
      stanceSummary: 'Warns that prolonged price gouging will trigger indefinite industrial and transport bandhs.',
    },
    policeReport: {
      isPoliceReportMentioned: true,
      policeStationOrDivision: 'District Police Office Dhading (Highway Patrol Unit)',
      offenseType: 'Obstructing National Highway Transport & Public Safety Disruption',
      arrestsCount: 4,
      officialStatement: 'Highway fully reopened; emergency vehicles facilitated without delay.',
    },
    severity: 'medium',
    nepaliKeywords: [
      { term: 'चक्काजाम (Chakka Jam)', transliteration: 'Chakka Jam', meaningEn: 'Transport blockade / wheel strike halting all vehicular movement' },
      { term: 'बन्द (Bandh)', transliteration: 'Bandh', meaningEn: 'General strike shutting down shops, schools, and transport' },
      { term: 'राजमार्ग (Rajmarga)', transliteration: 'Rajmarga', meaningEn: 'National arterial highway' },
    ],
    readTimeMinutes: 3,
    scrapedAt: '2026-10-08T15:00:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      'Maoist YCL cadres staged 2-hour Chakka Jam along Prithvi Highway at Malekhu and Mugling.',
      'Dhading police cleared burning tires and restored one-way traffic within 90 minutes.',
      'Phase-two protests announced targeting provincial ministries in Bagmati, Gandaki, and Lumbini.',
    ],
  },
  {
    id: 'art-007',
    title: 'Political Retaliation in Rautahat Leaves 9 Families Homeless After Ward Chairman Election Dispute',
    titleNepali: 'रौतहटमा चुनावी रङ्गभेद र प्रतिशोध: ९ परिवारको घरमा तोडफोडपछि उठीबास',
    slug: 'rautahat-political-retaliation-9-families-homeless',
    source: {
      name: 'Madhesh Live & Nepal Police Rautahat',
      domain: 'madheshlive.com',
      url: 'https://madheshlive.com/news/rautahat-political-retaliation-displaced',
      reliabilityScore: 89,
    },
    publishedAt: '2026-10-08T11:20:00.000Z',
    author: 'Ram Babu Yadav (Gaur Desk)',
    summary: 'Nine Mahadalit families in Ishnath Municipality, Rautahat were evicted and their homes ransacked following political retribution linked to municipal ward by-elections. Nepal Police arrested 4 suspects.',
    content: `ISHNATH, RAUTAHAT — Tensions remain palpable in Ishnath Municipality Ward 4 following a targeted night raid by armed political cadres that left nine impoverished families without shelter.

Eyewitnesses recounted that a mob affiliated with a defeated local faction attacked the Musahar settlement, accusing the families of cross-voting for a rival party candidate in the recent ward by-election. The attackers broke clay stoves, tore down thatch canopies, and drove 48 people, including 19 minors, into the open fields near the Lalbakaiya river embankment.

"They shouted that because we did not vote for their candidate, we had no right to graze our goats on the common bund. We hid our children in the reeds while they wrecked our grain bins," cried Phool Kumari Majhi, 45.

District Police Range Rautahat moved into the area with a combined APF detachment early Wednesday morning. Superintendent of Police (SP) Dilip Ghimire stated that four prime instigators had been taken into custody under non-bailable public offense and criminal destruction statutes.

The Rautahat District Administration Office has deployed an ambulance and provided temporary plastic tarps, but social activists warn that the families cannot safely return to their hamlet without a permanent police picket.`,
    categories: ['displacement', 'police_report', 'politics'],
    location: {
      province: 'Madhesh',
      district: 'Rautahat',
      municipalityOrArea: 'Ishnath Municipality Ward 4',
      coordinates: [26.9667, 85.2833],
    },
    politicalContext: {
      partiesInvolved: ['CPN-UML', 'Janata Samajbadi Party (JSP)', 'Janamat Party'],
      activityType: 'cadre_clash',
      keyLeaders: ['Local Ward Candidates', 'Tole Committee Conveners'],
      stanceSummary: 'Displaced community appeals for state security against local political feudal harassment.',
    },
    policeReport: {
      isPoliceReportMentioned: true,
      policeStationOrDivision: 'District Police Office Rautahat',
      firNumber: 'FIR-RT-2083/06-088',
      firStatus: 'investigating',
      offenseType: 'Coordinated Attack on Settlement, Criminal Trespass & Caste-Based Intimidation',
      arrestsCount: 4,
      seizedItems: ['Lathis', 'Sickles', 'Broken household implements'],
      officialStatement: 'Four instigators booked under strict penal provisions; security picket established.',
    },
    displacement: {
      isDisplacementIncident: true,
      familiesCount: 9,
      individualsCount: 48,
      originLocation: 'Ishnath Ward 4 Musahar Settlement',
      currentShelterLocation: 'Lalbakaiya Embankment Tents',
      displacementCause: 'inter_party_violence',
      aidRequired: ['Tent tarpaulins', 'Clean water jerrycans', 'Dry provisions & baby food', 'Permanent police picket'],
      reliefStatus: 'critical_no_aid',
      childrenCount: 19,
      elderlyCount: 7,
    },
    severity: 'critical',
    nepaliKeywords: [
      { term: 'उठीबास (Uthibaas)', transliteration: 'Uthibaas', meaningEn: 'Forced eviction / uprooting of families from their settlement' },
      { term: 'दलित बस्ती (Dalit Basti)', transliteration: 'Dalit Basti', meaningEn: 'Marginalized community hamlet vulnerable to partisan pressure' },
      { term: 'सुरक्षा पिकेट (Police Picket)', transliteration: 'Suraksha Picket', meaningEn: 'Armed temporary police outpost stationed for civilian safety' },
    ],
    readTimeMinutes: 3,
    scrapedAt: '2026-10-08T12:00:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      '9 Mahadalit families (48 people) displaced in Ishnath, Rautahat following election retaliation.',
      'Homes ransacked; families currently seeking shelter in makeshift tents on river embankment.',
      'Rautahat Police arrested 4 suspects under criminal destruction and trespass charges.',
    ],
  },
  {
    id: 'art-008',
    title: 'CPN-UML Standing Committee Discusses Constitution Amendment Strategy and Governance Stability',
    titleNepali: 'नेकपा एमाले स्थायी कमिटी बैठक: संविधान संशोधन र सत्ता स्थायित्वबारे रणनीतिक छलफल',
    slug: 'cpn-uml-standing-committee-constitution-amendment-stability',
    source: {
      name: 'National News Agency (RSS) & Kantipur',
      domain: 'kantipurdaily.com',
      url: 'https://kantipurdaily.com/news/uml-standing-committee-constitution-review',
      reliabilityScore: 95,
    },
    publishedAt: '2026-10-08T09:00:00.000Z',
    author: 'Gopal Sharma (Balkhu Bureau)',
    summary: 'The Standing Committee of CPN-UML chaired by Prime Minister KP Sharma Oli deliberated on procedural steps for electoral threshold revisions and provincial legislature downsizing.',
    content: `KATHMANDU — Meeting at the party's central headquarters in Chyasal, Lalitpur, the Standing Committee of the Communist Party of Nepal (Unified Marxist-Leninist) met for four hours to review the performance of coalition ministries and outline constitutional reform priorities.

Prime Minister and UML Chairman KP Sharma Oli briefed party leaders on the ongoing consensus-building dialogue with coalition partner Nepali Congress. Top agenda items include raising the national parliamentary threshold for fringe parties, reviewing the number of provincial cabinet portfolios to cut administrative overhead, and expediting transitional justice bill execution.

"Stability is paramount for economic revival and foreign direct investment. Minor technical differences between alliance partners will be reconciled through joint task force mechanisms," stated UML Deputy General Secretary Pradeep Gyawali following the meeting.

The party also directed its provincial parliamentary wings in Sudurpashchim and Koshi to finalize cabinet expansions by early next week to forestall regional instability.`,
    categories: ['politics'],
    location: {
      province: 'Bagmati',
      district: 'Lalitpur',
      municipalityOrArea: 'Chyasal Party Headquarters',
      coordinates: [27.6766, 85.3288],
    },
    politicalContext: {
      partiesInvolved: ['CPN-UML', 'Nepali Congress'],
      activityType: 'internal_convention',
      keyLeaders: ['KP Sharma Oli', 'Ishwar Pokhrel', 'Shankar Pokhrel', 'Pradeep Gyawali'],
      stanceSummary: 'Prioritizing governance stability, electoral law revisions, and economic policy acceleration.',
    },
    severity: 'low',
    nepaliKeywords: [
      { term: 'स्थायी कमिटी (Standing Committee)', transliteration: 'Sthayi Committee', meaningEn: 'Core executive policy body of the party' },
      { term: 'संविधान संशोधन (Amendment)', transliteration: 'Sambidhan Sansodhan', meaningEn: 'Constitutional amendment process' },
      { term: 'थ्रेसहोल्ड (Threshold)', transliteration: 'Threshold', meaningEn: 'Minimum percentage vote required for parliamentary recognition' },
    ],
    readTimeMinutes: 3,
    scrapedAt: '2026-10-08T09:45:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      'CPN-UML Standing Committee meets at Chyasal under PM KP Sharma Oli.',
      'Focus placed on electoral threshold review and provincial government rationalization.',
      'Provincial wings in Koshi and Sudurpashchim instructed to stabilize coalition teams.',
    ],
  },
  {
    id: 'art-009',
    title: 'Birgunj Border Customs Alert: Nepal Police and APF Seize Illegal Consignment and Detain 3 Linked to Extortion Ring',
    titleNepali: 'वीरगन्ज भन्सारमा विशेष अपरेसन: अवैध मालसामानसहित चन्दा असुली गिरोहका ३ जना पक्राउ',
    slug: 'birgunj-border-customs-police-apf-seizure-extortion-ring',
    source: {
      name: 'Nepal Police Blotter & Parsa Desk',
      domain: 'nepalpolice.gov.np',
      url: 'https://nepalpolice.gov.np/news/press-release-parsa-seizure-oct9',
      reliabilityScore: 97,
    },
    publishedAt: '2026-10-07T19:30:00.000Z',
    author: 'Sub-Inspector Dinesh Thapa (Press Office)',
    summary: 'A joint strike force of District Police Office Parsa and Armed Police Force Border Security Outpost intercepted two freight trucks carrying undeclared industrial goods worth Rs 38 million and arrested three individuals suspected of funding splinter political groups.',
    content: `BIRGUNJ, PARSA — In an early dawn joint interdiction at the Inarwa border crossing, security personnel from District Police Range Parsa and the APF 13th Battalion seized two 10-wheeler trucks carrying unmanifested high-value electronic components, pharmaceutical chemicals, and fabricated customs clearance seals.

Preliminary interrogation of the detained drivers and clearing agents uncovered links to an extortion racket operating under the guise of an unregistered political struggle committee that has been threatening traders along the Birgunj-Pathlaiya industrial corridor.

Superintendent of Police (SP) Kumodh Dhungel, chief of DPO Parsa, announced at a media briefing: "We acted on verified intelligence regarding illicit financial pipelines. We have confiscated counterfeit letterheads demanding 'revolution contributions' from 14 local manufacturing factories, along with receipt stubs totaling Rs 4.5 million."

An FIR has been lodged under the Customs Act 2064, Anti-Money Laundering Act, and Extortion under the National Penal Code. The Parsa District Court remanded the suspects into custody for seven days for further forensic extraction of their mobile communication records.`,
    categories: ['police_report', 'incident'],
    location: {
      province: 'Madhesh',
      district: 'Parsa',
      municipalityOrArea: 'Birgunj Inarwa Border Crossing',
      coordinates: [27.0135, 84.8772],
    },
    politicalContext: {
      partiesInvolved: ['Independent / Others'],
      activityType: 'press_statement',
      keyLeaders: ['Underground Faction Commanders'],
      factionDetails: 'Splinter militant faction operating illegal donation extortion rings in the Terai belt.',
    },
    policeReport: {
      isPoliceReportMentioned: true,
      policeStationOrDivision: 'District Police Office Parsa & APF 13th Battalion',
      firNumber: 'FIR-PAR-2083/07-023',
      firStatus: 'remand_extended',
      offenseType: 'Smuggling, Anti-Money Laundering & Partisan Extortion Racketeering',
      arrestsCount: 3,
      seizedItems: ['Two freight trucks', 'Electronics worth Rs 38M', 'Extortion donation slips', 'Counterfeit seal stamps'],
      remandDays: 7,
      officialStatement: 'Extortion using political threats against industrialists will be met with zero tolerance.',
      courtName: 'Parsa District Court',
    },
    severity: 'high',
    nepaliKeywords: [
      { term: 'चन्दा असुली (Chanda Asuli)', transliteration: 'Chanda Asuli', meaningEn: 'Forced donation / extortion by armed or political groups' },
      { term: 'भन्सार छली (Customs Evasion)', transliteration: 'Bhansar Chhali', meaningEn: 'Smuggling / evading customs tariffs at national borders' },
      { term: 'सशस्त्र प्रहरी बल (APF)', transliteration: 'Sashastra Prahari Bal', meaningEn: 'Armed Police Force paramilitary border security organization' },
    ],
    readTimeMinutes: 3,
    scrapedAt: '2026-10-07T20:15:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      'Rs 38M contraband seized at Birgunj border in joint operation by Nepal Police and APF.',
      '3 individuals arrested with counterfeit donation receipt pads linked to extortion networks.',
      'Parsa District Court issues 7-day custodial remand for money laundering probe.',
    ],
  },
  {
    id: 'art-010',
    title: 'Displacement Threatens 31 Families in Bajhang as Post-Landslide Relief Distribution Stalled by Ward Council Partisan Boycott',
    titleNepali: 'बझाङमा पहिरोपीडित ३१ परिवारको बिजोग: राजनीतिक खिचातानीले राहत वितरण अवरुद्ध',
    slug: 'bajhang-displacement-31-families-partisan-boycott-stalled-relief',
    source: {
      name: 'Sudurpashchim Khabar & Red Cross Report',
      domain: 'sudurpashchimkhabar.com',
      url: 'https://sudurpashchimkhabar.com/news/bajhang-relief-stalemate-displaced-families',
      reliabilityScore: 88,
    },
    publishedAt: '2026-10-07T12:00:00.000Z',
    author: 'Kalyan Joshi (Chainpur Bureau)',
    summary: 'A fierce deadlock between Nepali Congress and CPN-UML ward representatives in Talkot, Bajhang over victim beneficiary lists has brought distribution of Red Cross shelters and winter coats to an abrupt halt, stranding 31 displaced families.',
    content: `TALKOT, BAJHANG — Over 140 people across 31 families in Talkot Rural Municipality Ward 4 who lost their terraced homes to soil subsidence continue to sleep under porous plastic canopies because local elected leaders cannot agree on which party's supporters receive priority relief.

A consignment of 35 all-weather tent kits, hygiene hampers, and corrugated iron roofing sheets donated by the Nepal Red Cross Society has been locked inside the ward office storeroom for six consecutive days. Representatives from the Nepali Congress and CPN-UML have traded allegations of inflating beneficiary rolls with non-affected family members.

"Politicians are disputing whose name comes first on the muster roll, while our children shiver with pneumonia under thin plastic sheets," lamented Janaki Dhami, 44, whose stone cottage collapsed two weeks ago. "We have had zero hot cooked meals in 48 hours."

Local civil society and youth groups staged a silent sit-in outside the District Administration Office in Chainpur demanding that CDO Bishnu Prasad Sharma bypass the deadlocked ward council and dispatch Armed Police Force personnel to distribute the aid directly.`,
    categories: ['displacement', 'politics'],
    location: {
      province: 'Sudurpashchim',
      district: 'Bajhang',
      municipalityOrArea: 'Talkot Rural Municipality Ward 4',
      coordinates: [29.6167, 81.2167],
    },
    politicalContext: {
      partiesInvolved: ['Nepali Congress', 'CPN-UML'],
      activityType: 'press_statement',
      keyLeaders: ['Talkot Ward Chairman', 'Local Committee Chiefs'],
      factionDetails: 'Partisan infighting over relief beneficiary quota lists.',
      stanceSummary: 'Grassroots civil society demands immediate executive intervention to deliver blocked aid.',
    },
    displacement: {
      isDisplacementIncident: true,
      familiesCount: 31,
      individualsCount: 142,
      originLocation: 'Talkot Ward 4 Hillside Settlement',
      currentShelterLocation: 'Makeshift Plastic Tarps near Talkot Meadow',
      displacementCause: 'flooding_post_conflict_neglect',
      aidRequired: ['Corrugated tin sheets', 'Winterized all-weather tents', 'Warm coats for infants', 'Dry pulse and rice bags'],
      reliefStatus: 'critical_no_aid',
      childrenCount: 52,
      elderlyCount: 21,
    },
    severity: 'critical',
    nepaliKeywords: [
      { term: 'राहत (Rahat)', transliteration: 'Rahat', meaningEn: 'Emergency humanitarian relief aid supplies' },
      { term: 'खिचातानी (Khichatani)', transliteration: 'Khichatani', meaningEn: 'Partisan tug-of-war / bureaucratic deadlock' },
      { term: 'गाउँपालिका (Gaunpalika)', transliteration: 'Gaunpalika', meaningEn: 'Rural municipality local governing body' },
    ],
    readTimeMinutes: 4,
    scrapedAt: '2026-10-07T12:45:00.000Z',
    scraperMethod: 'curated_feed',
    keyTakeaways: [
      '31 families (142 people) in Talkot, Bajhang sleeping in freezing conditions under thin plastic.',
      'Red Cross aid kits locked in storeroom due to NC and UML dispute over beneficiary rolls.',
      'Civil society urges CDO to deploy APF to distribute emergency supplies directly to victims.',
    ],
  },
];

export const INITIAL_SCRAPER_SOURCES: ScraperSource[] = [
  {
    id: 'src-01',
    name: 'The Kathmandu Post (National & Politics)',
    url: 'https://kathmandupost.com/national',
    feedType: 'rss',
    frequencyMinutes: 15,
    lastScraped: '10 minutes ago',
    articlesFound: 48,
    status: 'active',
    categoryFocus: 'National Politics & Parliamentary Movements',
  },
  {
    id: 'src-02',
    name: 'OnlineKhabar English (Crime & Law)',
    url: 'https://english.onlinekhabar.com',
    feedType: 'rss',
    frequencyMinutes: 30,
    lastScraped: '22 minutes ago',
    articlesFound: 39,
    status: 'active',
    categoryFocus: 'Police Blotters, Crime Division & FIRs',
  },
  {
    id: 'src-03',
    name: 'Nepal Police Official Press Bulletins',
    url: 'https://nepalpolice.gov.np/news',
    feedType: 'police_portal',
    frequencyMinutes: 20,
    lastScraped: '5 minutes ago',
    articlesFound: 24,
    status: 'active',
    categoryFocus: 'FIR Registrations, Arrests, Border Interdictions',
  },
  {
    id: 'src-04',
    name: 'Setopati English (Civic & Conflict Monitor)',
    url: 'https://en.setopati.com',
    feedType: 'rss',
    frequencyMinutes: 30,
    lastScraped: '18 minutes ago',
    articlesFound: 31,
    status: 'active',
    categoryFocus: 'Conflict Displacement & Rural Incidents',
  },
  {
    id: 'src-05',
    name: 'The Himalayan Times (National & Security)',
    url: 'https://thehimalayantimes.com',
    feedType: 'rss',
    frequencyMinutes: 60,
    lastScraped: '45 minutes ago',
    articlesFound: 29,
    status: 'active',
    categoryFocus: 'Bandhs, Highway Blockades, Party Rallies',
  },
  {
    id: 'src-06',
    name: 'Madhesh Live & Terai Incident Watch',
    url: 'https://madheshlive.com',
    feedType: 'html',
    frequencyMinutes: 30,
    lastScraped: '35 minutes ago',
    articlesFound: 17,
    status: 'idle',
    categoryFocus: 'Madhesh Cadre Clashes & Displacement Toles',
  },
];
