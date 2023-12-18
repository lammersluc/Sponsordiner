import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';
import { Resend } from 'resend';

import { Reservering } from '../../components/schema';
import { createEmail } from "../../components/email";

mongoose.connect(process.env.MONGO_URL || '')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
 
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === 'POST') {

        if (req.body.personen > 15 || req.body.personen < 1 || req.body.wijn > req.body.personen) return res.status(406);
        if (!req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            return res.status(406);

        if (await Reservering.findOne({ email: req.body.email })) return res.status(409);

        const result = await Reservering.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$personen"
                    }
                }
            }
        ]);
        
        if (result[0].personen + req.body.personen > parseInt(process.env.MAX_RESERVERINGEN || '')) return res.status(403);

        Reservering.create({
            naam: req.body.naam,
            email: req.body.email,
            personen: req.body.personen,
            wijn: req.body.wijn,
            extra: req.body.extra
        });

        await resend.emails.send({
            from: 'Sponsordiner <onboarding@resend.dev>',
            to: [req.body.email, process.env.BEVESTIGINGSMAIL || ''],
            subject: 'Sponsordiner reservering',
            html: createEmail(req.body)
        });
        
        return res.status(200);

    } else if (req.method === 'GET') {

        if ((req.headers.authorization || '').split("Bearer ").at(1) != process.env.BEARER_TOKEN) return res.status(401)

        const data = await Reservering.find({}, '-_id -__v');

        return res.status(200).json(data);

    }

}