import mongoose from 'mongoose';

const uri = "mongodb+srv://debjyoti2409_db_user:s2ak4ry8Wbat3Csj@cluster0.i3drqgy.mongodb.net";

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ supabaseId: '4b470d73-24eb-448d-8cdd-0c23952b96dd' });
  console.log("User in users collection:", user);
  
  const profile = await db.collection('usercoderprofiles').findOne({ userId: '4b470d73-24eb-448d-8cdd-0c23952b96dd' });
  console.log("Profile in usercoderprofiles collection:", profile);

  process.exit(0);
}
check();
