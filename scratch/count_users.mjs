import connectToDatabase from './app/lib/mongodb.js';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function countUsers() {
    await connectToDatabase();
    const count = await User.countDocuments({ email: { $exists: true, $ne: null } });
    console.log(`Total users with email: ${count}`);
    process.exit(0);
}
countUsers();
