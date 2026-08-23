const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const AIReview = require('../models/AIReview').default || require('../models/AIReview');
  const review = await AIReview.findOne({}).sort({ created_at: -1 }).lean();
  if (review && review.stats_snapshot) {
    fs.writeFileSync('llm_input.json', JSON.stringify(review.stats_snapshot, null, 2));
    fs.writeFileSync('llm_output.txt', review.generated_text);
    console.log('Saved to llm_input.json and llm_output.txt');
  } else {
    console.log('No stats snapshot found');
  }
  process.exit(0);
}).catch(console.error);
