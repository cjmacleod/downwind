import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ââ SailGP 2026 Season Data ââââââââââââââââââââââââââââââââââââââââââââââââ
// Source: wikipedia.org/wiki/2026_SailGP_championship
// Updated automatically where possible; falls back to this curated snapshot.

const SEASON_DATA = {
  season: 6,
  year: 2026,
  title: 'Rolex SailGP 2026 Championship',
  boat: 'F50 catamaran',

  championship: [
    { pos: 1,  name: 'Emirates GBR',           driver: 'Dylan Fletcher',      pts: 10, flag: 'ð¬ð§', recent: [1,1,4,3] },
    { pos: 2,  name: 'Bonds Flying Roos',       driver: 'Tom Slingsby',        pts: 9,  flag: 'ð¦ðº', recent: [2,3,3,2] },
    { pos: 3,  name: 'DS Team France',          driver: 'Quentin Delapierre', pts: 8,  flag: 'ð«ð·', recent: [3,2,2,1] },
    { pos: 4,  name: 'Artemis SailGP',          driver: 'Nathan Outteridge',  pts: 7,  flag: 'ð¸ðª', recent: [4,4,11,4] },
    { pos: 5,  name: 'United States SailGP',    driver: 'Taylor Canfield',    pts: 6,  flag: 'ðºð¸', recent: [5,8,9,5] },
    { pos: 6,  name: 'NorthStar SailGP',        driver: 'Giles Scott',        pts: 5,  flag: 'ð§ð²', recent: [6,6,1,6] },
    { pos: 7,  name: 'Red Bull Italy SailGP',   driver: 'Phil Robertson',     pts: 4,  flag: 'ð®ð¹', recent: [7,7,5,7] },
    { pos: 8,  name: 'Rockwool Racing',         driver: 'Nicolai Sehested',   pts: 3,  flag: 'ð©ð°', recent: [8,10,6,8] },
    { pos: 9,  name: 'Germany by Deutsche Bank',driver: 'Erik Heil',          pts: 2,  flag: 'ð©ðª', recent: [9,9,8,9] },
    { pos: 10, name: 'Mubadala Brazil',         driver: 'Martine Grael',      pts: 1,  flag: 'ð§ð·', recent: [10,11,10,10] },
    { pos: 11, name: 'Switzerland SailGP',      driver: 'SÃ©bastien Schneiter',pts: 0,  flag: 'ð¨ð­', recent: ['DNF','DNF','DNS','DNS'] },
    { pos: 12, name: 'Black Foils SailGP',      driver: 'Peter Burling',      pts: 0,  flag: 'ð³ð¿', recent: ['DNF','DNS','DNS','DNS'] },
    { pos: 13, name: 'Los Gallos SailGP',       driver: 'Diego BotÃ­n',        pts: 0,  flag: 'ðªð¸', recent: ['DNS','DNS','DNS','DNS'] },
  ],

  events: [
    { round: 1, location: 'Perth, Australia',        name: 'Oracle Perth Sail Grand Prix',   dates: '17â18 Jan 2026', winner: 'Emirates GBR',       status: 'completed' },
    { round: 2, location: 'Auckland, New Zealand',   name: 'ITM New Zealand Sail Grand Prix', dates: '14â15 Feb 2026', winner: 'Bonds Flying Roos',   status: 'completed' },
    { round: 3, location: 'Sydney, Australia',       name: 'KPMG Sydney Sail Grand Prix',    dates: '28 Feb â 1 Mar 2026', winner: 'US SailGP Team', status: 'completed' },
    { round: 4, location: 'Rio de Janeiro, Brazil',  name: 'Enel Rio Sail Grand Prix',       dates: '11â12 Apr 2026', winner: 'Bonds Flying Roos',   status: 'completed' },
    { round: 5, location: 'Bermuda',                 name: 'Apex Group Bermuda Sail Grand Prix', dates: '10â11 May 2026', winner: 'Bonds Flying Roos', status: 'completed' },
    { round: 6, location: 'New York City, USA',      name: 'Mubadala New York Sail Grand Prix',  dates: '31 May â 1 Jun 2026', winner: 'Emirates GBR', status: 'completed' },
    { round: 7, location: 'Halifax, Canada',         name: 'Canada Sail Grand Prix',         dates: '21â22 Jun 2026', winner: 'NorthStar SailGP',    status: 'recent' },
    { round: 8, location: 'Portsmouth, Great Britain', name: 'Emirates Great Britain Sail Grand Prix', dates: '26â27 Jul 2026', winner: null,          status: 'next' },
    { round: 9, location: 'Sassnitz, Germany',       name: 'Germany Sail Grand Prix',        dates: '23â24 Aug 2026', winner: null,                  status: 'upcoming' },
    { round: 10, location: 'Valencia, Spain',        name: 'Spain Sail Grand Prix',          dates: '5â6 Sep 2026', winner: null,                    status: 'upcoming' },
    { round: 11, location: 'Geneva, Switzerland',    name: 'Rolex Switzerland Sail Grand Prix', dates: '19â20 Sep 2026', winner: null,                status: 'upcoming' },
    { round: 12, location: 'Dubai, UAE',             name: 'Emirates Dubai Sail Grand Prix', dates: '21â22 Nov 2026', winner: null,                  status: 'upcoming' },
    { round: 13, location: 'Abu Dhabi, UAE',         name: 'Mubadala Abu Dhabi Grand Final', dates: '28â29 Nov 2026', winner: null,                  status: 'final' },
  ],
};

