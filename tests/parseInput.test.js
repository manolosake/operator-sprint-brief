const assert = require('node:assert/strict');
const test = require('node:test');
const { parseJson, parseMarkdown } = require('../src/parseInput');

test('parseJson returns object with source metadata', () => {
  const parsed = parseJson('{"title":"Brief","status":"Green"}', '/tmp/brief.json');

  assert.equal(parsed.title, 'Brief');
  assert.equal(parsed.status, 'Green');
  assert.equal(parsed.sourceType, 'json');
  assert.equal(parsed.sourcePath, '/tmp/brief.json');
});

test('parseMarkdown extracts simple operator sections', () => {
  const parsed = parseMarkdown(`# Demo

## Status
On track.

## Evidence
- Parser works.
- Renderer works.

## Generated At
2026-05-06 05:28:15 UTC

## Risks
- Scope creep.

## Next Actions
- Confirm rollout checklist.
- Assign review owner.

## Next Milestone
Ship local demo.
`, '/tmp/demo.md');

  assert.equal(parsed.title, 'Demo');
  assert.equal(parsed.status, 'On track.');
  assert.equal(parsed.generatedAt, '2026-05-06 05:28:15 UTC');
  assert.deepEqual(parsed.evidence, ['Parser works.', 'Renderer works.']);
  assert.deepEqual(parsed.risks, ['Scope creep.']);
  assert.deepEqual(parsed.actions, ['Confirm rollout checklist.', 'Assign review owner.']);
  assert.equal(parsed.nextMilestone, 'Ship local demo.');
});
