import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { bearer } from "@elysiajs/bearer";
import { Resend } from "resend";

import { createEmail } from "./email";

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
            to: [body.email],
            subject: 'Sponsordiner reservering',
            html: createEmail(body)
        });
        
        set.status = 200;
        return;

    }, {
        body: t.Object({
            naam: t.String(),
            email: t.String(),
            personen: t.Number(),
            wijn: t.Number(),
            extra: t.String()
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
