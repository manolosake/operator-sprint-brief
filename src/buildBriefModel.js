const THEME_SLUGS = ['default', 'slate', 'warm', 'high-contrast'];

function buildBriefModel(input, options = {}) {
  const generatedAt = normalizeGeneratedAt(input.generatedAt || input.generated_at);
  const title = asText(input.title) || 'Operator Sprint Brief';
  const theme = normalizeTheme(options.theme || input.theme || 'default');
  const status = asText(input.status) || 'Status not supplied.';
  const evidence = asList(input.evidence);
  const risks = asList(input.risks);
  const actions = asList(input.actions);
  const nextMilestone = asText(input.nextMilestone || input.next_milestone || input.milestone) || 'Next milestone not supplied.';

  return {
    title,
    theme,
    status,
    evidence: evidence.length ? evidence : ['No evidence supplied.'],
    risks: risks.length ? risks : ['No risks supplied.'],
    actions: actions.length ? actions : ['No actions supplied.'],
    nextMilestone,
    meta: {
      generatedAt,
      sourceType: input.sourceType || 'unknown',
      sourcePath: input.sourcePath || ''
    }
  };
}

function normalizeTheme(value) {
  const theme = asText(value).toLowerCase() || 'default';

  if (!THEME_SLUGS.includes(theme)) {
    throw new Error(`Unknown theme "${asText(value)}". Available themes: ${THEME_SLUGS.join(', ')}.`);
  }

  return theme;
}

function asText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join('\n');
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, item]) => `${labelize(key)}: ${asText(item)}`)
      .filter(Boolean)
      .join('\n');
  }
  return String(value).trim();
}

function asList(value) {
  if (value === null || value === undefined || value === '') {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean);
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, item]) => `${labelize(key)}: ${asText(item)}`)
      .filter(Boolean);
  }
  return String(value)
    .split(/\n+/)
    .map((item) => item.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean);
}

function labelize(key) {
  return String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeGeneratedAt(value) {
  const provided = asText(value);
  if (!provided) {
    return new Date().toISOString();
  }

  const date = new Date(provided);
  if (Number.isNaN(date.getTime())) {
    return provided;
  }
  return date.toISOString();
}

module.exports = {
  THEME_SLUGS,
  buildBriefModel,
  asList,
  asText,
  normalizeTheme,
  normalizeGeneratedAt
};
