import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log(`Total raw users in DB: ${users.length}`);
  const usersWithEmail = users.filter(u => u.email);
  console.log(`Users with email: ${usersWithEmail.length}`);
  console.log('Sample emails:', usersWithEmail.slice(0, 5).map(u => u.email));
  process.exit(0);
});
