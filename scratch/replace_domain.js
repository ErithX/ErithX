const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/docs/page.tsx',
  'app/contests/layout.tsx',
  'app/layout.tsx',
  'app/page.tsx',
  'app/sitemap.ts',
  'app/robots.ts',
  'app/resources/layout.tsx',
  'app/resources/[id]/layout.tsx'
];

const oldUrl = 'https://contest-tracker-zms3.vercel.app';
const newUrl = 'https://erithx.dev';

filesToUpdate.forEach(file => {
  const filePath = path.join('e:/projects/contest-tracker', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldUrl)) {
      content = content.split(oldUrl).join(newUrl);
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${file}`);
    } else {
      console.log(`Skipped (not found): ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
