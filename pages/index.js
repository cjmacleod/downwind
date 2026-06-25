import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ââ Spring configs ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const SPRING_SOFT   = { type: 'spring', stiffness: 260, damping: 28 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 32 };

// ââ SailGP Season 6 Data âââââââââââââââââââââââââââââââââââââââââââââââââââ
const SEASON = {
  label: 'Season 6 Â· 2026',
  standings: [
    { pos:1,  name:'Emirates GBR',            driver:'Dylan Fletcher',       pts:10, flag:'ð¬ð§', recent:[1,1,4,3] },
    { pos:2,  name:'Bonds Flying Roos',        driver:'Tom Slingsby',         pts:9,  flag:'ð¦ðº', recent:[2,3,3,2] },
    { pos:3,  name:'DS Team France',           driver:'Quentin Delapierre',   pts:8,  flag:'ð«ð·', recent:[3,2,2,1] },
    { pos:4,  name:'Artemis SailGP',           driver:'Nathan Outteridge',    pts:7,  flag:'ð¸ðª', recent:[4,4,11,4] },
    { pos:5,  name:'United States SailGP',     driver:'Taylor Canfield',      pts:6,  flag:'ðºð¸', recent:[5,8,9,5] },
    { pos:6,  name:'NorthStar SailGP',         driver:'Giles Scott',          pts:5,  flag:'ð§ð²', recent:[6,6,1,6] },
  ],
};

