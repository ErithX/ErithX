import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const users = await mongoose.connection.db.collection('users').find({ email: { $exists: true, $ne: null } }).toArray();
  const validEmails = users.map(u => u.email);
  console.log('Valid DB Emails:', validEmails);
  process.exit(0);
});
