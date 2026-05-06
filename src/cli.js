#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { parseInput } = require('./parseInput');
const { buildBriefModel } = require('./buildBriefModel');
const { renderHtml } = require('./renderHtml');

function main(argv = process.argv.slice(2)) {
  const [inputPath, outputPath] = argv;

  if (!inputPath || !outputPath) {
    console.error('Usage: node src/cli.js <input.json|input.md> <output.html>');
    return 1;
  }

  const parsed = parseInput(inputPath);
  const model = buildBriefModel(parsed);
  const html = renderHtml(model);
  const resolvedOutput = path.resolve(outputPath);

  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
  fs.writeFileSync(resolvedOutput, html, 'utf8');
  console.log(`Wrote ${resolvedOutput}`);
  return 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  main
};
