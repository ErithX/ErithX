import connectToDatabase from './app/lib/mongodb.js';
import { Resource } from './models/Resource.js';

async function check() {
    await connectToDatabase();
    const docs = await Resource.find({}, 'slug title status');
    console.log(JSON.stringify(docs, null, 2));
    process.exit(0);
}
check();
