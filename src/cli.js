#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { parseInput, parseJson, parseMarkdown } = require('./parseInput');
const { buildBriefModel } = require('./buildBriefModel');
const { renderHtml } = require('./renderHtml');

function main(argv = process.argv.slice(2), io = {}) {
  const input = io.input || process.stdin;
  const output = io.output || process.stdout;
  const error = io.error || process.stderr;
  const [inputPath, outputPath] = argv;

  if (!inputPath || !outputPath) {
    error.write('Usage: node src/cli.js <input.json|input.md|-> <output.html|->\n');
    return 1;
  }

  try {
    const parsed = inputPath === '-' ? parseInlineInput(readAll(input)) : parseInput(inputPath);
    const model = buildBriefModel(parsed);
    const html = renderHtml(model);

    if (outputPath === '-') {
      output.write(html);
      return 0;
    }

    const resolvedOutput = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
    fs.writeFileSync(resolvedOutput, html, 'utf8');
    output.write(`Wrote ${resolvedOutput}\n`);
    return 0;
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught);
    error.write(`${message}\n`);
    return 1;
  }
}

function parseInlineInput(raw) {
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new Error('Input was empty.');
  }

  if (trimmed.startsWith('{')) {
    return parseJsonInline(raw);
  }

  return parseMarkdownInline(raw);
}

function parseJsonInline(raw) {
  return parseJson(raw, 'stdin.json');
}

function parseMarkdownInline(raw) {
  return parseMarkdown(raw, 'stdin.md');
}

function readAll(stream) {
  if (typeof stream.fd === 'number') {
    return fs.readFileSync(stream.fd, 'utf8');
  }

  if (typeof stream.read === 'function') {
    const chunks = [];
    let chunk = stream.read();
    while (chunk !== null) {
      chunks.push(typeof chunk === 'string' ? chunk : String(chunk));
      chunk = stream.read();
    }
    return chunks.join('');
  }

  throw new Error('Could not read input stream.');
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  main
};
