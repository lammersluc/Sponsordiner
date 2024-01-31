import mongoose from './db';

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

export const Familie = mongoose.model('Familie', reserveringSchema);
export const Ondernemers = mongoose.model('Ondernemer', reserveringSchema);