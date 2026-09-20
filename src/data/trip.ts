/**
 * The trip record. Every entry traces to one of three first-hand sources:
 *   - ITIN      the program itinerary supplied by Wayne State
 *   - REFLECT   the author's own post-trip reflection written for GSC 4991
 *   - PHOTO     the author's photographs, with their EXIF capture dates
 * Nothing here is reconstructed or inferred.
 */

export type Src = 'ITIN' | 'REFLECT' | 'PHOTO';

export interface Stop {
  id: string;
  city: string;
  kana: string;
  dates: string;
  range: [string, string];
  /** One line that sets the scene. */
  dek: string;
  /** Scheduled, academic programme. */
  academic: { label: string; detail: string; src: Src }[];
  /** Free time — the other half of the experience. */
  free: { label: string; detail: string; src: Src }[];
  /** What the author took from the stop, in their own framing. */
  takeaway: string;
}

export const STOPS: Stop[] = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    kana: '東京',
    dates: 'June 14 – 18',
    range: ['2026-06-14', '2026-06-18'],
    dek: 'Landing, and learning to read a city of 14 million by train map.',
    academic: [
      { label: 'City orientation by bus', detail: 'A hop-on, hop-off double-decker tour to get the shape of the city before we started working in it.', src: 'ITIN' },
      { label: 'Tokyo Tower', detail: 'The 1958 broadcast tower, and a first look at how densely Tokyo builds upward.', src: 'REFLECT' },
      { label: 'Imperial Palace grounds', detail: 'A stop at the palace grounds in the middle of the business district.', src: 'REFLECT' },
      { label: 'Team dinner and karaoke', detail: 'The scheduled evening where a group of strangers turns into a group.', src: 'ITIN' },
    ],
    free: [
      { label: 'Shibuya Crossing and Don Quijote', detail: 'Went out with classmates to the crossing and the discount megastore that everyone ends up in.', src: 'REFLECT' },
      { label: 'A mountain onsen with a view of Fuji', detail: 'Travelled out of the city alone to a hot spring looking back over Fuji and the valley.', src: 'REFLECT' },
      { label: 'Shrines, stores and a mosque', detail: 'Went looking for the ordinary city rather than the postcard one, and for halal food in each place we stayed.', src: 'REFLECT' },
    ],
    takeaway:
      'An earthquake hit while we were in Tokyo. What struck me was that the engineering was good enough that daily life did not stop — some people felt it more than others and the city just carried on. That was my first real lesson of the trip, and it was not on the itinerary.',
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    kana: '京都',
    dates: 'June 18 – 20',
    range: ['2026-06-18', '2026-06-20'],
    dek: 'The one stop that was not about industry, and the one I would not cut.',
    academic: [
      { label: 'Fushimi Inari Taisha', detail: 'The shrine right off the train station whose path of vermilion gates climbs the mountain behind it. We walked up in the rain.', src: 'REFLECT' },
    ],
    free: [
      { label: 'What we did not get to', detail: 'We did not reach the bamboo grove or the other sites. Parts of our group could not manage more walking that day, so the plan changed. That is a real constraint of travelling as a group.', src: 'REFLECT' },
    ],
    takeaway:
      'It would have been easy to treat this as the tourist day between factory visits. It was not. Understanding why a workplace runs the way it does means understanding the place it sits in, and Kyoto was where that clicked.',
  },
  {
    id: 'osaka',
    city: 'Osaka',
    kana: '大阪',
    dates: 'June 20 – 23',
    range: ['2026-06-20', '2026-06-23'],
    dek: 'A classroom with Japanese students, and the first factory floor.',
    academic: [
      { label: 'Case study with Japanese university students', detail: 'We worked with students at a local private university on a case about OpenAI — its leadership situation and its stakeholders, Microsoft among them. Cross-cultural communication stopped being a seminar topic and became the actual task.', src: 'REFLECT' },
      { label: 'Yamaha piano factory, Kakegawa', detail: 'A tour of how grand pianos are built: where the process is automated for consistency and where it stays in a person\'s hands because nothing else will do. June 22.', src: 'PHOTO' },
      { label: 'Team dinner, teppanyaki', detail: 'Cooked in front of us, eaten as a group, with the faculty leader at the table.', src: 'PHOTO' },
    ],
    free: [
      { label: 'A remote village, and the people in it', detail: 'Travelled out on my own to a small village and made friends with locals — the part of the trip I could not have planned.', src: 'REFLECT' },
      { label: 'Invited into a local celebration', detail: 'Got invited to join a Japanese celebration, and separately to dinner by another group. Neither was arranged by anyone.', src: 'REFLECT' },
    ],
    takeaway:
      'Yamaha was where the two halves of my degree stopped being separate subjects. You cannot look at that line and only see machines, and you cannot only see logistics. It is one system, and the judgement about which parts stay human is a business decision as much as an engineering one.',
  },
  {
    id: 'hiroshima',
    city: 'Hiroshima',
    kana: '広島',
    dates: 'June 23 – 27',
    range: ['2026-06-23', '2026-06-27'],
    dek: 'Three days inside the automotive supply chain, and one that had nothing to do with it.',
    academic: [
      { label: 'KEYLEX, Yano plant', detail: 'A production tour at a Mazda supplier — seeing components actually being formed, and how a supplier\'s line is paced by the assembly plant it feeds.', src: 'REFLECT' },
      { label: 'DELTA headquarters', detail: 'A second supplier in the same network, which made the shape of the tier structure visible rather than theoretical.', src: 'REFLECT' },
      { label: 'Mazda headquarters and museum', detail: 'The other end of the chain: where all those components become vehicles, plus the company\'s own history of the rotary engine and the 787B that won Le Mans in 1991.', src: 'REFLECT' },
      { label: 'Peace Memorial Park and Museum', detail: 'The Atomic Bomb Dome by the river and the museum beside it. Very sad, and the most important few hours of the trip.', src: 'REFLECT' },
      { label: 'Miyajima and Shukkei-en', detail: 'The island shrine and the garden, both on the scheduled programme.', src: 'ITIN' },
    ],
    free: [
      { label: 'Two castles and a mountaintop shrine', detail: 'Went with two classmates up to a shrine at the top of a mountain and watched the water run down into the rivers.', src: 'REFLECT' },
      { label: 'Finding halal food, finally', detail: 'Hiroshima was where I found halal ramen and okonomiyaki after a week of not being able to eat the local food properly.', src: 'REFLECT' },
    ],
    takeaway:
      'Two typhoons were approaching and part of our group flew home early. The rest of us finished the supplier visits. Seeing KEYLEX and DELTA and then Mazda in the same week is the thing I could not have got from a textbook — the chain as a chain, not as a diagram.',
  },
];

