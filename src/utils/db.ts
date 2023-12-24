import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: any) => console.log(err));

export default mongoose;