import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const plan = JSON.parse(readFileSync(new URL('app/data/training-2027.json', root), 'utf8'));
// Webinar preparation dates are internal planning data.
delete plan.webinars;
const file = new URL('public/training-calendar-2027.html', root);
const html = readFileSync(file, 'utf8');
const marker = /(<script id="calendar-data" type="application\/json">\s*)[\s\S]*?(\s*<\/script>)/;
if (!marker.test(html)) throw new Error('Calendar data block missing');
const updated = html.replace(marker, (_, start, end) => start + JSON.stringify(plan) + end);
if (process.argv.includes('--check')) {
  if (updated !== html) throw new Error('Calendar is out of sync. Run node scripts/sync-training-calendar.mjs');
  console.log('Calendar date data is in sync.');
} else {
  writeFileSync(file, updated);
  console.log('Updated standalone calendar date data.');
}
