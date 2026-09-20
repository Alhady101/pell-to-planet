/**
 * The trip record. Every entry traces to one of four first-hand sources:
 *   - ITIN      the program itinerary spreadsheet supplied by Wayne State
 *   - REFLECT   the author's own post-trip reflection written for GSC 4991
 *   - PHOTO     the author's photographs, with their EXIF capture dates
 *   - HOTEL     the accommodation list supplied by the program
 * Nothing here is reconstructed or inferred.
 *
 * Note on structure: the itinerary shows four overnight bases — Tokyo, Osaka,
 * Hamamatsu and Hiroshima — with Kyoto visited as a day trip out of Osaka on
 * June 20. Earlier drafts of this site had Kyoto as an overnight stay; the
 * program itinerary and the hotel list both say otherwise.
 */

export type Src = 'ITIN' | 'REFLECT' | 'PHOTO' | 'HOTEL';

export interface Stop {
  id: string;
  city: string;
  kana: string;
  dates: string;
  range: [string, string];
  /** Day trips are shown differently: no hotel, folded into the previous base. */
  dayTrip?: boolean;
  hotel?: string;
  dek: string;
  academic: { label: string; detail: string; src: Src }[];
  free: { label: string; detail: string; src: Src }[];
  takeaway: string;
}

export const STOPS: Stop[] = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    kana: '東京',
    dates: 'June 14 – 18',
    range: ['2026-06-14', '2026-06-18'],
    hotel: 'The Knot Tokyo Shinjuku',
    dek: 'Landing, and learning to read a city of fourteen million by train map.',
    academic: [
      { label: 'City orientation by open-top bus', detail: 'A hop-on, hop-off double-decker tour across the middle of the day, to get the shape of the city before we started working in it.', src: 'ITIN' },
      { label: 'Tokyo Tower and the palace grounds', detail: 'The 1958 broadcast tower, and a stop at the imperial palace grounds sitting in the middle of the business district.', src: 'REFLECT' },
      { label: 'Tokyo DisneySea', detail: 'A full scheduled day. It sounds like a day off, and it is also the most tightly operated crowd-flow system most of us had ever stood inside.', src: 'ITIN' },
      { label: 'Team dinner and karaoke', detail: 'The scheduled evening where a group of strangers turns into a group.', src: 'ITIN' },
    ],
    free: [
      { label: 'Shibuya Crossing and Don Quijote', detail: 'Went out with classmates to the crossing and the discount megastore everyone ends up in at midnight.', src: 'REFLECT' },
      { label: 'A mountain onsen with a view of Fuji', detail: 'Travelled out of the city on my own to a hot spring looking back over Mount Fuji and the valley below. Then a second, much higher one about four hours out.', src: 'REFLECT' },
      { label: 'Shrines, thrift stores and Tokyo Camii', detail: 'Went looking for the ordinary city rather than the postcard one, and for halal food in every place we stayed.', src: 'REFLECT' },
    ],
    takeaway:
      'An earthquake hit while we were in Tokyo. What struck me was that the engineering was good enough that daily life did not stop. Some people felt it more than others and the city carried on. That was my first real lesson of the trip, and it was not on the itinerary.',
  },
  {
    id: 'osaka',
    city: 'Osaka',
    kana: '大阪',
    dates: 'June 18 – 21',
    range: ['2026-06-18', '2026-06-21'],
    hotel: 'Villa Fontaine Grand Osaka-Umeda',
    dek: 'A classroom with Japanese students, and the part of the trip I could not have planned.',
    academic: [
      { label: 'A morning inside a Japanese university', detail: 'We sat in on a class and spent the rest of the morning networking with students there. The itinerary called it a college visit; in practice it was the first time most of us had worked with Japanese peers.', src: 'ITIN' },
      { label: 'The OpenAI case study', detail: 'We worked through a case on OpenAI — its leadership situation and its stakeholders, Microsoft among them — alongside the students. Cross-cultural communication stopped being a seminar topic and became the actual task.', src: 'REFLECT' },
    ],
    free: [
      { label: 'A remote village, and the people in it', detail: 'Travelled out on my own to a small village and made friends with locals. This is the thing I would not have got from any itinerary.', src: 'REFLECT' },
      { label: 'Invited into a local celebration', detail: 'Got invited to join a Japanese celebration, and separately to dinner by another group. Neither was arranged by anyone.', src: 'REFLECT' },
      { label: 'The river, the arcades, and eating properly', detail: 'Walked the covered shopping arcades and the area by the river, and finally ate well after a week of hunting for halal food.', src: 'REFLECT' },
    ],
    takeaway:
      'The scheduled half of this stop was three hours in a classroom. The half that changed how I travel was a village I went to alone and a celebration I was invited into by strangers. A good program gives you both, but only one of them is printed on the itinerary.',
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    kana: '京都',
    dates: 'June 20 · day trip',
    range: ['2026-06-20', '2026-06-20'],
    dayTrip: true,
    dek: 'One day, out and back from Osaka. The stop that was not about industry, and the one I would not cut.',
    academic: [
      { label: 'Temples, morning and afternoon', detail: 'Out by rail at nine, temples either side of lunch, back to the Osaka hotel by late afternoon. A short day, deliberately.', src: 'ITIN' },
      { label: 'Fushimi Inari Taisha', detail: 'The shrine right off the train station whose path of vermilion gates climbs the mountain behind it. We walked up in the rain.', src: 'REFLECT' },
    ],
    free: [
      { label: 'What we did not get to', detail: 'We did not reach the bamboo grove or the other sites. Parts of our group could not manage more walking that day, so the plan changed. That is a real constraint of travelling as a group, and it is worth knowing before you sign up.', src: 'REFLECT' },
    ],
    takeaway:
      'It would have been easy to treat this as the tourist day between factory visits. It was not. Understanding why a workplace runs the way it does means understanding the place it sits in, and Kyoto was where that clicked.',
  },
  {
    id: 'hamamatsu',
    city: 'Hamamatsu',
    kana: '浜松',
    dates: 'June 21 – 23',
    range: ['2026-06-21', '2026-06-23'],
    hotel: 'Okura Act City Hotel Hamamatsu',
    dek: 'A factory town, and the first production floor of the trip.',
    academic: [
      { label: 'Yamaha piano factory, Kakegawa', detail: 'Rail out at half past eight, on the floor from quarter to ten until half past three. How grand pianos are actually built: where the process is automated for consistency, and where it stays in a person\'s hands because nothing else will do.', src: 'ITIN' },
      { label: 'Team dinner, teppanyaki', detail: 'Cooked in front of us, eaten as a group, with the faculty leader at the table.', src: 'PHOTO' },
    ],
    free: [
      { label: 'An open day to recover', detail: 'The Sunday we arrived was unscheduled. After a week of moving, a day with nothing in it is not wasted time.', src: 'ITIN' },
      { label: 'The hotel was part of the lesson', detail: 'We stayed in the tower that dominates the city, a building designed around music in a town built on instruments. Hamamatsu does not separate what it makes from how it looks.', src: 'REFLECT' },
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
    hotel: 'The Knot Hiroshima',
    dek: 'Three days inside the automotive supply chain, and an afternoon that had nothing to do with it.',
    academic: [
      { label: 'KEYLEX, Yano plant', detail: 'Out by microbus at eight, on the floor from nine. A Mazda supplier, seeing components actually being formed, and how a supplier\'s line is paced by the assembly plant it feeds.', src: 'ITIN' },
      { label: 'Miyajima', detail: 'Straight from the plant to the island shrine the same afternoon, which is a strange and very good way to spend a Wednesday.', src: 'ITIN' },
      { label: 'Mazda headquarters and museum', detail: 'The museum with an interpreter, then an hour of supply chain discussion and questions with Mazda staff. That Q&A was the single most useful hour of the academic programme.', src: 'ITIN' },
      { label: 'Peace Memorial Park and Museum', detail: 'The same afternoon as Mazda. The Atomic Bomb Dome by the river, the museum beside it, and the Orizuru Tower. Very sad, and the most important few hours of the trip.', src: 'ITIN' },
      { label: 'DELTA headquarters', detail: 'A second supplier in the same network, which made the shape of the tier structure visible rather than theoretical. Then Shukkeien Garden and the station for shopping.', src: 'ITIN' },
    ],
    free: [
      { label: 'Two castles and a mountaintop shrine', detail: 'Went with two classmates up to a shrine at the top of a mountain and watched the water run down into the rivers.', src: 'REFLECT' },
      { label: 'Finding halal food, finally', detail: 'Hiroshima was where I found halal ramen and okonomiyaki after a week of not being able to eat the local food properly.', src: 'REFLECT' },
      { label: 'Dinner with our hosts', detail: 'The people we met at Mazda and the suppliers were the part of the week I did not expect to enjoy as much as I did.', src: 'PHOTO' },
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
    saw: 'Grand piano production — robotics and precision machining alongside stages still done by hand.',
    meant: 'Automation is not applied evenly. It goes where consistency matters more than judgement, and deciding where that line falls is an economic question, not only a technical one.',
  },
  {
    site: 'KEYLEX, Yano plant',
    discipline: 'Component manufacturing',
    saw: 'A tier supplier producing formed and stamped parts for Mazda.',
    meant: 'A supplier\'s production schedule is not its own. It is set by the customer\'s assembly line, which is what just-in-time actually means once you are standing in it.',
  },
  {
    site: 'DELTA headquarters',
    discipline: 'Supplier network',
    saw: 'A second supplier in the same regional cluster, two days after the first.',
    meant: 'Suppliers cluster around the assembler for a reason. Geography is a cost in a supply chain, and the map explains the inventory strategy.',
  },
  {
    site: 'Mazda, Hiroshima',
    discipline: 'Assembly, and the chain itself',
    saw: 'The assembler those suppliers feed, plus a dedicated supply chain question-and-answer session with Mazda staff through an interpreter.',
    meant: 'Seeing both ends in one week, and then getting to ask the company how it manages the middle, turned "supply chain" from a term in a syllabus into a set of real buildings with real distances between them.',
  },
];

export const HONEST = [
  {
    head: 'The logistics were harder than the days',
    body: 'Moving between four hotels meant moving luggage, and on transfer days that meant a lot of walking. My suitcase broke and cost me $120 to replace. If I ran it again I would budget for taxis to the station instead of treating that as a luxury.',
  },
  {
    head: 'A group moves at the group\'s pace',
    body: 'We missed sites in Kyoto because not everyone could keep walking. That is not a complaint about anyone, it is the trade. You get a built itinerary, company, and a faculty member who knows the country, and you give up some control over the day.',
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

/** Who helped, and how. Named with their permission or because they are the program's public contact. */
export const THANKS = {
  lead: 'Lori Sisk',
  body:
    'Lori led the program and did a great deal more than lead it. She helped me work out which scholarships were worth applying for, and she put me in front of the people who could actually answer my questions. A lot of what is on this site started as something she pointed me toward. If you are at the start of this, find the person in your own office who will do that for you, and then actually take up their time.',
};
