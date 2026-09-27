import { Fact, Payment, Deadline } from './schema';

/* ------------------------------------------------------------------ */
/*  SOURCES (short keys used in every fact below)                      */
/* ------------------------------------------------------------------ */
export const SOURCES = {
  wsuProgramPage: 'Wayne State Study Abroad program listing, Japan: Automotive Supply Chain (abroad.wayne.edu)',
  ssStatement: 'WSU Spring/Summer 2026 student account statement (Transact), exported by the author',
  gilmanLetter: 'U.S. Department of State Gilman award letter, April 30, 2026',
  aidSummary: 'WSU financial aid award summary 2025–26, screenshot kept by the author',
  author: 'Author\'s own record (Gotibeh Alhady)',
  transcript: 'WSU unofficial transcript, Spring/Summer 2026 term',
  gilmanDeadlines: 'gilmanscholarship.org/applicants/deadlines-and-timeline/',
  gilmanFaq: 'gilmanscholarship.org/applicants/applicants-faq-2/',
  gilmanService: 'gilmanscholarship.org/current-recipients/service-project/',
} as const;

/* ------------------------------------------------------------------ */
/*  PROGRAM                                                            */
/* ------------------------------------------------------------------ */
export const program = {
  name: 'Japan: Automotive Supply Chain',
  university: 'Wayne State University',
  course: 'GSC 4991',
  credits: 3,
  term: 'Spring/Summer 2026',
  termCode: '202606',
  /* The faculty-led programme itself. Everyone was on this window. */
  inCountry: { start: '2026-06-14', end: '2026-06-27' },
  /* The author's own travel. He stayed on after the group flew home and
     came back on July 3, so his trip is longer than the programme.
     These are deliberately two separate facts: costs attributable to the
     programme end on June 27, and the days after that are his own. */
  travel: { depart: '2026-06-13', return: '2026-07-03' },
  soloExtension: { start: '2026-06-28', end: '2026-07-03', days: 6 },
  cities: [
    { name: 'Tokyo', from: '2026-06-14', to: '2026-06-18', hotel: 'The Knot Tokyo Shinjuku' },
    { name: 'Osaka', from: '2026-06-18', to: '2026-06-21', hotel: 'Villa Fontaine Grand Osaka-Umeda' },
    { name: 'Kyoto', from: '2026-06-20', to: '2026-06-20', dayTrip: true, note: 'A day trip out of Osaka, not an overnight stay.' },
    { name: 'Hamamatsu', from: '2026-06-21', to: '2026-06-23', hotel: 'Okura Act City Hotel Hamamatsu', note: 'The Yamaha factory visit at Kakegawa was on June 22.' },
    { name: 'Hiroshima', from: '2026-06-23', to: '2026-06-27', hotel: 'The Knot Hiroshima' },
  ],
  facultyLeader: 'Lori Sisk',
  students: 10,
  feeIncludes: [
    'Accommodations (double and triple occupancy)',
    'Daily breakfast',
    'Some group meals',
    'Most transportation, including the JR Pass',
    'Required excursions',
    'Travel health insurance',
    'Administrative fees and taxes',
  ],
  officialUrl: 'https://abroad.wayne.edu/',
  acceptedOn: '2026-01-15',
} as const;

/* ------------------------------------------------------------------ */
/*  THE TERM THE COURSE SAT IN (why "term aid" is shared)              */
/* ------------------------------------------------------------------ */
export const term = {
  credits: 13,
  courses: ['GSC 3600', 'GSC 4991 (Japan)', 'ME 4210', 'FIN 3290'],
  tuitionUSD: 8748.92,
  feesUSD: 350 + 25 + 288.58 + 603.33 + 158.54, // engineering support, ME CMF, registration, student service, Day One materials
  source: SOURCES.ssStatement,
  verifiedOn: '2026-09-20',
};
export const termChargesUSD = +(term.tuitionUSD + term.feesUSD).toFixed(2); // 10,174.37
export const japanShareOfTerm = program.credits / term.credits;           // 3/13

