const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }));

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find().sort({ _id: -1 }).limit(5);
  console.log(users);
  process.exit(0);
}

run();
