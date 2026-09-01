import mongoose from 'mongoose';

const uri = "mongodb+srv://debjyoti2409_db_user:s2ak4ry8Wbat3Csj@cluster0.i3drqgy.mongodb.net";

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  // Find the most recently created profiles
  const recentProfiles = await db.collection('usercoderprofiles').find().sort({createdAt: -1}).limit(3).toArray();
  console.log("Most recent UserCoderProfiles:");
  recentProfiles.forEach(p => console.log(`- ID: ${p.userId}, Email: ${p.userEmail}, Created: ${p.createdAt}`));

  const recentUsers = await db.collection('users').find().sort({createdAt: -1}).limit(3).toArray();
  console.log("\nMost recent Users:");
  recentUsers.forEach(u => console.log(`- ID: ${u.supabaseId}, Email: ${u.email}, Created: ${u.createdAt}`));

  process.exit(0);
}
check();