const RACE_GROUPS = [
  {
    flag: 'ð¨ð¦',
    name: 'Canada Sail Grand Prix',
    location: 'Halifax, Canada',
    dates: '21â22 Jun 2026',
    status: 'recent',
    winner: 'NorthStar SailGP',
    milestones: [
      {
        id: 'hal-1',
        title: "NorthStar's Halifax surge throws title race wide open",
        body: "Giles Scott's NorthStar team claimed a stunning victory in Halifax â their first win of Season 6 â cutting the gap to the championship leaders. Emirates GBR and Bonds Flying Roos now face a two-pronged challenge with six rounds remaining.",
        tag: 'ð TITLE RACE',
        team1: { name:'NorthStar SailGP', flag:'ð§ð²', pos:6 },
        team2: { name:'Emirates GBR', flag:'ð¬ð§', pos:1 },
      },
      {
        id: 'hal-2',
        title: "France edges into Grand Final contention with P3 podium",
        body: "Quentin Delapierre's DS Team France secured third in Halifax, making it three consecutive podiums. At P3 in the standings with a point separating them from the Roos, France now look like the likeliest team to gate-crash the GBRâRoos title fight.",
        tag: 'âº MATCH-UP',
        team1: { name:'DS Team France', flag:'ð«ð·', pos:3 },
        team2: { name:'Bonds Flying Roos', flag:'ð¦ðº', pos:2 },
      },
    ],
  },
  {
    flag: 'ð¬ð§',
    name: 'Emirates Great Britain Sail Grand Prix',
    location: 'Portsmouth, Great Britain',
    dates: '26â27 Jul 2026',
    status: 'next',
    winner: null,
    milestones: [
      {
        id: 'pts-1',
        title: "GBR defend the Solent with everything to prove",
        body: "Emirates GBR arrive at their home event as championship leaders, and a win in front of a partisan Portsmouth crowd would extend their lead to what could be a decisive advantage. Dylan Fletcher has never lost on home water in SailGP.",
        tag: 'â HOME WATERS',
        team1: { name:'Emirates GBR', flag:'ð¬ð§', pos:1 },
        team2: { name:'Bonds Flying Roos', flag:'ð¦ðº', pos:2 },
      },
      {
        id: 'pts-2',
        title: "Solent's notorious tides will test every crew's nerve",
        body: "The Solent's complex tidal streams, shifting Southerly winds, and dense spectator fleet make Portsmouth one of the most tactically demanding venues on the circuit. Teams that master the tide gate on the downwind leg have historically dominated here.",
        tag: 'â TACTICS',
        team1: { name:'Artemis SailGP', flag:'ð¸ðª', pos:4 },
        team2: { name:'DS Team France', flag:'ð«ð·', pos:3 },
      },
      {
        id: 'pts-3',
        title: "Slingsby eyes another comeback win to reclaim P1",
        body: "Tom Slingsby has won three of the last four SailGP events at UK venues and has publicly targeted Portsmouth as a 'must win'. A victory here would move the Roos within one point of GBR with five rounds left â and the momentum would swing decisively.",
        tag: 'â© COMEBACK',
        team1: { name:'Bonds Flying Roos', flag:'ð¦ðº', pos:2 },
        team2: { name:'NorthStar SailGP', flag:'ð§ð²', pos:6 },
      },
    ],
  },
  {
    flag: 'ð©ðª',
    name: 'Germany Sail Grand Prix',
    location: 'Sassnitz, Germany',
    dates: '23â24 Aug 2026',
    status: 'upcoming',
    winner: null,
    milestones: [
      {
        id: 'sas-1',
        title: "Baltic conditions could reshuffle the championship order",
        body: "Sassnitz's Baltic Sea venue is known for its flat water and consistent north-easterly winds â conditions that historically reward teams with precise foiling exits over raw boatspeed. Germany by Deutsche Bank have never won at home, but P6 on the Sassnitz podium represents their best finish.",
        tag: 'â¡ SPEED DUEL',
        team1: { name:'Germany by Deutsche Bank', flag:'ð©ðª', pos:9 },
        team2: { name:'Artemis SailGP', flag:'ð¸ðª', pos:4 },
      },
      {
        id: 'sas-2',
        title: "Mid-season turning point: four rounds to shape the final three",
        body: "By the time the fleet arrives in Sassnitz, the shape of the Abu Dhabi Grand Final grid will be coming into focus. Only the top three after Round 12 qualify â and Round 9 represents the last chance for fringe contenders to move into the picture before the European swing concludes.",
        tag: 'â GRAND FINAL PATH',
        team1: { name:'United States SailGP', flag:'ðºð¸', pos:5 },
        team2: { name:'NorthStar SailGP', flag:'ð§ð²', pos:6 },
      },
    ],
  },
  {
    flag: 'ðªð¸',
    name: 'Spain Sail Grand Prix',
    location: 'Valencia, Spain',
    dates: '5â6 Sep 2026',
    status: 'upcoming',
    winner: null,
    milestones: [
      {
        id: 'val-1',
        title: "Valencia's Med swell brings the dark horses out",
        body: "The Valencia venue in the Mediterranean produces the heaviest sea-states on the calendar â big chop that disrupts foiling rhythm and gives physically stronger crews a meaningful edge. In the last two Season 6 appearances here, neither championship leader has won.",
        tag: 'â DARK HORSE',
        team1: { name:'Rockwool Racing', flag:'ð©ð°', pos:8 },
        team2: { name:'Red Bull Italy SailGP', flag:'ð®ð¹', pos:7 },
      },
    ],
  },
  {
    flag: 'ð¨ð­',
    name: 'Rolex Switzerland Sail Grand Prix',
    location: 'Geneva, Switzerland',
    dates: '19â20 Sep 2026',
    status: 'upcoming',
    winner: null,
    milestones: [
      {
        id: 'gen-1',
        title: "Schneiter's home chance on Lake Geneva",
        body: "SÃ©bastien Schneiter and Switzerland SailGP have yet to score this season after a run of mechanical DNFs, but Lake Geneva â their home patch â represents the clearest opportunity for a breakthrough result. The tight, enclosed course rewards local knowledge above all.",
        tag: 'â FORM GUIDE',
        team1: { name:'Switzerland SailGP', flag:'ð¨ð­', pos:11 },
        team2: { name:'DS Team France', flag:'ð«ð·', pos:3 },
      },
    ],
  },
  {
    flag: 'ð¦ðª',
    name: 'Mubadala Abu Dhabi Grand Final',
    location: 'Abu Dhabi, UAE',
    dates: '28â29 Nov 2026',
    status: 'upcoming',
    winner: null,
    milestones: [
      {
        id: 'auh-1',
        title: "Abu Dhabi: one race decides the Season 6 champion",
        body: "The Grand Final format puts the top three qualifiers into a winner-takes-all race on the Corniche. Season 6 already has multiple realistic title contenders â GBR, the Roos, and France could all reach the final. Whoever arrives with momentum after Dubai will start as favourite.",
        tag: 'ð TITLE RACE',
        team1: { name:'Emirates GBR', flag:'ð¬ð§', pos:1 },
        team2: { name:'Bonds Flying Roos', flag:'ð¦ðº', pos:2 },
      },
    ],
  },
];

// Today section â upcoming event preview
const TODAY_MATCHUP = {
  event: 'Emirates Great Britain Sail Grand Prix',
  location: 'Portsmouth',
  dates: '26â27 Jul 2026',
  status: 'next',
  teams: [
    { name:'Emirates GBR', flag:'ð¬ð§', pos:1, pts:10 },
    { name:'Bonds Flying Roos', flag:'ð¦ðº', pos:2, pts:9 },
    { name:'DS Team France', flag:'ð«ð·', pos:3, pts:8 },
  ],
};

