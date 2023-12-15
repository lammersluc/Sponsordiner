import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { bearer } from "@elysiajs/bearer";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const app = new Elysia()
    .use(cors())
    .use(bearer())
    .post("/api/reserveringen", async ({ body, set }) => {

        if (body.personen > 15 || body.personen < 1 || body.wijn > body.personen) { set.status = 406; return; }
        if (!body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            { set.status = 406; return; }
        
        let data = await Bun.file("data/reserveringen.json").json();

        if (data.find((r: any) => r.email == body.email)) { set.status = 409; return; }

        let i = 0;
        data.forEach((r: any) => {
            i += r.personen;
        });

        if (i > parseInt(process.env.MAX_RESERVERINGEN || '')) { set.status = 403; return; }

        await data.push(body);
        await Bun.write("data/reserveringen.json", JSON.stringify(data));

        const check = await Bun.file("data/reserveringen.json").json();

        if (!check.find((r: any) => r.email == body.email)) { set.status = 500; return; }

        await resend.emails.send({
            from: 'Sponsordiner <onboarding@resend.dev>',
            to: [body.email, 'maud.lammers.11@gmail.com'],
            subject: 'Sponsordiner reservering',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reserveringsbevestiging</title>
                </head>
                <body style="font-family: Arial, sans-serif;">
        
                    <div style="background-color: rgb(245, 130, 32); color: #fff; padding: 20px;">
                        <h2>Reserveringsbevestiging - Sponsordiner</h2>
                    </div>
        
                    <div style="padding: 20px;">
                        <p>Beste <strong>${body.naam}</strong>,</p>
        
                        <p>Bedankt voor je reservering voor het sponsordiner. Hier zijn de details van je reservering:</p>
        
                        <ul>
                            <li><strong>Naam:</strong> ${body.naam}</li>
                            <li><strong>Email:</strong> ${body.email}</li>
                            <li><strong>Aantal Personen:</strong> ${body.personen}</li>
                            <li><strong>Aantal Wijnarrangementen:</strong> ${body.wijn}</li>
                            <li><strong>Dieetwensen:</strong> ${body.extra ?? 'geen'}</li>
                        </ul>
        
                        <p>Bedankt voor je reservering aan het sponsordiner. Ik kijken ernaar uit je te verwelkomen!</p>
                        <p>Op 24 maart 2024 bent u welkom vanaf 17.30, om 18.00 zal het diner starten. De locatie is Nieuwstraat 51, 6021 HP Budel.</p>
        
                        <p>Met vriendelijke groet,<br />Maud Lammers</p>
                    </div>
        
                    <a href='https://www.runforkikamarathon.nl/maud-lammers-wenen-2024' target='_blank'>
                    <div style="background-color: rgb(82, 41, 136); color: #fff; padding: 10px; text-align: center;">
                        <p>Doneren kan hier</p>
                    </div>
                    </a>
        
                </body>
                </html>
            `
        });
        
        set.status = 200;
        return;

    }, {
        body: t.Object({
            naam: t.String(),
            email: t.String(),
            personen: t.Number(),
            wijn: t.Number(),
            extra: t.Optional(t.String())
        })
    })
    .get("/api/reserveringen", async ({ bearer, set, }) => {
            
        if (bearer != process.env.BEARER_TOKEN) { set.status = 401; return; }

        let data = await Bun.file("data/reserveringen.json").json();

        set.status = 200;
        return data;
    
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
