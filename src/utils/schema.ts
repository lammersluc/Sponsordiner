import mongoose from '@/utils/db';

const Schema = mongoose.Schema;

const reserveringSchema = new Schema({
    naam: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    personen: {
        type: Number,
        required: true
    },
    wijn: {
        type: Number,
        required: true
    },
    extra: {
        type: String,
        required: false
    },
    datum: {
        type: Date,
        default: Date.now
    }
});

export const Reservering = mongoose.model('Reservering', reserveringSchema);