// ââ Glow canvas ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function GlowCanvas({ accent = '#E13B25' }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 40 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      a: 0.04 + Math.random() * 0.08,
    }));
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const g = ctx.createRadialGradient(p.x*w, p.y*h, 0, p.x*w, p.y*h, p.r * Math.min(w,h) / 600);
        g.addColorStop(0, accent + '22');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.globalAlpha = p.a;
        ctx.fillRect(0, 0, w, h);
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [accent]);
  return <canvas ref={ref} className="glow-canvas" />;
}

// ââ Live clock âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', timeZoneName:'short' })
        .replace(':00 ', ' ').replace('GMT+1','BST').replace('GMT','UTC'));
    }
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  return <span className="live-clock">{time}</span>;
}

// ââ Thinking dots ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function ThinkingDots() {
  return (
    <span className="thinking-dots">
      {[0,1,2].map(i => (
        <span key={i} className="thinking-dot" style={{ animationDelay: `${i*0.18}s` }} />
      ))}
    </span>
  );
}

// ââ Milestone card âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function MilestoneCard({ milestone }) {
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [ideas, setIdeas]   = useState(null);

  async function generate() {
    if (state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setIdeas(data.ideas);
      setState('done');
    } catch (err) {
      setState('error');
    }
  }

  return (
    <motion.div
      className="card"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_SOFT}
    >
      <div className="card-inner">
        <div className="card-top">
          <div className="card-content">
            <div className="card-teams">
              {milestone.team1 && (
                <span className="card-team">
                  <span className="team-flag">{milestone.team1.flag}</span>
                  {milestone.team1.name}
                </span>
              )}
              {milestone.team2 && (
                <>
                  <span className="card-vs">vs</span>
                  <span className="card-team">
                    <span className="team-flag">{milestone.team2.flag}</span>
                    {milestone.team2.name}
                  </span>
                </>
              )}
            </div>
            <div className="card-title">{milestone.title}</div>
            <div className="card-body">{milestone.body}</div>
            <button
              className={`generate-btn${state === 'loading' ? ' loading' : ''}`}
              onClick={generate}
              disabled={state === 'loading'}
            >
              <span>{state === 'loading' ? '' : 'â¦'}</span>
              {state === 'loading' ? <ThinkingDots /> : 'Generate ideas'}
            </button>
          </div>
          <div className="card-meta">
            <div className="card-tag">{milestone.tag.toLowerCase()}</div>
          </div>
        </div>

        <AnimatePresence>
          {state === 'done' && ideas && (
            <motion.div
              className="ideas-panel"
              key="ideas"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={SPRING_SOFT}
            >
              <div className="ideas-divider" />
              <div className="ideas-list">
                {ideas.map((idea, i) => (
                  <motion.div
                    key={i}
                    className="idea-item"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING_SNAPPY, delay: i * 0.06 }}
                  >
                    <span className="idea-num">{i + 1}</span>
                    <div className="idea-text">
                      <div className="idea-hook">{idea.hook}</div>
                      <div className="idea-angle">{idea.angle}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {state === 'error' && (
            <motion.div
              className="error-panel"
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="error-title">Could not generate ideas</div>
              <div className="error-body">Check your API connection and try again.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ââ Race group âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function RaceGroup({ group }) {
  const count = group.milestones.length;
  return (
    <div className="tournament-group">
      <div className="tournament-header">
        <div className="tournament-header-left">
          <span className="tournament-flag">{group.flag}</span>
          <h3 className="tournament-name">{group.name}</h3>
        </div>
        <div className="tournament-header-right">
          <span className="tournament-dates">{group.dates}</span>
          <span className={`tournament-badge badge-${group.status}`}>
            {group.status === 'recent' ? `Won by ${group.winner}` : group.status}
          </span>
          <span className="tournament-count">{count} {count === 1 ? 'milestone' : 'milestones'}</span>
        </div>
      </div>
      <div className="two-col">
        {group.milestones.map(m => <MilestoneCard key={m.id} milestone={m} />)}
      </div>
    </div>
  );
}

// ââ Today section ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function TodaySection() {
  const totalMilestones = RACE_GROUPS.reduce((s, g) => s + g.milestones.length, 0);
  return (
    <section className="today-section">
      <div className="today-header">
        <span className="today-label">Race to watch next</span>
        <span className="today-count">{totalMilestones} milestones</span>
      </div>
      <div className="today-grid">
        {TODAY_MATCHUP.teams.map((team, i) => (
          <div key={i} className="match-card">
            <div className="match-meta">
              <span className="match-tournament">{TODAY_MATCHUP.event}</span>
              <span className={`match-status-badge badge-${TODAY_MATCHUP.status}`}>
                {TODAY_MATCHUP.status}
              </span>
            </div>
            <div className="match-players">
              <div className="match-player">
                <span className="player-flag">{team.flag}</span>
                <span className="player-name">{team.name}</span>
              </div>
              <div className="match-pts">P{team.pos} Â· {team.pts} pts</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ââ Main page ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Head>
        <title>Downwind â by End Product</title>
        <meta name="description" content="SailGP race intelligence powered by AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      {/* Background glow */}
      <GlowCanvas />

      {/* Splash */}
      <AnimatePresence>
        {!splashDone && (
          <motion.div
            className="splash"
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <GlowCanvas />
            <div className="splash-inner">
              <motion.div
                className="splash-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...SPRING_SOFT }}
              >
                Downwind
              </motion.div>
              <motion.div
                className="splash-byline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                by End Product
              </motion.div>
              <motion.div
                className="splash-bar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shell */}
      <div className="shell">
        {/* Masthead */}
        <header className="masthead">
          <div className="masthead-left">
            <div className="masthead-title">Downwind</div>
            <div className="masthead-byline">by End Product</div>
          </div>
          <div className="masthead-right">
            <LiveClock />
            <div className="status-pill">
              <span className="status-dot" />
              {SEASON.label}
            </div>
          </div>
        </header>

        {/* Today */}
        <TodaySection />

        {/* Race groups */}
        {RACE_GROUPS.map(g => <RaceGroup key={g.name} group={g} />)}

        {/* Footer */}
        <footer className="footer">
          <div className="footer-brand">Downwind Â· SailGP Intelligence</div>
          <div className="footer-note">Powered by Claude Â· End Product Group Ltd Â· Season 6 Â· 2026</div>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red:    #E13B25;
          --cream:  #F2F0EA;
          --danger: #FF453A;
          --radius: 14px;
          --radius-lg: 18px;
          --serif: 'Playfair Display', Georgia, serif;
          --ui: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }

        body {
          background: rgb(10,10,8);
          color: var(--cream);
          font-family: var(--ui);
          font-size: 15px;
          line-height: 1.5;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ââ Glow canvas ââ */
        .glow-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* ââ Splash ââ */
        .splash {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(10,10,8);
          overflow: hidden;
        }
        .splash-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .splash-title {
          font-family: var(--serif);
          font-size: clamp(56px, 10vw, 100px);
          color: var(--cream);
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .splash-byline {
          font-family: var(--ui);
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cream);
          opacity: 0.5;
        }
        .splash-bar {
          width: 40px;
          height: 3px;
          background: var(--red);
          border-radius: 2px;
          transform-origin: left center;
          margin-top: 8px;
        }

        /* ââ Shell ââ */
        .shell {
          position: relative;
          z-index: 1;
          max-width: 980px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        /* ââ Masthead ââ */
        .masthead {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 40px 0 32px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 36px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .masthead-title {
          font-family: var(--serif);
          font-size: 36px;
          font-weight: 400;
          letter-spacing: 0.5px;
          color: var(--cream);
          line-height: 1;
        }
        .masthead-byline {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(242,240,234,0.35);
          margin-top: 6px;
        }
        .masthead-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .live-clock {
          font-size: 13px;
          font-weight: 500;
          color: rgba(242,240,234,0.5);
          font-variant-numeric: tabular-nums;
        }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          padding: 5px 12px 5px 10px;
          font-size: 12px;
          color: rgba(242,240,234,0.55);
          letter-spacing: 0.02em;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        /* ââ Today section ââ */
        .today-section {
          margin-bottom: 48px;
        }
        .today-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 14px;
        }
        .today-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(242,240,234,0.35);
        }
        .today-count {
          font-size: 11px;
          color: rgba(242,240,234,0.2);
          letter-spacing: 0.06em;
        }
        .today-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .match-card {
          flex: 1;
          min-width: 200px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--radius);
          padding: 14px 16px;
        }
        .match-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 10px;
        }
        .match-tournament {
          font-size: 11px;
          color: rgba(242,240,234,0.35);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .match-status-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .badge-next {
          background: rgba(225,59,37,0.15);
          color: var(--red);
          border: 1px solid rgba(225,59,37,0.25);
        }
        .badge-live {
          background: rgba(255,69,58,0.15);
          color: #FF453A;
          border: 1px solid rgba(255,69,58,0.25);
        }
        .badge-recent {
          background: rgba(255,255,255,0.06);
          color: rgba(242,240,234,0.4);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .badge-upcoming {
          background: transparent;
          color: rgba(242,240,234,0.25);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .match-players {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .match-player {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .player-flag { font-size: 15px; }
        .player-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--cream);
        }
        .match-pts {
          font-size: 11px;
          color: rgba(242,240,234,0.3);
          margin-left: auto;
        }

        /* ââ Tournament group ââ */
        .tournament-group {
          margin-bottom: 48px;
        }
        .tournament-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .tournament-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tournament-flag { font-size: 17px; }
        .tournament-name {
          font-family: var(--serif);
          font-size: 18px;
          font-weight: 400;
          color: var(--cream);
          letter-spacing: 0.01em;
        }
        .tournament-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .tournament-dates {
          font-size: 12px;
          color: rgba(242,240,234,0.3);
          letter-spacing: 0.04em;
        }
        .tournament-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .tournament-count {
          font-size: 11px;
          color: rgba(242,240,234,0.2);
          letter-spacing: 0.06em;
        }

        /* ââ Two column grid ââ */
        .two-col {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 12px;
        }

        /* ââ Milestone card ââ */
        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .card:hover { border-color: rgba(255,255,255,0.12); }
        .card-inner { padding: 20px; }
        .card-top { display: flex; flex-direction: column; gap: 14px; }
        .card-content { flex: 1; }

        .card-teams {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .card-team {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(242,240,234,0.55);
          letter-spacing: 0.02em;
        }
        .team-flag { font-size: 14px; }
        .card-vs {
          font-size: 10px;
          color: rgba(242,240,234,0.2);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .card-title {
          font-family: var(--serif);
          font-size: 16px;
          font-weight: 400;
          line-height: 1.35;
          color: var(--cream);
          margin-bottom: 10px;
          letter-spacing: 0.01em;
        }
        .card-body {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(242,240,234,0.55);
          margin-bottom: 16px;
        }

        .generate-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(242,240,234,0.6);
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
          font-family: var(--ui);
          letter-spacing: 0.01em;
        }
        .generate-btn:hover:not(:disabled) {
          background: rgba(225,59,37,0.1);
          border-color: rgba(225,59,37,0.3);
          color: var(--cream);
        }
        .generate-btn:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .generate-btn.loading {
          border-color: rgba(225,59,37,0.2);
          background: rgba(225,59,37,0.05);
        }
        .generate-btn span:first-child {
          color: var(--red);
          font-size: 11px;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          margin-top: 4px;
        }
        .card-tag {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(242,240,234,0.25);
        }

        /* ââ Ideas panel ââ */
        .ideas-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 16px 0;
        }
        .ideas-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .idea-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .idea-num {
          font-size: 11px;
          font-weight: 600;
          color: var(--red);
          min-width: 16px;
          margin-top: 2px;
          opacity: 0.8;
        }
        .idea-hook {
          font-size: 13px;
          font-weight: 500;
          color: var(--cream);
          margin-bottom: 3px;
          line-height: 1.4;
        }
        .idea-angle {
          font-size: 12px;
          color: rgba(242,240,234,0.45);
          line-height: 1.5;
        }

        /* ââ Error panel ââ */
        .error-panel {
          margin-top: 14px;
          padding: 12px 14px;
          background: rgba(255,69,58,0.06);
          border: 1px solid rgba(255,69,58,0.15);
          border-radius: 10px;
        }
        .error-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--danger);
          margin-bottom: 3px;
        }
        .error-body {
          font-size: 12px;
          color: rgba(255,69,58,0.6);
        }

        /* ââ Thinking dots ââ */
        .thinking-dots {
          display: inline-flex;
          gap: 3px;
          align-items: center;
        }
        .thinking-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--red);
          animation: thinking 1.2s ease-in-out infinite;
        }

        /* ââ Footer ââ */
        .footer {
          margin-top: 80px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-brand {
          font-size: 12px;
          font-weight: 500;
          color: rgba(242,240,234,0.25);
          margin-bottom: 4px;
          letter-spacing: 0.2px;
        }
        .footer-note {
          font-size: 11px;
          color: rgba(242,240,234,0.15);
        }

        /* ââ Animations ââ */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes thinking {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.25; }
          40%            { transform: scale(1.1); opacity: 1; }
        }

        /* ââ Responsive ââ */
        @media (max-width: 600px) {
          .shell { padding: 0 16px 60px; }
          .masthead { padding: 28px 0 24px; }
          .masthead-title { font-size: 28px; }
          .two-col { grid-template-columns: 1fr; }
          .today-grid { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
