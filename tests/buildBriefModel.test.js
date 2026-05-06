const assert = require('node:assert/strict');
const test = require('node:test');
const { buildBriefModel } = require('../src/buildBriefModel');

test('buildBriefModel normalizes core fields', () => {
  const model = buildBriefModel({
    title: 'Operator Brief',
    status: 'Ready',
    evidence: 'Demo generated\nTests pass',
    risks: ['Parser is simple'],
    next_milestone: 'Review'
  });

  assert.equal(model.title, 'Operator Brief');
  assert.equal(model.status, 'Ready');
  assert.deepEqual(model.evidence, ['Demo generated', 'Tests pass']);
  assert.deepEqual(model.risks, ['Parser is simple']);
  assert.equal(model.nextMilestone, 'Review');
  assert.match(model.meta.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test('buildBriefModel supplies clear defaults', () => {
  const model = buildBriefModel({});

  assert.equal(model.title, 'Operator Sprint Brief');
  assert.deepEqual(model.evidence, ['No evidence supplied.']);
  assert.deepEqual(model.risks, ['No risks supplied.']);
});

test('buildBriefModel normalizes provided generated timestamp', () => {
  const model = buildBriefModel({
    generatedAt: '2026-05-06 05:28:15 UTC'
  });

  assert.equal(model.meta.generatedAt, '2026-05-06T05:28:15.000Z');
});
