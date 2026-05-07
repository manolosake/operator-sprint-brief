const assert = require('node:assert/strict');
const test = require('node:test');
const { renderHtml, escapeHtml } = require('../src/renderHtml');

test('renderHtml includes required brief sections', () => {
  const html = renderHtml({
    title: 'Demo <Brief>',
    theme: 'warm',
    status: 'Ready',
    evidence: ['JSON works'],
    risks: ['None known'],
    actions: ['Confirm operator handoff'],
    nextMilestone: 'Review',
    meta: {
      generatedAt: '2026-05-06T00:00:00.000Z',
      sourceType: 'json'
    }
  });

  assert.match(html, /Evidence/);
  assert.match(html, /Risks/);
  assert.match(html, /Actions/);
  assert.match(html, /Next Milestone/);
  assert.match(html, /Demo &lt;Brief&gt;/);
  assert.match(html, /data-theme="warm"/);
  assert.match(html, /--accent: #c2410c;/);
});

test('escapeHtml escapes unsafe characters', () => {
  assert.equal(escapeHtml('<script>"x" & y</script>'), '&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;');
});
