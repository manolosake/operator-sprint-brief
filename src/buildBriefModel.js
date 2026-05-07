const THEME_SLUGS = ['default', 'slate', 'warm', 'high-contrast'];

function buildBriefModel(input, options = {}) {
  const generatedAt = normalizeGeneratedAt(input.generatedAt || input.generated_at);
  const title = asText(input.title) || 'Operator Sprint Brief';
  const theme = normalizeTheme(options.theme || input.theme || 'default');
  const status = asText(input.status) || 'Status not supplied.';
  const evidence = asList(input.evidence);
  const risks = asList(input.risks);
  const actions = asList(input.actions);
  const readiness = buildReadiness(input, evidence, risks, actions);
  const nextMilestone = asText(input.nextMilestone || input.next_milestone || input.milestone) || 'Next milestone not supplied.';

  return {
    title,
    theme,
    status,
    evidence: evidence.length ? evidence : ['No evidence supplied.'],
    risks: risks.length ? risks : ['No risks supplied.'],
    actions: actions.length ? actions : ['No actions supplied.'],
    readiness,
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

function buildReadiness(input, evidence, risks, actions) {
  const readinessInput = input.readinessPanel || input.readiness_panel || input.readiness;
  const structured = readinessInput && typeof readinessInput === 'object' && !Array.isArray(readinessInput)
    ? readinessInput
    : {};
  const suppliedState = Object.keys(structured).length
    ? asText(structured.state || structured.status || structured.readiness)
    : asText(readinessInput);
  const state = normalizeReadinessState(suppliedState) || deriveReadinessState(evidence, risks, actions);

  return {
    state,
    decision: asText(input.decision || structured.decision),
    owner: asText(input.owner || structured.owner),
    dueBy: asText(input.dueBy || input.due_by || input.due || structured.dueBy || structured.due_by || structured.due),
    source: suppliedState ? 'provided' : 'derived'
  };
}

function deriveReadinessState(evidence, risks, actions) {
  const hasEvidence = hasMeaningfulItems(evidence);
  const hasRisks = hasMeaningfulItems(risks);
  const hasActions = hasMeaningfulItems(actions);

  if (hasEvidence && !hasRisks) {
    return 'Ready';
  }
  if (hasRisks && hasActions) {
    return 'Needs Decision';
  }
  if (hasRisks) {
    return 'Blocked';
  }
  return 'Needs Review';
}

function hasMeaningfulItems(items) {
  return items.some(isMeaningfulItem);
}

function isMeaningfulItem(item) {
  const normalized = asText(item)
    .toLowerCase()
    .replace(/[.!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return false;
  }

  if (['none', 'none known', 'n/a', 'na', 'not applicable'].includes(normalized)) {
    return false;
  }

  return !/^no (known |meaningful )?(evidence|risks?|actions?)( supplied|required| known)?$/.test(normalized);
}

function normalizeReadinessState(value) {
  const provided = asText(value);
  const normalized = provided
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const aliases = {
    ready: 'Ready',
    'needs decision': 'Needs Decision',
    'need decision': 'Needs Decision',
    decision: 'Needs Decision',
    blocked: 'Blocked',
    'needs review': 'Needs Review',
    review: 'Needs Review'
  };

  return aliases[normalized] || provided;
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
  buildReadiness,
  deriveReadinessState,
  asList,
  asText,
  normalizeTheme,
  normalizeGeneratedAt
};