/* ------------------------------------------------------------------ */
/*  COSTS                                                              */
/* ------------------------------------------------------------------ */
const V = '2026-09-20';

export const costs: Fact[] = [
  { id: 'programFee', label: 'Program fee', amountUSD: 3200, status: 'verified', source: SOURCES.wsuProgramPage, verifiedOn: V,
    note: 'Covers lodging, breakfast, some group meals, most transport including the JR Pass, excursions, insurance, admin.' },
  { id: 'applicationFee', label: 'Application fee', amountUSD: 50, status: 'verified', source: SOURCES.wsuProgramPage, verifiedOn: V },
  { id: 'tuitionShare', label: 'Tuition and fees, 3-credit share of the term', amountUSD: +(termChargesUSD * japanShareOfTerm).toFixed(2), status: 'estimate',
    source: SOURCES.ssStatement, verifiedOn: V,
    method: 'Term charges of $10,174.37 for 13 credits, multiplied by 3/13. The course was billed as part of a full summer term, not as a separate line.' },
  { id: 'airfare', label: 'Round-trip airfare', amountUSD: 1800, status: 'stated', source: SOURCES.author, verifiedOn: V,
    note: 'What I paid. Detroit to Tokyo fares vary a lot by booking date.' },
  { id: 'food', label: 'Food beyond what the fee covered', amountUSD: 30 * 14, status: 'estimate', source: SOURCES.author, verifiedOn: V,
    method: 'About $30 a day for the 14 programme days. Breakfast came with the hotel and several dinners were group meals. The six days after the programme are counted separately below.' },
  { id: 'localTransit', label: 'Subway and local transit', amountUSD: 30, status: 'estimate', source: SOURCES.author, verifiedOn: V,
    method: 'Roughly ¥1,000 every three to four days on IC-card rides. The JR Pass was in the program fee.' },
  { id: 'airportTransfer', label: 'Airport transfers', amountUSD: null, status: 'todo', source: SOURCES.author, verifiedOn: V,
    note: 'TODO: Narita Express to Shinjuku on arrival; return leg covered by the JR Pass. Confirm fare.' },
  { id: 'esim', label: 'eSIM, 50 GB', amountUSD: 35, status: 'stated', source: SOURCES.author, verifiedOn: V,
    note: 'Calls were free over FaceTime Audio and WhatsApp.' },
  { id: 'scooter', label: 'LUUP e-scooter subscription', amountUSD: 7, status: 'stated', source: SOURCES.author, verifiedOn: V },
  { id: 'suitcase', label: 'Replacement suitcase', amountUSD: 120, status: 'stated', source: SOURCES.author, verifiedOn: V,
    note: 'Mine broke on a city-transfer day. Budget for one surprise.' },
  { id: 'soloDays', label: 'The six days after the programme ended', amountUSD: null, status: 'todo', source: SOURCES.author, verifiedOn: V,
    note: 'TODO: lodging, food and transit for June 28 to July 3. The group flew home on the 27th; I stayed on to see the country by myself and flew back on the 3rd. None of this was covered by the programme fee or by any award, so it belongs in the out-of-pocket column once the amounts are confirmed.' },
];

/* ------------------------------------------------------------------ */
/*  FUNDING                                                            */
/* ------------------------------------------------------------------ */
export const funding: Fact[] = [
  { id: 'gilman', label: 'Gilman International Scholarship', amountUSD: 2500, status: 'verified', source: SOURCES.gilmanLetter, verifiedOn: V,
    note: 'Trip-specific. U.S. Department of State, administered by IIE.' },
  { id: 'globalExperiences', label: 'WSU Global Experiences Scholarship (OIP)', amountUSD: 1000, status: 'verified', source: SOURCES.aidSummary, verifiedOn: V,
    note: 'Trip-specific campus award through the Office of International Programs.' },
  { id: 'pell', label: 'Federal Pell Grant, Spring/Summer 2026', amountUSD: 3697, status: 'verified', source: SOURCES.ssStatement, verifiedOn: V,
    note: 'Term aid. Posted May 21, 2026 against the whole 13-credit term.' },
  { id: 'seniorSprint', label: 'WSU Senior Sprint award', amountUSD: 2500, status: 'verified', source: SOURCES.ssStatement, verifiedOn: V,
    note: 'Term aid for full-time summer enrollment. Posted May 21, 2026.' },
];

