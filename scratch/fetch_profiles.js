const fs = require('fs');
const path = require('path');

// Read .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[match[1]] = value.trim();
  }
}

const { createClient } = require('@supabase/supabase-js');
const mongoose = require('mongoose');

async function main() {
  console.log('=== SUPABASE USER PROFILES ===');
  const sbUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (sbUrl && sbKey) {
    const supabase = createClient(sbUrl, sbKey);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, username, leetcode_url, codeforces_url, github_username, codechef_url, hackerank_url, geeksforgeeks_url, created_at');
    if (error) {
      console.error('Supabase query error:', error);
    } else {
      console.log(`Total users in user_profiles: ${data.length}`);
      const connected = data.filter(u => 
        u.leetcode_url || u.codeforces_url || u.github_username || u.codechef_url || u.hackerank_url || u.geeksforgeeks_url
      );
      console.log(`Users with at least one profile connected: ${connected.length}\n`);
      console.log(JSON.stringify(connected, null, 2));
    }
  }

  console.log('\n=== MONGODB USER CODER PROFILES ===');
  if (envVars.MONGODB_URI) {
    await mongoose.connect(envVars.MONGODB_URI);
    const profiles = await mongoose.connection.db.collection('usercoderprofiles').find({}).toArray();
    console.log(`Total records in usercoderprofiles: ${profiles.length}\n`);
    console.log(JSON.stringify(profiles, null, 2));
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