/** The engineering-to-business throughline, which is why this program existed. */
export const CONNECTIONS = [
  {
    site: 'Yamaha, Kakegawa',
    discipline: 'Manufacturing engineering',
    saw: 'Grand piano production — robotics and precision machining alongside stages that are still done by hand.',
    meant: 'Automation is not applied evenly. It goes where consistency matters more than judgement, and the decision of where to draw that line is an economic one.',
  },
  {
    site: 'KEYLEX, Yano plant',
    discipline: 'Component manufacturing',
    saw: 'A tier supplier producing stamped and formed parts for Mazda.',
    meant: 'A supplier\'s production schedule is not its own. It is set by the customer\'s assembly line, which is what just-in-time actually means once you are standing in it.',
  },
  {
    site: 'DELTA headquarters',
    discipline: 'Supplier network',
    saw: 'A second supplier in the same regional cluster.',
    meant: 'Suppliers cluster around the assembler for a reason. Geography is a cost in a supply chain, and the map explains the inventory strategy.',
  },
  {
    site: 'Mazda, Hiroshima',
    discipline: 'Assembly and brand',
    saw: 'The assembler those suppliers feed, plus its museum and engineering history.',
    meant: 'Seeing both ends in one week turned "supply chain" from a term in a syllabus into a set of real buildings with real distances between them.',
  },
];

export const HONEST = [
  {
    head: 'The logistics were harder than the days',
    body: 'Moving between cities meant moving luggage, and on transfer days that meant a lot of walking. My suitcase broke and cost me $120 to replace. If I ran it again I would budget for taxis to the station instead of treating that as a luxury.',
  },
  {
    head: 'A group moves at the group\'s pace',
    body: 'We missed sites in Kyoto because not everyone could keep walking. That is not a complaint about anyone — it is the trade. You get a built itinerary, company, and a faculty member who knows the country, and you give up some control over the day.',
  },
  {
    head: 'Weather and plans',
    body: 'Two typhoons were forecast near the end and some of the group left early. Short programs have no slack in them, so anything that moves the schedule costs you a site.',
  },
  {
    head: 'It ends quickly',
    body: 'Fourteen days is long enough to change how you think and too short to get comfortable. If I went again it would be for longer, and I would still take the two weeks over not going.',
  },
];
