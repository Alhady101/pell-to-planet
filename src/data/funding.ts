/**
 * The funding directory.
 *
 * `amount` is deliberately a STRING describing the shape of the award rather
 * than a hard number, because published maxima move every year and a stale
 * figure on a public page is worse than none. Anything stated as a specific
 * dollar amount is one the author personally received and can document.
 *
 * `confirmed` marks what came from a primary document the author holds.
 * Everything else routes the reader to the official page for the live number.
 */
export type Tier = 'federal' | 'campus' | 'national';

export interface Award {
  id: string;
  name: string;
  tier: Tier;
  /** Shape of the award, not a promise of an amount. */
  amount: string;
  /** Did the author actually receive this, and can they document it? */
  received?: { amountUSD: number; note: string };
  who: string;
  requires: string[];
  timing: string;
  url: string;
  urlLabel: string;
  note?: string;
  /** True when the facts here come from a document the author holds. */
  confirmed: boolean;
}

export const TIERS: { id: Tier; label: string; dek: string }[] = [
  {
    id: 'federal',
    label: 'Start here — federal aid',
    dek: 'The base layer. It is need-based, it is already in your file if you have filed a FAFSA, and it is the thing every other conversation builds on.',
  },
  {
    id: 'campus',
    label: 'Then your own campus',
    dek: 'The least competitive money you will ever apply for, because the applicant pool is only your university. This is where I found the most per hour of effort.',
  },
  {
    id: 'national',
    label: 'Then the national awards',
    dek: 'Bigger, harder, and worth the essays. These are the ones that change whether a program is possible at all.',
  },
];

