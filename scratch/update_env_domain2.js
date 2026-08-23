const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/docs/page.tsx',
  'app/contests/layout.tsx',
  'app/layout.tsx',
  'app/page.tsx',
  'app/resources/layout.tsx',
  'app/resources/[id]/layout.tsx'
];

const oldStr1 = "(process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app')";
const oldStr2 = "`${process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app'}";

const newStr1 = "process.env.NEXT_PUBLIC_NEW_DOMAIN";
const newStr2 = "`${process.env.NEXT_PUBLIC_NEW_DOMAIN}";

filesToUpdate.forEach(file => {
  const filePath = path.join('e:/projects/contest-tracker', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.split(oldStr1).join(newStr1);
    content = content.split(oldStr2).join(newStr2);

    fs.writeFileSync(filePath, content);
    console.log(`Cleaned up: ${file}`);
  }
});
