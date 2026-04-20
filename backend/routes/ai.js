const express = require('express');
const router  = express.Router();

// POST /api/ai/summary
// Body: { name, title, skills, experience }
router.post('/summary', async (req, res) => {
  try {
    const { name, title, skills, experience } = req.body;
    if (!title) return res.status(400).json({ message: 'Job title is required.' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      // Fallback: return a template-based summary if no API key
      const skillList = skills || 'various technologies';
      const fallback  = generateFallbackSummary(name, title, skillList, experience);
      return res.json({ summary: fallback });
    }

    const prompt = buildPrompt(name, title, skills, experience);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional resume writer. Write concise, impactful resume summaries in 2-3 sentences. Use active voice and strong action words. Do not use first person (I/my).' },
          { role: 'user',   content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI API error');
    }

    const data    = await response.json();
    const summary = data.choices[0].message.content.trim();
    res.json({ summary });

  } catch (err) {
    console.error('AI error:', err.message);
    // Fallback on any error
    const { name, title, skills, experience } = req.body;
    res.json({ summary: generateFallbackSummary(name, title, skills, experience) });
  }
});

// POST /api/ai/improve-bullet
// Body: { bullet, title }
router.post('/improve-bullet', async (req, res) => {
  try {
    const { bullet, title } = req.body;
    if (!bullet) return res.status(400).json({ message: 'Bullet text required.' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return res.json({ improved: improveBulletFallback(bullet) });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a resume expert. Improve the given resume bullet point to be more impactful, quantified, and action-oriented. Return only the improved bullet point, nothing else.' },
          { role: 'user',   content: `Job title: ${title || 'Professional'}\nBullet: ${bullet}` },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data     = await response.json();
    const improved = data.choices[0].message.content.trim();
    res.json({ improved });

  } catch (err) {
    res.json({ improved: improveBulletFallback(req.body.bullet) });
  }
});

// ---- Fallback generators (no API key needed) ----
function buildPrompt(name, title, skills, experience) {
  let prompt = `Write a professional resume summary for a ${title}`;
  if (skills)      prompt += ` with expertise in ${skills}`;
  if (experience && experience.length > 0) {
    const latest = experience[0];
    if (latest.company) prompt += `. Previously worked at ${latest.company}`;
    if (latest.role)    prompt += ` as ${latest.role}`;
  }
  prompt += '. Keep it to 2-3 sentences, professional and impactful.';
  return prompt;
}

function generateFallbackSummary(name, title, skills, experience) {
  const t = title || 'Professional';
  const s = skills || 'industry-relevant technologies';
  const templates = [
    `Results-driven ${t} with proven expertise in ${s}. Dedicated to delivering high-quality solutions and driving measurable business outcomes. Passionate about continuous learning and contributing to team success.`,
    `Dynamic ${t} with strong proficiency in ${s}. Track record of delivering projects on time while maintaining exceptional quality standards. Committed to innovation and collaborative problem-solving.`,
    `Experienced ${t} skilled in ${s}. Adept at translating complex requirements into effective solutions. Known for strong analytical thinking and a detail-oriented approach to every challenge.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function improveBulletFallback(bullet) {
  const actionVerbs = ['Spearheaded', 'Delivered', 'Optimized', 'Developed', 'Implemented', 'Drove', 'Achieved', 'Streamlined'];
  const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  const cleaned = bullet.replace(/^[•\-\*]\s*/, '').replace(/^(worked on|helped with|assisted in|was responsible for)\s*/i, '');
  return `${verb} ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, resulting in improved team efficiency and measurable outcomes`;
}

module.exports = router;
