// ââ State ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
let activeCategory = 'championship';

// ââ Category buttons âââââââââââââââââââââââââââââââââââââââââââââââââââââââ
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
  });
});

// ââ Generate âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
document.getElementById('generateBtn').addEventListener('click', generate);

async function generate() {
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  btn.textContent = 'Generatingâ¦';

  renderSkeletons();

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: activeCategory }),
    });

    if (!res.ok) throw new Error(`Server error ${res.status}`);

    const { cards } = await res.json();
    renderCards(cards);
  } catch (err) {
    renderError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate';
  }
}

// ââ Render helpers âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function renderSkeletons() {
  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = [1, 2, 3].map(() => `
    <div class="race-card">
      <div class="card-inner">
        <div class="race-meta">
          <div class="skeleton sk-line" style="width:55%"></div>
          <div class="skeleton" style="width:44px;height:18px;border-radius:4px"></div>
        </div>
        <div class="teams" style="padding-top:10px">
          <div class="skeleton sk-line" style="width:65%"></div>
          <div class="skeleton sk-line" style="width:45%"></div>
        </div>
        <div class="card-divider"></div>
        <div class="card-body">
          <div class="skeleton sk-title"></div>
          <div class="skeleton sk-line" style="width:100%"></div>
          <div class="skeleton sk-line" style="width:92%"></div>
          <div class="skeleton sk-line" style="width:80%"></div>
          <div class="skeleton sk-line" style="width:88%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function badgeHtml(status) {
  if (!status) return '';
  const map = {
    live:   ['badge-live',   'LIVE'],
    recent: ['badge-recent', 'RECENT'],
    next:   ['badge-next',   'NEXT'],
  };
  const [cls, label] = map[status] || ['badge-recent', status.toUpperCase()];
  return `<span class="status-badge ${cls}">${label}</span>`;
}

function renderCards(cards) {
  const grid = document.getElementById('cardsGrid');

  if (!cards || !cards.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h2>No data returned</h2>
        <p>Try generating again or check your API connection.</p>
      </div>`;
    return;
  }

  grid.innerHTML = cards.map(card => {
    const teamA = card.teams?.[0] || {};
    const teamB = card.teams?.[1] || {};

    return `
      <div class="race-card">
        <div class="card-inner">
          <div class="race-meta">
            <div class="race-event">${escHtml(card.event || '')}</div>
            ${badgeHtml(card.status)}
          </div>

          <div class="teams">
            <div class="team-row">
              <span class="team-name">${escHtml(teamA.name || '')}</span>
              ${teamA.pos ? `<span class="team-pos">P${teamA.pos}</span>` : ''}
            </div>
            ${teamB.name ? `
            <span class="vs-divider">vs</span>
            <div class="team-row">
              <span class="team-name">${escHtml(teamB.name || '')}</span>
              ${teamB.pos ? `<span class="team-pos">P${teamB.pos}</span>` : ''}
            </div>` : ''}
          </div>

          <div class="card-divider"></div>

          <div class="card-body">
            ${card.title ? `<div class="card-title">${escHtml(card.title)}</div>` : ''}
            <div class="card-text" id="text-${card.id}">${escHtml(card.body || '')}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderError(msg) {
  document.getElementById('cardsGrid').innerHTML = `
    <div class="error-state">
      <strong>Something went wrong</strong>
      <p>${escHtml(msg)}</p>
    </div>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
