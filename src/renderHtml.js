function renderHtml(model) {
  const title = escapeHtml(model.title);
  const evidenceItems = model.evidence.map(renderListItem).join('');
  const riskItems = model.risks.map(renderListItem).join('');
  const actionItems = model.actions.map(renderListItem).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #172026;
      --muted: #59646d;
      --line: #d7dde1;
      --paper: #fbfaf7;
      --panel: #ffffff;
      --accent: #0f766e;
      --accent-strong: #0b514c;
      --warning: #9a3412;
      --shadow: 0 18px 50px rgba(23, 32, 38, 0.12);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background: var(--paper);
      line-height: 1.5;
    }
    .page {
      max-width: 1120px;
      margin: 0 auto;
      padding: 40px 24px 56px;
    }
    header {
      border-bottom: 1px solid var(--line);
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .eyebrow {
      margin: 0 0 10px;
      color: var(--accent-strong);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      max-width: 840px;
      font-size: clamp(2rem, 5vw, 4.2rem);
      line-height: 0.98;
      letter-spacing: 0;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
      color: var(--muted);
      font-size: 0.92rem;
    }
    .pill {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.7);
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
      gap: 24px;
      align-items: start;
    }
    section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px;
      box-shadow: var(--shadow);
    }
    .stack {
      display: grid;
      gap: 18px;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0;
      color: var(--accent-strong);
    }
    p {
      margin: 0;
      font-size: 1.04rem;
    }
    ul {
      margin: 0;
      padding-left: 1.2rem;
    }
    li + li {
      margin-top: 10px;
    }
    .status {
      border-left: 6px solid var(--accent);
    }
    .risks {
      border-left: 6px solid var(--warning);
    }
    .actions {
      border-left: 6px solid var(--accent-strong);
    }
    .milestone {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 22px;
    }
    .milestone strong {
      display: block;
      font-size: 1.45rem;
      line-height: 1.2;
    }
    .footer-note {
      color: var(--muted);
      font-size: 0.86rem;
    }
    @media (max-width: 780px) {
      .page { padding: 28px 16px 40px; }
      .layout { grid-template-columns: 1fr; }
      section { padding: 18px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header>
      <p class="eyebrow">Operator Sprint Brief</p>
      <h1>${title}</h1>
      <div class="meta">
        <span class="pill">Generated ${escapeHtml(formatDate(model.meta.generatedAt))}</span>
        <span class="pill">Source ${escapeHtml(model.meta.sourceType)}</span>
      </div>
    </header>
    <div class="layout">
      <div class="stack">
        <section class="status" aria-labelledby="status-heading">
          <h2 id="status-heading">Status</h2>
          <p>${escapeHtml(model.status).replace(/\n/g, '<br>')}</p>
        </section>
        <section aria-labelledby="evidence-heading">
          <h2 id="evidence-heading">Evidence</h2>
          <ul>${evidenceItems}</ul>
        </section>
        <section class="risks" aria-labelledby="risks-heading">
          <h2 id="risks-heading">Risks</h2>
          <ul>${riskItems}</ul>
        </section>
        <section class="actions" aria-labelledby="actions-heading">
          <h2 id="actions-heading">Actions</h2>
          <ul>${actionItems}</ul>
        </section>
      </div>
      <section class="milestone" aria-labelledby="milestone-heading">
        <div>
          <h2 id="milestone-heading">Next Milestone</h2>
          <strong>${escapeHtml(model.nextMilestone).replace(/\n/g, '<br>')}</strong>
        </div>
        <p class="footer-note">Single-file local artifact. No network service required.</p>
      </section>
    </div>
  </main>
</body>
</html>`;
}

function renderListItem(item) {
  return `<li>${escapeHtml(item)}</li>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

module.exports = {
  renderHtml,
  escapeHtml
};
