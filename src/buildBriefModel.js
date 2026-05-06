function buildBriefModel(input) {
  const generatedAt = new Date().toISOString();
  const title = asText(input.title) || 'Operator Sprint Brief';
  const status = asText(input.status) || 'Status not supplied.';
  const evidence = asList(input.evidence);
  const risks = asList(input.risks);
  const nextMilestone = asText(input.nextMilestone || input.next_milestone || input.milestone) || 'Next milestone not supplied.';

  return {
    title,
    status,
    evidence: evidence.length ? evidence : ['No evidence supplied.'],
    risks: risks.length ? risks : ['No risks supplied.'],
    nextMilestone,
    meta: {
      generatedAt,
      sourceType: input.sourceType || 'unknown',
      sourcePath: input.sourcePath || ''
    }
  };
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

module.exports = {
  buildBriefModel,
  asList,
  asText
};
