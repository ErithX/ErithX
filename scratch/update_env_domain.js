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

// Note: We are replacing 'https://erithx.dev' which we just injected in the previous step
const targetStr = "'https://erithx.dev'";
const targetStr2 = '"https://erithx.dev"';
const targetStr3 = "`https://erithx.dev/resources/${doc._id}`";
const replacementStr = "(process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app')";
const replacementStr2 = "`${process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app'}/resources/${doc._id}`";

filesToUpdate.forEach(file => {
  const filePath = path.join('e:/projects/contest-tracker', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Quick string replacements
    content = content.replace(/'https:\/\/erithx\.dev'/g, replacementStr);
    content = content.replace(/"https:\/\/erithx\.dev"/g, replacementStr);
    content = content.replace(/`https:\/\/erithx\.dev\/resources\/\$\{doc\._id\}`/g, replacementStr2);
    // There are some specific concatenated paths:
    content = content.replace(/'https:\/\/erithx\.dev\/contests'/g, "`${process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app'}/contests`");
    content = content.replace(/'https:\/\/erithx\.dev\/docs'/g, "`${process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app'}/docs`");
    content = content.replace(/'https:\/\/erithx\.dev\/resources'/g, "`${process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app'}/resources`");
    content = content.replace(/'https:\/\/erithx\.dev\/logo\.png'/g, "`${process.env.NEXT_PUBLIC_SITE_URL || 'https://contest-tracker-zms3.vercel.app'}/logo.png`");

    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
