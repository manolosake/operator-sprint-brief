const fs = require('node:fs');
const path = require('node:path');

const MARKDOWN_SECTIONS = {
  status: 'status',
  evidence: 'evidence',
  risks: 'risks',
  'risk': 'risks',
  'generated at': 'generatedAt',
  generatedat: 'generatedAt',
  'next milestone': 'nextMilestone',
  nextmilestone: 'nextMilestone',
  milestone: 'nextMilestone'
};

function parseInput(inputPath) {
  if (!inputPath) {
    throw new Error('Input path is required.');
  }

  const absolutePath = path.resolve(inputPath);
  const raw = fs.readFileSync(absolutePath, 'utf8');
  const ext = path.extname(absolutePath).toLowerCase();

  if (ext === '.json') {
    return parseJson(raw, absolutePath);
  }

  if (ext === '.md' || ext === '.markdown' || ext === '.txt') {
    return parseMarkdown(raw, absolutePath);
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    return parseJson(raw, absolutePath);
  }

  return parseMarkdown(raw, absolutePath);
}

function parseJson(raw, sourcePath = 'input.json') {
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('JSON input must be an object.');
    }
    return { ...value, sourceType: 'json', sourcePath };
  } catch (error) {
    if (error.message === 'JSON input must be an object.') {
      throw error;
    }
    throw new Error(`Could not parse JSON input: ${error.message}`);
  }
}

function parseMarkdown(raw, sourcePath = 'input.md') {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const result = {
    title: path.basename(sourcePath, path.extname(sourcePath)),
    status: '',
    evidence: [],
    risks: [],
    generatedAt: '',
    nextMilestone: '',
    sourceType: 'markdown',
    sourcePath
  };

  let currentKey = null;

  for (const line of lines) {
    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const headingText = heading[2].trim();
      const normalized = normalizeHeading(headingText);
      if (!result.title && !MARKDOWN_SECTIONS[normalized]) {
        result.title = headingText;
      }
      if (heading[1] === '#' && !MARKDOWN_SECTIONS[normalized]) {
        result.title = headingText;
        currentKey = null;
        continue;
      }
      currentKey = MARKDOWN_SECTIONS[normalized] || null;
      continue;
    }

    if (!currentKey) {
      continue;
    }

    const cleaned = line.replace(/^\s*[-*]\s+/, '').trim();
    if (!cleaned) {
      continue;
    }

    if (Array.isArray(result[currentKey])) {
      result[currentKey].push(cleaned);
    } else {
      result[currentKey] = result[currentKey] ? `${result[currentKey]}\n${cleaned}` : cleaned;
    }
  }

  return result;
}

function normalizeHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[:.!?]+$/g, '')
    .replace(/\s+/g, ' ');
}

module.exports = {
  parseInput,
  parseJson,
  parseMarkdown
};
