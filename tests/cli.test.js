const assert = require('node:assert/strict');
const test = require('node:test');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const cliPath = path.join(__dirname, '..', 'src', 'cli.js');

test('cli supports piping JSON from stdin to stdout', () => {
  const result = spawnSync(process.execPath, [cliPath, '-', '-'], {
    encoding: 'utf8',
    input: JSON.stringify({
      title: 'Pipeline Brief',
      status: 'Ready',
      evidence: ['stdin works'],
      risks: ['none'],
      actions: ['ship it'],
      nextMilestone: 'Review'
    })
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /<title>Pipeline Brief<\/title>/);
  assert.match(result.stdout, /stdin works/);
  assert.equal(result.stderr, '');
});

test('cli returns a clean error for empty stdin input', () => {
  const result = spawnSync(process.execPath, [cliPath, '-', '-'], {
    encoding: 'utf8',
    input: ''
  });

  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Input was empty\./);
});

test('cli check mode validates stdin input without generating html', () => {
  const result = spawnSync(process.execPath, [cliPath, '--check', '-'], {
    encoding: 'utf8',
    input: JSON.stringify({
      title: 'Check Brief',
      status: 'Ready',
      evidence: ['proof'],
      risks: ['known gap'],
      actions: ['review'],
      nextMilestone: 'Ship'
    })
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Valid brief input\./);
  assert.match(result.stdout, /title="Check Brief"/);
  assert.match(result.stdout, /evidence=1/);
  assert.equal(result.stderr, '');
});