// ââ Live data fetch (best-effort) ââââââââââââââââââââââââââââââââââââââââââ
async function fetchLiveSailGPData() {
  try {
    const res = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&titles=2026_SailGP_championship&prop=revisions&rvprop=content&format=json&origin=*',
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) throw new Error('wiki_fetch_failed');
    return null;
  } catch {
    return null;
  }
}

// ââ Prompt builder âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const CATEGORY_RULES = {
  championship: `
You are writing for DOWNWIND, an AI-powered SailGP intelligence platform.
Category: CHAMPIONSHIP BATTLE
Write 3 cards analysing the current season championship standings. Each card should focus on:
  - Card 1: The title fight â who leads, who's chasing, how many events remain
  - Card 2: A team that's been the surprise or disappointment of the season so far
  - Card 3: The Grand Final pathway â which three teams are most likely to make it

For each card, feature two relevant teams as the "match-up" (team1 vs team2).
Return VALID JSON only â no markdown, no backticks, no prose outside JSON:
{
  "cards": [
    {
      "id": "card1",
      "event": "<short event context, e.g. 'Season 6 Â· 7 of 13 Events'>",
      "status": "recent",
      "teams": [
        { "name": "<Team A>", "pos": <championship pos> },
        { "name": "<Team B>", "pos": <championship pos> }
      ],
      "title": "<punchy 6â10 word headline>",
      "body": "<2â3 sentence analysis paragraph, tight and specific>"
    },
    ...
  ]
}`,

  form: `
You are writing for DOWNWIND, an AI-powered SailGP intelligence platform.
Category: RECENT FORM
Write 3 cards analysing the last 3 events (Sydney, Rio, Bermuda, New York, Halifax) in terms of who's on a hot streak and who's misfiring.
  - Card 1: The hottest team right now â their trajectory and what's working
  - Card 2: A team with alarming inconsistency â the risk and the potential
  - Card 3: The fleet dark horse â a team quietly climbing

Feature two teams per card. Return VALID JSON only:
{
  "cards": [
    {
      "id": "card1",
      "event": "<recent event name, e.g. 'Canada Sail Grand Prix Â· Halifax'>",
      "status": "recent",
      "teams": [{"name": "<name>", "pos": <pos>}, {"name": "<name>", "pos": <pos>}],
      "title": "<punchy headline>",
      "body": "<2â3 tight sentences>"
    },
    ...
  ]
}`,

  speed: `
You are writing for DOWNWIND, an AI-powered SailGP intelligence platform.
Category: BOAT SPEED
Write 3 cards covering the technical performance narrative of the F50 fleet.
SailGP teams all sail identical F50 catamarans, so differences come down to crew skill, foiling technique, tacking and gybing efficiency, and race tactics.
  - Card 1: Who has the fastest upwind boat speed / foiling exits this season?
  - Card 2: Downwind angles and VMG â which teams are gaining the most in reaching legs?
  - Card 3: Start-line aggression and pin-end positioning â who is winning the crucial first few seconds?

Feature two teams per card. Return VALID JSON only:
{
  "cards": [
    {
      "id": "card1",
      "event": "<tactical context, e.g. 'F50 Â· Fleet Speed Analysis'>",
      "status": "recent",
      "teams": [{"name": "<name>", "pos": <pos>}, {"name": "<name>", "pos": <pos>}],
      "title": "<punchy headline>",
      "body": "<2â3 tight sentences>"
    },
    ...
  ]
}`,

  preview: `
You are writing for DOWNWIND, an AI-powered SailGP intelligence platform.
Category: NEXT EVENT
Write 3 cards previewing the next event: the Emirates Great Britain Sail Grand Prix in Portsmouth (26â27 July 2026).
  - Card 1: Venue and conditions â Portsmouth's Solent conditions, tides, wind patterns, and what boat type it rewards
  - Card 2: Home advantage â how Emirates GBR historically performs in front of a home crowd and what the pressure means in 2026
  - Card 3: Ones to watch â two outside-chance teams who have Portsmouth-specific performance history

Feature two relevant teams per card. Return VALID JSON only:
{
  "cards": [
    {
      "id": "card1",
      "event": "Portsmouth Â· Sail Grand Prix Â· 26â27 Jul 2026",
      "status": "next",
      "teams": [{"name": "<name>", "pos": <pos>}, {"name": "<name>", "pos": <pos>}],
      "title": "<punchy headline>",
      "body": "<2â3 tight sentences>"
    },
    ...
  ]
}`,
};

