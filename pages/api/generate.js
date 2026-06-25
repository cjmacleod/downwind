import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { milestone } = req.body;
  if (!milestone) {
    return res.status(400).json({ error: 'Missing milestone' });
  }

  const systemPrompt = `You are a creative content strategist for End Product, a sports marketing agency. You generate sharp, punchy content ideas for SailGP — the world's fastest sail racing series.

SailGP is a global circuit of identical F50 catamarans foiling at up to 60 knots. It's elite, technical, and visually spectacular.

For each milestone, generate exactly 3 distinct content ideas. Each idea has:
- hook: A short, punchy content angle (headline or post hook, max 15 words)
- angle: 1–2 sentences expanding on the angle and why it works

Focus on: championship narrative, team rivalries, speed and data, sailor personality, behind-the-scenes, fan engagement.

Return a JSON object: { "ideas": [ { "hook": "...", "angle": "..." }, ... ] }`;

  const userPrompt = `Generate 3 content ideas for this SailGP milestone:

Title: ${milestone.title}
Summary: ${milestone.body}
Category: ${milestone.tag}
${milestone.team1 ? `Teams: ${milestone.team1.flag} ${milestone.team1.name} vs ${milestone.team2?.flag} ${milestone.team2?.name}` : ''}

Return valid JSON only.`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].text.trim();
    const json = JSON.parse(text.replace(/^```json?\n?/, '').replace(/\n?```$/, ''));

    if (!Array.isArray(json.ideas)) throw new Error('Unexpected shape');

    return res.status(200).json({ ideas: json.ideas.slice(0, 3) });
  } catch (err) {
    console.error('generate error:', err);
    return res.status(500).json({ error: 'Generation failed' });
  }
}
