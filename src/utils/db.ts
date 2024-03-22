import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI || '')
    .catch((err: any) => console.log(err));

export default mongoose;