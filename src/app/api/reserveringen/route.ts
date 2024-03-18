import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

import { Families } from '@/utils/schema';
import { createEmail } from "@/utils/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
    req: NextRequest
) {

    const body = await req.json();

    if (
        typeof body.naam !== 'string' ||
        typeof body.personen !== 'number' ||
        typeof body.wijn !== 'number' ||
        typeof body.extra !== 'string' ||
        body.personen > 15 ||
        body.personen < 1 ||
        body.wijn > body.personen ||
        body.wijn < 0 ||
        !body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        ) return NextResponse.json({}, { status: 406 });

    const result = await Families.aggregate([
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$personen"
                }
            }
        }
    ]);

    if (result[0] && result[0].personen + body.personen > parseInt(process.env.MAX_PERSONEN || '')) return NextResponse.json({}, { status: 403 });

    try {

        await Families.create({
            naam: body.naam,
            email: body.email,
            personen: body.personen,
            wijn: body.wijn,
            extra: body.extra
        });

    } catch (e: any) {
        if (e.code === 11000) return NextResponse.json({}, { status: 409 });
        return NextResponse.json({}, { status: 500 });
    }

    let to = [body.email];
    if (process.env.CC !== undefined) to = to.concat(process.env.CC.split(','));

    resend.emails.send({
        from: 'Sponsordiner <maud@lammers.me>',
        to,
        subject: 'Sponsordiner reservering',
        html: createEmail(body)
    });
    
    return NextResponse.json({}, { status: 201 });
}

export async function GET(
    req: NextRequest,
) {

    if ((req.headers.get('Authorization') || '').split("Bearer ")[1] !== process.env.TOKEN) return NextResponse.json({}, { status: 401 })

    return NextResponse.json( await Families.find({}, '-_id -__v') );
}