export const AWARDS: Award[] = [
  /* ---------------- federal ---------------- */
  {
    id: 'pell',
    name: 'Federal Pell Grant',
    tier: 'federal',
    amount: 'A need-based grant set each award year. Check the current maximum on the official page.',
    received: { amountUSD: 3697, note: 'Posted to my Spring/Summer 2026 term on May 21, 2026.' },
    who: 'Undergraduates with demonstrated financial need who have filed a FAFSA.',
    requires: [
      'A FAFSA on file for the correct award year',
      'Enrolment in an eligible program',
      'It pays against a TERM, so it is shared across every course you take that term',
    ],
    timing: 'Disburses on your school\'s normal schedule for the term, which is often after your program payments are due.',
    url: 'https://studentaid.gov/understand-aid/types/grants/pell',
    urlLabel: 'Federal Student Aid: Pell Grant',
    note: 'Receiving Pell is what makes you eligible to apply for Gilman. It is the single most important line in this directory.',
    confirmed: true,
  },
  {
    id: 'fseog',
    name: 'Federal SEOG',
    tier: 'federal',
    amount: 'A supplemental grant for students with exceptional need. Funds are limited and awarded by the school.',
    received: { amountUSD: 1000, note: 'Awarded per semester in my 2025–26 package.' },
    who: 'Undergraduates with exceptional financial need, prioritised to Pell recipients.',
    requires: [
      'A FAFSA on file',
      'Your school must participate, and it awards from a fixed pot',
      'Apply early — schools run out',
    ],
    timing: 'Awarded with your aid package, disbursed with the term.',
    url: 'https://studentaid.gov/understand-aid/types/grants/fseog',
    urlLabel: 'Federal Student Aid: FSEOG',
    confirmed: true,
  },
  {
    id: 'coa',
    name: 'A cost-of-attendance review',
    tier: 'federal',
    amount: 'Not money. A change to the budget your eligibility is calculated against.',
    who: 'Any student on an approved, credit-bearing study abroad program.',
    requires: [
      'Your program budget sheet',
      'The tuition estimate for the term',
      'A flight quote for your actual dates',
      'Ask the financial aid office what form they use',
    ],
    timing: 'Ask months before you pay anything. An adjustment changes what you are eligible for, not what you are guaranteed.',
    url: 'https://studentaid.gov/help-center/answers/article/what-is-cost-of-attendance',
    urlLabel: 'Federal Student Aid: cost of attendance',
    note: 'This is the step most students never hear about. It does not hand you a cheque, but it can change what else you qualify for.',
    confirmed: false,
  },

  /* ---------------- campus ---------------- */
  {
    id: 'globalExperiences',
    name: 'WSU Global Experiences Scholarship',
    tier: 'campus',
    amount: 'A campus study abroad award administered through the Office of International Programs.',
    received: { amountUSD: 1000, note: 'Trip-specific. Applied directly to my Japan program.' },
    who: 'Wayne State students on an approved study abroad program.',
    requires: [
      'An accepted place on a WSU study abroad program',
      'Ask the study abroad office directly — this is not always advertised widely',
    ],
    timing: 'Ask about it as soon as you are accepted, not after.',
    url: 'https://abroad.wayne.edu/',
    urlLabel: 'WSU Study Abroad',
    note: 'This was the easiest $1,000 of my whole funding stack, and I nearly missed it because I did not know to ask.',
    confirmed: true,
  },
  {
    id: 'departmental',
    name: 'Departmental and college awards',
    tier: 'campus',
    amount: 'Varies enormously. Often small, often uncontested.',
    who: 'Students in a specific major, college or student group.',
    requires: [
      'Ask your academic advisor and your department directly',
      'Some are never posted publicly — they are awarded by whoever remembers them',
    ],
    timing: 'Departmental cycles rarely match the central ones. Ask early and ask twice.',
    url: 'https://wayne.scholarshipuniverse.com/',
    urlLabel: 'WSU Scholarship Universe',
    note: 'The email script on the tools page is written for exactly this conversation.',
    confirmed: false,
  },
  {
    id: 'campusScholarships',
    name: 'General university scholarships',
    tier: 'campus',
    amount: 'Varies. Several of mine were a few hundred to a few thousand dollars per semester.',
    who: 'Enrolled students, by all sorts of criteria.',
    requires: [
      'A scholarship-matching portal account',
      'Report any outside award you win to financial aid so your package can be reviewed',
    ],
    timing: 'Mostly annual cycles that close long before a summer program starts.',
    url: 'https://wayne.scholarshipuniverse.com/',
    urlLabel: 'WSU Scholarship Universe',
    confirmed: false,
  },

  /* ---------------- national ---------------- */
  {
    id: 'gilman',
    name: 'Benjamin A. Gilman International Scholarship',
    tier: 'national',
    amount: 'A scholarship from the U.S. Department of State for Pell recipients studying or interning abroad for credit. Award sizes vary; supplements exist for some destinations and languages.',
    received: { amountUSD: 2500, note: 'Awarded April 30, 2026 for my Japan program.' },
    who: 'U.S. citizen undergraduates receiving a Federal Pell Grant, on a credit-bearing program abroad.',
    requires: [
      'You must be receiving Pell when you apply or during your time abroad',
      'The program must be credit-bearing at your home institution',
      'Two advisors at your school have to certify your application',
      'You commit to a Follow-on Service Project when you return',
    ],
    timing: 'Runs in cycles. Each has a student deadline, an advisor certification deadline a week or so later, and a window of eligible program start dates — so match the cycle to your program, not to the calendar.',
    url: 'https://www.gilmanscholarship.org/',
    urlLabel: 'Gilman Scholarship Program',
    note: 'This site you are reading is my Follow-on Service Project. There is a full chapter on the application.',
    confirmed: true,
  },
  {
    id: 'fea',
    name: 'Fund for Education Abroad',
    tier: 'national',
    amount: 'A national scholarship for students underrepresented in study abroad.',
    who: 'U.S. undergraduates, including permanent residents and DACA recipients, with financial need.',
    requires: [
      'Check the current minimum program length — short programs are not always eligible',
      'Credit must transfer to your home institution',
      'Eligibility rules have changed before; read the current page rather than an old blog post',
    ],
    timing: 'An annual cycle. Confirm the current deadline on the official site.',
    url: 'https://fundforeducationabroad.org/applicants/',
    urlLabel: 'Fund for Education Abroad',
    note: 'An option worth investigating. I am not claiming to have received it.',
    confirmed: false,
  },
  {
    id: 'boren',
    name: 'Boren Awards',
    tier: 'national',
    amount: 'Funding for U.S. students studying languages and regions deemed critical to national security. Carries a federal service requirement.',
    who: 'U.S. undergraduates studying an eligible language in an eligible country.',
    requires: [
      'Language study is central, not optional',
      'A service requirement in the federal government afterwards',
      'Check whether summer-only programs are eligible for your field',
    ],
    timing: 'An annual cycle with a campus deadline before the national one.',
    url: 'https://www.borenawards.org/',
    urlLabel: 'Boren Awards',
    confirmed: false,
  },
  {
    id: 'cls',
    name: 'Critical Language Scholarship',
    tier: 'national',
    amount: 'A fully funded summer language institute abroad, run by the U.S. Department of State.',
    who: 'U.S. undergraduate and graduate students. Several languages require no prior study.',
    requires: [
      'It is a language program, not a disciplinary one',
      'Highly competitive',
    ],
    timing: 'Applications typically open in the autumn for the following summer.',
    url: 'https://clscholarship.org/',
    urlLabel: 'Critical Language Scholarship',
    confirmed: false,
  },
];

/** Everything a student should ask, in the order the money actually moves. */
export const ORDER = [
  { n: '01', head: 'File the FAFSA', body: 'Everything need-based hangs off it, including your Gilman eligibility. Do it for the right award year.' },
  { n: '02', head: 'Get the program budget in writing', body: 'Ask what the fee includes and what is billed separately. You cannot plan against a number you have not seen.' },
  { n: '03', head: 'Ask your campus first', body: 'Study abroad office, then your department. This is the least competitive money and the fastest to find out about.' },
  { n: '04', head: 'Apply for the national awards', body: 'Gilman if you are a Pell recipient, plus anything else that fits your program. The essays take real time.' },
  { n: '05', head: 'Request the cost-of-attendance review', body: 'Bring the budget, the tuition estimate and a flight quote. Ask what it changes.' },
  { n: '06', head: 'Line the dates up', body: 'For every award, ask when it is decided and when it pays. Compare that against every payment deadline.' },
];
