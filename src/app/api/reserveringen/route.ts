import { Resend } from 'resend';
import { createEmail } from "../../../utils/email";
import { NextRequest, NextResponse } from 'next/server';

import { Reservering } from '../../../utils/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
    req: NextRequest
) {

    const body = await req.json();

    if (
        !body.naam ||
        !body.email ||
        !body.personen ||
        !body.wijn ||
        !body.extra ||
        body.personen > 15 ||
        body.personen < 1 ||
        body.wijn > body.personen ||
        body.wijn < 0 ||
        !body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        ) return NextResponse.json({}, { status: 406 });

    if (await Reservering.findOne({ email: body.email })) return NextResponse.json({}, { status: 409 });

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

    if (result[0] && result[0].personen + body.personen > parseInt(process.env.MAX_RESERVERINGEN || '')) return NextResponse.json({}, { status: 403 });

    Reservering.create({
        naam: body.naam,
        email: body.email,
        personen: body.personen,
        wijn: body.wijn,
        extra: body.extra
    });

    await resend.emails.send({
        from: 'Sponsordiner <onboarding@resend.dev>',
        to: [body.email, process.env.BEVESTIGINGSMAIL || ''],
        subject: 'Sponsordiner reservering',
        html: createEmail(body)
    });
    
    return NextResponse.json({}, { status: 201 });

}

export async function GET(
    req: NextRequest,
) {

    if ((req.headers.get('Authorization') || '').split("Bearer ")[1] != process.env.BEARER_TOKEN) return NextResponse.json({}, { status: 401 })

    return NextResponse.json(await Reservering.find({}, '-_id -__v'));

}