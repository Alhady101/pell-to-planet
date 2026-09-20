/**
 * The funding directory.
 *
 * Amounts published here are only ones with a verified official source or a
 * primary document the author holds. Where a figure moves every year and the
 * official page is the authority, the entry says so and links out instead of
 * snapshotting a number that will quietly go stale.
 *
 * All official facts below were verified against the linked pages on
 * 2026-09-20. `confirmed` marks an entry whose specifics come from a primary
 * document or an official page read on that date.
 */
export type Tier = 'federal' | 'campus' | 'national';

export interface Award {
  id: string;
  name: string;
  tier: Tier;
  amount: string;
  received?: { amountUSD: number; note: string };
  who: string;
  requires: string[];
  timing: string;
  url: string;
  urlLabel: string;
  note?: string;
  confirmed: boolean;
}

export const TIERS: { id: Tier; label: string; dek: string }[] = [
  {
    id: 'federal',
    label: 'Start here — federal aid',
    dek: 'The base layer. It is need-based, it is already in your file if you have filed a FAFSA, and every other conversation builds on it.',
  },
  {
    id: 'campus',
    label: 'Then your own campus',
    dek: 'The least competitive money you will ever apply for, because the applicant pool is only your university. It is also the least advertised, which is the whole problem.',
  },
  {
    id: 'national',
    label: 'Then the national awards',
    dek: 'Bigger, harder, and worth the essays. These are the ones that decide whether a program is possible at all.',
  },
];

