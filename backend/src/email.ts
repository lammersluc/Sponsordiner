interface EmailBody {
    naam: string;
    email: string;
    personen: number;
    wijn: number;
    extra: any;
}

export function createEmail(body: EmailBody) {
    return (`
  
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>Reserveringsbevestiging</title>
        <style>
    
            * {
                user-select: none;
            }
    
            body {
                width: 100vw;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                background: linear-gradient(to bottom, rgb(245, 130, 32), rgb(82, 41, 136));
            }
    
            #main {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            }
    
            #content {
                margin: 20px auto;
                width: 90%;
                max-width: 600px;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
    
            #list {
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
            }
    
            #value {
                margin-bottom: 5px;
            }
    
            #donate {
                background-color: #2196F3;
                font-weight: bold;
                color: #fff;
                padding: 10px;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
                display: block;
                margin-top: 20px;
                transition: background-color 0.2s ease-in-out;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            }
    
            #donate:hover {
                background-color: #1565C0;
            }
    
        </style>
    
    </head>
    
    <body>
    
        <div id="main">
        
            <div id="content">

                <h2>Reserveringsbevestiging - Sponsordiner</h2>
        
                <p>Beste <strong>${body.naam}</strong>,</p>
        
                <p>Bedankt voor je reservering voor het sponsordiner. Hier zijn de details van je reservering:</p>
        
                <ul style="padding: 0;">
                    <li id="list">
                        <strong>Naam</strong>
                        <div id="value">${body.naam}</div>
                    </li>
                    <li id="list">
                        <strong>Email</strong>
                        <div id="value">${body.email}</div>
                    </li>
                    <li id="list">
                        <strong>Personen</strong>
                        <div id="value">${body.personen}</div>
                    </li>
                    <li id="list">
                        <strong>Wijnarrangementen</strong>
                        <div id="value">${body.wijn}</div>
                    </li>
                    <li id="list">
                        <strong>Dieetwensen</strong>
                        <div id="value">${body.extra ?? 'geen'}</div>
                    </li>
                </ul>
        
                <p>Bedankt voor je reservering aan het sponsordiner. Ik kijk ernaar uit je te verwelkomen!</p>
                <p>Op 24 maart 2024 bent u welkom vanaf 17.30 uur, om 18.00 uur zal het diner beginnen. Lust bevindt zich op Nieuwstraat 51, 6021 HP Budel.</p>
        
                <p>Met vriendelijke groet,<br />Maud Lammers</p>
        
                <a href='https://www.runforkikamarathon.nl/maud-lammers-wenen-2024' id="donate" target='_blank'>Doneren kan hier</a>

            </div>
        
        </div>
        
    </body>
    
    </html>
  
  
  `);
}