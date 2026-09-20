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
  inCountry: { start: '2026-06-14', end: '2026-06-27' },
  travel: { depart: '2026-06-13', return: '2026-06-27' },
  cities: [
    { name: 'Tokyo', from: '2026-06-14', to: '2026-06-18' },
    { name: 'Kyoto', from: '2026-06-18', to: '2026-06-20' },
    { name: 'Osaka', from: '2026-06-20', to: '2026-06-23', note: 'Includes the Yamaha Kakegawa factory visit near Hamamatsu on June 22.' },
    { name: 'Hiroshima', from: '2026-06-23', to: '2026-06-27' },
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
    method: 'About $30 a day for 14 days. Breakfast came with the hotel and several dinners were group meals.' },
  { id: 'localTransit', label: 'Subway and local transit', amountUSD: 30, status: 'estimate', source: SOURCES.author, verifiedOn: V,
    method: 'Roughly ¥1,000 every three to four days on IC-card rides. The JR Pass was in the program fee.' },
  { id: 'airportTransfer', label: 'Airport transfers', amountUSD: null, status: 'todo', source: SOURCES.author, verifiedOn: V,
    note: 'TODO: Narita Express to Shinjuku on arrival; return leg covered by the JR Pass. Confirm fare.' },
  { id: 'esim', label: 'eSIM, 50 GB', amountUSD: 35, status: 'stated', source: SOURCES.author, verifiedOn: V,
    note: 'Calls were free over FaceTime Audio and WhatsApp.' },
  { id: 'scooter', label: 'LUUP e-scooter subscription', amountUSD: 7, status: 'stated', source: SOURCES.author, verifiedOn: V },
  { id: 'suitcase', label: 'Replacement suitcase', amountUSD: 120, status: 'stated', source: SOURCES.author, verifiedOn: V,
    note: 'Mine broke on a city-transfer day. Budget for one surprise.' },
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
  { id: 'gilmanFall', label: 'Gilman fall cycle student deadline', date: null, status: 'todo', source: 'gilmanscholarship.org/applicants/deadlines-and-timeline/', verifiedOn: V,
    note: 'TODO: verify current cycle dates on the official page before publishing.' },
  { id: 'followOn', label: 'Gilman Follow-on Service Project due', date: null, status: 'todo', source: 'Gilman portal', verifiedOn: V,
    note: 'Six months after return to the U.S. per the Terms and Conditions; confirm the exact date shown in the portal.' },
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