export const tripSpecificFunding = ['gilman', 'globalExperiences'];
export const termAidFunding = ['pell', 'seniorSprint'];

/* ------------------------------------------------------------------ */
/*  PAYMENT TIMELINE (the cash-flow lesson)                            */
/* ------------------------------------------------------------------ */
export const payments: Payment[] = [
  { date: '2026-01-15', label: 'Accepted into the program', amountUSD: null, direction: 'out', status: 'verified', source: 'WSU Study Abroad decision letter' },
  { date: '2026-01-28', label: 'Program payment 1', amountUSD: null, direction: 'out', status: 'todo', source: SOURCES.author, note: 'TODO: amount' },
  { date: '2026-02-02', label: 'Program payment 2', amountUSD: null, direction: 'out', status: 'todo', source: SOURCES.author, note: 'TODO: amount' },
  { date: '2026-02-25', label: 'Program payment 3', amountUSD: null, direction: 'out', status: 'todo', source: SOURCES.author, note: 'TODO: amount' },
  { date: '2026-03-21', label: 'Program payment 4', amountUSD: null, direction: 'out', status: 'todo', source: SOURCES.author, note: 'TODO: amount; possibly one more in April' },
  { date: '2026-04-30', label: 'Gilman award letter received', amountUSD: 2500, direction: 'in', status: 'verified', source: SOURCES.gilmanLetter, note: 'Funds arrive only after documents are approved, typically two to three weeks later.' },
  { date: '2026-05-21', label: 'Pell Grant posted to term', amountUSD: 3697, direction: 'in', status: 'verified', source: SOURCES.ssStatement },
  { date: '2026-05-21', label: 'Senior Sprint posted to term', amountUSD: 2500, direction: 'in', status: 'verified', source: SOURCES.ssStatement },
  { date: '2026-05-26', label: 'Term payment plan, installment 1', amountUSD: 992.46, direction: 'out', status: 'verified', source: SOURCES.ssStatement },
  { date: '2026-06-13', label: 'Departed Detroit', amountUSD: null, direction: 'out', status: 'verified', source: SOURCES.author },
  { date: '2026-06-17', label: 'Term payment plan, installment 2', amountUSD: 992.46, direction: 'out', status: 'verified', source: SOURCES.ssStatement },
  { date: '2026-07-23', label: 'Term payment plan, installment 3', amountUSD: 992.45, direction: 'out', status: 'verified', source: SOURCES.ssStatement },
];

/* ------------------------------------------------------------------ */
/*  DEADLINES (snapshots, never live)                                  */
/* ------------------------------------------------------------------ */
export const deadlines: Deadline[] = [
  { id: 'gilmanFall2026', label: 'Gilman Fall 2026 cycle — student deadline', date: '2026-10-01', status: 'verified',
    source: SOURCES.gilmanDeadlines, verifiedOn: V,
    note: '11:59 p.m. Pacific. For programs starting between December 1, 2026 and October 31, 2027.' },
  { id: 'gilmanFall2026Advisor', label: 'Gilman Fall 2026 cycle — advisor certification', date: '2026-10-08', status: 'verified',
    source: SOURCES.gilmanDeadlines, verifiedOn: V,
    note: 'A separate deadline one week after yours. Your advisors have to act too.' },
  { id: 'gilmanSpring2027', label: 'Gilman Spring 2027 cycle — student deadline', date: '2027-02-25', status: 'verified',
    source: SOURCES.gilmanDeadlines, verifiedOn: V,
    note: '11:59 p.m. Pacific. For programs starting between May 1, 2027 and April 30, 2028.' },
  { id: 'gilmanSpring2027Advisor', label: 'Gilman Spring 2027 cycle — advisor certification', date: '2027-03-04', status: 'verified',
    source: SOURCES.gilmanDeadlines, verifiedOn: V },
  { id: 'followOn', label: 'My Follow-on Service Project report', date: null, status: 'todo', source: 'Gilman portal', verifiedOn: V,
    note: 'Due within six months of returning to the U.S. Confirm the exact date shown in the portal.' },
];