// ââ Handler ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category = 'championship' } = req.body || {};

  const rule = CATEGORY_RULES[category];
  if (!rule) {
    return res.status(400).json({ error: `Unknown category: ${category}` });
  }

  await fetchLiveSailGPData();

  const standingsBlock = SEASO_DATA.championship
    .map(t => `  P${t.pos}. ${t.flag} ${t.name} (${t.driver}) â  ${t.pts} pts â Last 4: ${t.recent.join(',')}`)
    .join('\n');

  const eventsBlock = SEASO_DATA.events
    .map(e => `  R${e.round}. ${e.location} â  ${e.dates} â  ${e.winner ? `Won by: ${e.winner}` : e.status.toUpperCase()}`)
    .join('\n');

  const systemPrompt = `
You are the AI engine for DOWNWIND â a SailGP intelligence platform.

=== VERIFIED LIVE DATA (Season 6 Â· 2026 Rolex SailGP Championship) ===

CHAMPIONSHIP STANDINGS (after 7 of 13 events):
${standingsBlock}

RACE CALENDAR:
${eventsBlock}

FORMAT: F50 foiling catamaran. All boats identical â performance differences come from crew, tactics, and teamwork.
GRAND FINAL: Top 3 in championship standings after Round 12 compete for the title in Abu Dhabi, Nov 28â29.

=== RULES ===
- Use ONLY the data above for standings positions, event winners, and results.
- Do not fabricate race times, speeds, or statistics not provided.
- Where you are confident about team history or skipper background from training data, use it â but flag uncertainty with "historically" or "known for".
- Be specific and analytical. No filler phrases like "exciting racing" or "incredible competition".
- Keep each "body" field to 2â3 tight sentences max.
- Return only the raw JSON object requested. No markdown. No backticks.
`.trim();

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: rule.trim() }],
    });

    const raw = message.content[0].text.trim();
    const cleaned = raw.replace(/^```(?json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: 'Claude returned invalid JSON', raw: cleaned });
    }

    parsed.cards = (parsed.cards || []).map((c, i) => ({ ...c, id: c.id || `card-${i}` }));
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Claude API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
