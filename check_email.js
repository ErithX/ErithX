import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ supabaseId: '4b470d73-24eb-448d-8cdd-0c23952b96dd' });
  console.log("User email in DB is:", user ? user.email : "USER NOT FOUND");
  
  const profile = await db.collection('usercoderprofiles').findOne({ userId: '4b470d73-24eb-448d-8cdd-0c23952b96dd' });
  console.log("Profile userEmail in DB is:", profile ? profile.userEmail : "PROFILE NOT FOUND");

  process.exit(0);
}
check();