/** The application cycles, for the Gilman page. Verified against the official timeline. */
export const GILMAN_CYCLES = [
  {
    name: 'Fall 2026',
    studentDeadline: '2026-10-01',
    studentDeadlineLabel: 'Thursday, October 1, 2026, 11:59 p.m. Pacific',
    advisorDeadline: '2026-10-08',
    advisorDeadlineLabel: 'Thursday, October 8, 2026',
    programWindow: 'Programs starting December 1, 2026 – October 31, 2027',
    notification: 'December 2026',
  },
  {
    name: 'Spring 2027',
    studentDeadline: '2027-02-25',
    studentDeadlineLabel: 'Thursday, February 25, 2027, 11:59 p.m. Pacific',
    advisorDeadline: '2027-03-04',
    advisorDeadlineLabel: 'Thursday, March 4, 2027',
    programWindow: 'Programs starting May 1, 2027 – April 30, 2028',
    notification: 'May 2027',
  },
];

/** Award ceilings, verified. Gilman publishes no average, so none is stated. */
export const GILMAN_AWARDS = {
  base: 5000,
  stemSupplement: 1000,
  criticalLanguageSupplement: 3000,
  combinedMax: 9000,
  criticalLanguages: ['Arabic', 'Bahasa Indonesian', 'Chinese (Mandarin)', 'Hindi', 'Japanese', 'Korean', 'Persian', 'Portuguese', 'Russian', 'Swahili', 'Turkish', 'Urdu'],
};

/** Program-scale facts, verified on the official statistics page. */
export const GILMAN_STATS = [
  { value: '3,100+', label: 'scholarships awarded annually' },
  { value: '~50%', label: 'are first-generation college students' },
  { value: '170+', label: 'countries' },
  { value: 'None', label: 'minimum GPA required' },
];

/* ------------------------------------------------------------------ */
/*  Validate at import time so a bad fact fails the build.             */
/* ------------------------------------------------------------------ */
costs.forEach((f) => Fact.parse(f));
funding.forEach((f) => Fact.parse(f));
payments.forEach((p) => Payment.parse(p));
deadlines.forEach((d) => Deadline.parse(d));

/* ------------------------------------------------------------------ */
/*  Derived totals (only from non-TODO facts)                          */
/* ------------------------------------------------------------------ */
const sum = (xs: Fact[]) => +xs.reduce((a, f) => a + (f.amountUSD ?? 0), 0).toFixed(2);
export const totals = {
  costsKnown: sum(costs),
  costsTodoCount: costs.filter((c) => c.status === 'todo').length,
  tripSpecificFunding: sum(funding.filter((f) => tripSpecificFunding.includes(f.id))),
  termAid: sum(funding.filter((f) => termAidFunding.includes(f.id))),
  get termAidJapanShare() { return +(this.termAid * japanShareOfTerm).toFixed(2); },
  get fundingAttributable() { return +(this.tripSpecificFunding + this.termAidJapanShare).toFixed(2); },
  get outOfPocket() { return +(this.costsKnown - this.fundingAttributable).toFixed(2); },
  termPaidByAuthor: 2977.37,
};
