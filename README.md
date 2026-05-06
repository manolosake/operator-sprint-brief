# Operator Sprint Brief

Operator Sprint Brief is a local-first Node.js CLI that turns a sprint/order JSON file or simple markdown notes into a polished, self-contained HTML operator brief. The output is intended for quick visual review: status, evidence, risks, and the next milestone are all visible in one file that opens without a server.

## Install

No external npm dependencies are required.

```bash
npm install
```

## Run

Generate a brief from JSON:

```bash
node src/cli.js samples/sprint-order.json demo/operator-brief.html
```

Generate a brief from markdown notes:

```bash
node src/cli.js samples/sprint-notes.md demo/operator-brief-from-md.html
```

Run both demo commands:

```bash
npm run demo
```

## Test

```bash
npm test
```

## Input Formats

JSON input supports fields like:

```json
{
  "title": "Operator Sprint Brief",
  "generatedAt": "2026-05-06T05:28:15.000Z",
  "status": "Ready for review",
  "evidence": ["Tests pass", "Demo generated"],
  "risks": ["Markdown parsing is intentionally simple"],
  "nextMilestone": "Collect operator feedback"
}
```

Markdown input supports simple headings:

```markdown
# Brief Title

## Status
Ready for review.

## Generated At
2026-05-06T05:28:15.000Z

## Evidence
- Tests pass.
- Demo generated.

## Risks
- Markdown parsing is intentionally simple.

## Next Milestone
Collect operator feedback.
```

`generatedAt` is optional. When provided in JSON, or under a `Generated At` markdown heading, parseable timestamps are normalized and reused so demo regeneration is reproducible. When omitted, the CLI uses the current time for normal ad hoc briefs.

## Demo Artifacts

The generated demo HTML files live in `demo/`. A copy suitable for preview capture is written to `.codexbot_preview/preview.html`.

## Next Milestone

After this local milestone is accepted, the next useful step is adding optional theme presets and stricter input validation while keeping the CLI dependency-free.