export const AWARDS: Award[] = [
  /* ---------------- federal ---------------- */
  {
    id: 'pell',
    name: 'Federal Pell Grant',
    tier: 'federal',
    amount: 'A need-based grant. The maximum for the 2026–27 award year is $7,395 and the minimum is $740.',
    received: { amountUSD: 3697, note: 'Posted to my Spring/Summer 2026 term on May 21, 2026.' },
    who: 'Undergraduates with demonstrated financial need who have filed a FAFSA.',
    requires: [
      'A FAFSA on file for the correct award year',
      'Your aid is processed by your home U.S. institution, not the school abroad',
      'It pays against a TERM, so it is shared across every course you take that term',
    ],
    timing: 'Disburses on your school\'s normal schedule for the term, which is often after your program payments are due.',
    url: 'https://studentaid.gov/understand-aid/types/grants/pell',
    urlLabel: 'Federal Student Aid: Pell Grant',
    note: 'The mechanism matters and is widely misstated. A student enrolled directly at a foreign school cannot receive Pell at all. A student on a study abroad program approved for credit by a U.S. home institution has their aid processed at home — so Pell follows you through your own university. Receiving Pell is also what makes you eligible to apply for Gilman.',
    confirmed: true,
  },
  {
    id: 'summerPell',
    name: 'Year-round (summer) Pell',
    tier: 'federal',
    amount: 'Up to 150% of your Pell Scheduled Award across one award year, rather than the usual 100%.',
    who: 'Pell-eligible students enrolling in a summer term on top of a full year.',
    requires: [
      'You still get the same amount per payment period — the extra 50% funds the additional term',
      'Normal duration-of-eligibility and lifetime limits still apply',
      'Ask your financial aid office how it applies to your specific enrolment',
    ],
    timing: 'Applies to the summer term. Ask before you register, not after.',
    url: 'https://fsapartners.ed.gov/knowledge-center/fsa-handbook/2026-2027/vol7/ch5-summer-terms-crossover-payment-periods-and-year-round-pell',
    urlLabel: 'FSA Handbook: year-round Pell',
    note: 'This is what lets a summer study abroad term be funded without eating into your fall and spring. My program ran in a summer term, and this is the rule that made the aid available.',
    confirmed: true,
  },
  {
    id: 'fseog',
    name: 'Federal SEOG',
    tier: 'federal',
    amount: 'From $100 up to about $4,000 for a full academic year — but a school may award as much as $4,400 to a student on a study abroad program.',
    received: { amountUSD: 1000, note: 'Awarded per semester in my 2025–26 package.' },
    who: 'Undergraduates with exceptional financial need. First priority goes to the lowest-SAI students who are also receiving Pell.',
    requires: [
      'A FAFSA on file, filed early',
      'Your school must participate, and it awards from a fixed annual pot',
      'The study abroad program must be approved for credit by your home school',
    ],
    timing: 'Awarded with your aid package. It is campus-based, so schools genuinely run out of it.',
    url: 'https://fsapartners.ed.gov/knowledge-center/fsa-handbook/2026-2027/vol6/ch6-federal-supplemental-educational-opportunity-grant-program',
    urlLabel: 'FSA Handbook: FSEOG',
    note: 'The $4,400 study abroad ceiling is the most under-known number in this whole directory. Most students, and plenty of staff, only know the $4,000 figure. Ask about it by name.',
    confirmed: true,
  },
  {
    id: 'coa',
    name: 'A cost-of-attendance review',
    tier: 'federal',
    amount: 'Not money. A change to the budget your aid eligibility is calculated against.',
    who: 'Any student on an approved, credit-bearing study abroad program.',
    requires: [
      'Your program budget sheet',
      'The tuition estimate for the term',
      'A flight quote for your actual dates',
      'Ask the financial aid office which form or process they use',
    ],
    timing: 'Ask months before you pay anything. An adjustment changes what you are eligible for, not what you are guaranteed.',
    url: 'https://fsapartners.ed.gov/knowledge-center/fsa-handbook/2026-2027/vol3/ch2-cost-attendance-budget',
    urlLabel: 'FSA Handbook: cost of attendance',
    note: 'The federal rule is explicit: for a student on a study abroad program approved for credit by their home school, the cost of attendance includes the reasonable costs of that study, as the home school determines them. That sentence is the reason this conversation is worth having.',
    confirmed: true,
  },

  /* ---------------- campus ---------------- */
  {
    id: 'studyAbroadOffice',
    name: 'Ask the study abroad office first',
    tier: 'campus',
    amount: 'Varies. At Wayne State, one departmental page describes study abroad grants of $250 to $1,500 depending on program length and application quality.',
    who: 'Students accepted onto an approved program.',
    requires: [
      'An accepted place, or an application in progress',
      'Ask directly — a lot of this is not posted anywhere you would find it',
    ],
    timing: 'As soon as you are accepted. Departmental cycles rarely match the central ones.',
    url: 'https://oip.wayne.edu/study-abroad',
    urlLabel: 'WSU Office of Study Abroad and Global Programs',
    note: 'The $250–$1,500 range appears on a College of Liberal Arts and Sciences page rather than on the study abroad office\'s own site, and carries no published deadline. That is exactly why the instruction is to ask a person rather than to trust a page.',
    confirmed: true,
  },
  {
    id: 'globalExperiences',
    name: 'Endowed and departmental awards',
    tier: 'campus',
    amount: 'Varies, and frequently unadvertised. Mine arrived as a line on my student account rather than as something I applied for from a list.',
    received: { amountUSD: 1000, note: 'Posted to my account as a Global Experiences endowed award, trip-specific.' },
    who: 'Depends entirely on the endowment. Often a specific major, college, destination or program.',
    requires: [
      'Ask your academic advisor and your department by name',
      'Ask the study abroad office what endowed funds exist for your program',
      'Ask whether anything is awarded without an application',
    ],
    timing: 'No pattern. Ask early and ask twice.',
    url: 'https://oip.wayne.edu/study-abroad',
    urlLabel: 'WSU Office of Study Abroad and Global Programs',
    note: 'This is the single most useful thing on this page. I received $1,000 from an endowed award I cannot find listed publicly anywhere on my own university\'s website. If I had relied on what was advertised, I would never have known it existed. Ask a human what exists.',
    confirmed: true,
  },
  {
    id: 'ilitch',
    name: 'The one I applied for and did not get',
    tier: 'campus',
    amount: 'A named study abroad scholarship at my own business school.',
    who: 'Students on an approved program, by the terms of that particular award.',
    requires: [
      'Two essays, on my goals and on my cultural preparation',
      'Submitted well before departure',
      'They chose other students. That is the normal outcome.',
    ],
    timing: 'Its own cycle, separate from everything else I applied for.',
    url: 'https://oip.wayne.edu/study-abroad',
    urlLabel: 'WSU Office of Study Abroad and Global Programs',
    note: 'I am listing this because the rest of the page could read as though every application worked. It did not. I wrote two essays for this one and was not selected, and I still went, because I had applied to enough other things that losing one did not end it. Apply to more than you think you need to.',
    confirmed: true,
  },
  {
    id: 'campusScholarships',
    name: 'General university scholarships',
    tier: 'campus',
    amount: 'Varies. Several of mine ran from a few hundred to a few thousand dollars per semester.',
    who: 'Enrolled students, by all sorts of criteria.',
    requires: [
      'A scholarship-matching portal account, for general awards',
      'Report any outside award you win so your package can be reviewed',
    ],
    timing: 'Wayne State\'s annual scholarship application period runs October 1 to March 1 — long before a summer program starts.',
    url: 'https://wayne.scholarshipuniverse.com/',
    urlLabel: 'WSU Scholarship Universe',
    note: 'Important limitation: Wayne State states that study abroad scholarships are excluded from Scholarship Universe. Use the portal for general scholarships, but do not go looking for study abroad money there — it is not in it. Go to the study abroad office and your department instead.',
    confirmed: true,
  },
  {
    id: 'disbursementTiming',
    name: 'The disbursement trap',
    tier: 'campus',
    amount: 'Not an award. The rule that decides whether your money arrives before or after you need it.',
    who: 'Every student using federal aid for study abroad.',
    requires: [
      'Ask for your disbursement date in writing',
      'Compare it against every program payment deadline',
      'Ask what happens if a payment falls due first',
    ],
    timing: 'Wayne State disburses aid within four weeks of receiving all your materials, or at the beginning of the study abroad period — whichever is later.',
    url: 'https://wayne.edu/financial-aid/applying/studyabroad',
    urlLabel: 'WSU: financial aid for study abroad',
    note: '"Whichever occurs later" is the part that caught me. Every program payment I made landed before a single award did. If you cannot float that gap, you need to know months ahead, not weeks.',
    confirmed: true,
  },

  /* ---------------- national ---------------- */
  {
    id: 'gilman',
    name: 'Benjamin A. Gilman International Scholarship',
    tier: 'national',
    amount: 'Up to $5,000, plus a STEM supplement of up to $1,000 and a Critical Need Language Award of up to $3,000 — a combined ceiling of $9,000.',
    received: { amountUSD: 2500, note: 'Awarded April 30, 2026 for my Japan program. Base award only.' },
    who: 'U.S. citizen or national undergraduates receiving a Federal Pell Grant, on a credit-bearing program abroad.',
    requires: [
      'Receiving Pell when you apply, or proof you will during your time abroad',
      'A credit-bearing program at your home institution',
      'A destination at State Department Travel Advisory Level 1 or 2',
      'Two advisors at your school must certify your application, on their own deadline',
    ],
    timing: 'Runs in cycles, each with a student deadline, an advisor certification deadline about a week later, and a window of eligible program start dates. Match the cycle to your program.',
    url: 'https://www.gilmanscholarship.org/',
    urlLabel: 'Gilman Scholarship Program',
    note: 'No minimum program length, and no minimum GPA. More than 3,100 scholarships are awarded annually, and around half of recipients are first-generation college students. This site is my Follow-on Service Project — there is a full chapter on the application.',
    confirmed: true,
  },
  {
    id: 'fea',
    name: 'Fund for Education Abroad',
    tier: 'national',
    amount: 'Varies by scholarship and is not published as a general range. Named awards include Access Partner Scholarships of up to $5,000.',
    who: 'U.S. citizens, permanent residents and DACA recipients enrolled as undergraduates, with demonstrated financial need.',
    requires: [
      'At least 14 days abroad — the shortest minimum of any award here',
      'Credit at your home institution',
      'No prior study abroad after high school graduation',
      'Need is met by any one of: an SAI below 20,000, Pell eligibility, or having taken any student loans',
    ],
    timing: 'Cycles by term abroad. The Winter/Spring 2027 cycle closed on September 16, 2026; the Summer/Fall 2027 application was expected to open in late 2026.',
    url: 'https://www.fundforeducationabroad.org/apply/',
    urlLabel: 'Fund for Education Abroad',
    note: 'The 14-day minimum is what makes this one viable for short programs at all. Worth investigating. I am not claiming to have received it.',
    confirmed: true,
  },
  {
    id: 'boren',
    name: 'Boren Awards',
    tier: 'national',
    amount: '$8,000 for 8–11 weeks (STEM majors only), $12,500 for 12–24 weeks, $25,000 for 25–52 weeks.',
    who: 'U.S. citizens only, matriculated undergraduates, studying a language and region tied to national security.',
    requires: [
      'Language study is central, not optional',
      'Normally a 12-week minimum, but STEM majors may propose summer programs of 8 weeks or longer',
      'A federal service requirement afterwards, beginning within three years of graduating',
    ],
    timing: 'The 2027–28 undergraduate deadline is January 27, 2027 at 5 p.m. Eastern. Check for a campus deadline before that.',
    url: 'https://www.borenawards.org/',
    urlLabel: 'Boren Awards',
    note: 'The 8-week STEM exception is the part worth knowing if you are in engineering. Note that Boren is not a need-based award, and its graduate fellowship has a different, earlier deadline that is easy to confuse with this one.',
    confirmed: true,
  },
  {
    id: 'cls',
    name: 'Critical Language Scholarship',
    tier: 'national',
    amount: 'A fully funded summer language institute abroad, run by the U.S. Department of State. No dollar figure is published.',
    who: 'U.S. undergraduate and graduate students. Several languages require no prior study.',
    requires: [
      'It is a language program, not a disciplinary one',
      'Highly competitive',
      'Read the eligibility page for the cycle you are applying to, not an older one',
    ],
    timing: 'The 2026 application has closed and the 2027 application was expected to become available in late 2026. No 2027 deadline had been published as of September 2026.',
    url: 'https://clscholarship.org/apply',
    urlLabel: 'Critical Language Scholarship',
    confirmed: true,
  },
  {
    id: 'freeman',
    name: 'Freeman-ASIA',
    tier: 'national',
    amount: 'Up to $3,000 for a summer program, $5,000 for a semester or quarter, $7,000 for an academic or calendar year.',
    who: 'U.S. citizens and permanent residents, undergraduates with demonstrated financial need, studying in East or Southeast Asia.',
    requires: [
      'Your destination must be in East or Southeast Asia — Japan qualifies',
      'Demonstrated financial need',
      'Administered by the Institute of International Education',
    ],
    timing: 'Between cycles as of September 2026. The next application was anticipated to open in February 2027; no deadline had been announced.',
    url: 'https://www.iie.org/programs/freeman-asia/',
    urlLabel: 'Freeman-ASIA',
    note: 'If your program is in Asia and you are Pell-eligible, this stacks naturally alongside Gilman. I did not know it existed when I applied.',
    confirmed: true,
  },
  {
    id: 'phikappaphi',
    name: 'Phi Kappa Phi Study Abroad Grant',
    tier: 'national',
    amount: 'Fifty grants of $1,000 are awarded each year.',
    who: 'Undergraduates at institutions with an active Phi Kappa Phi chapter. Membership is not required.',
    requires: [
      'A cumulative GPA of 3.75 or higher on a 4.0 scale',
      'Applied to or accepted into an accredited program before the deadline',
      'Your institution must have an active chapter',
    ],
    timing: 'The application portal opens December 15, 2026 with a March 15, 2027 deadline, for programs beginning May 1, 2027 to June 30, 2028.',
    url: 'https://www.phikappaphi.org/grants-awards/study-abroad',
    urlLabel: 'Phi Kappa Phi study abroad grants',
    note: 'The GPA bar is high and real. If you clear it, fifty grants a year is far better odds than most national awards.',
    confirmed: true,
  },
];

export const ORDER = [
  { n: '01', head: 'File the FAFSA', body: 'Everything need-based hangs off it, including your Gilman eligibility. File early — SEOG is campus-based and schools run out.' },
  { n: '02', head: 'Get the program budget in writing', body: 'Ask what the fee includes and what is billed separately. You cannot plan against a number you have not seen.' },
  { n: '03', head: 'Ask your campus, out loud', body: 'Study abroad office first, then your department. This is the least competitive money and the worst advertised. A $1,000 award reached me that I have still never seen listed anywhere.' },
  { n: '04', head: 'Apply for the national awards', body: 'Gilman if you receive Pell, plus anything that fits your destination and field. The essays take real time, and your advisors have their own deadline.' },
  { n: '05', head: 'Request the cost-of-attendance review', body: 'Bring the budget, the tuition estimate and a flight quote. Ask what it changes, and ask about the $4,400 SEOG study abroad ceiling by name.' },
  { n: '06', head: 'Line the dates up', body: 'For every award, ask when it is decided and when it actually pays. Then compare that against every payment deadline.' },
];
