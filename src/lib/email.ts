import fs from 'fs';
import path from 'path';

interface VisitEmailParams {
  creatorEmail: string;
  visitorUsername: string;
  spotName: string;
  eventDate: string;
  eventTime: string;
  commentText: string;
  spotId: string;
  visitId: string;
}

export async function sendVisitNotificationEmail({
  creatorEmail,
  visitorUsername,
  spotName,
  eventDate,
  eventTime,
  commentText,
  spotId,
  visitId
}: VisitEmailParams) {
  // Construct deep link to the specific event on the scheduling platform
  const deepLink = `http://localhost:3000/?spot=${spotId}&visit=${visitId}`;
  
  const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="de">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neuer Mitfahrer für deinen eFoil-Termin!</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 10px !important; }
      .button-wrapper { width: 100% !important; text-align: center !important; }
      .button { display: block !important; padding: 16px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #0f172a; color: #f8fafc;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${visitorUsername} hat sich für deinen eFoil-Termin am Spot ${spotName} eingetragen!
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; table-layout: fixed;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #1e293b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <tr>
            <td height="6" style="background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);"></td>
          </tr>

          <tr>
            <td align="center" valign="top" style="padding: 40px 30px 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: rgba(56, 189, 248, 0.1); border-radius: 16px; padding: 12px; border: 1px solid rgba(56, 189, 248, 0.2);">
                    <span style="font-size: 24px; font-weight: 800; color: #38bdf8; letter-spacing: -1px; font-family: system-ui, sans-serif; display: block; line-height: 1;">⚡</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 20px 0 0 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">eFoilMap</h1>
              <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: 500; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px;">Co-Foil Coordination</p>
            </td>
          </tr>

          <tr>
            <td align="left" valign="top" style="padding: 10px 40px 30px 40px;">
              <p style="font-size: 16px; line-height: 1.6; color: #f8fafc; margin-bottom: 20px;">
                Hallo!
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 25px;">
                Gute Neuigkeiten! Ein anderer Rider möchte mit dir eFoilen gehen. <strong>@${visitorUsername}</strong> hat sich für deinen geplanten Termin am Spot <strong>${spotName}</strong> eingetragen!
              </p>

              <!-- Card Event Details -->
              <table border="0" cellpadding="15" cellspacing="0" width="100%" style="background-color: rgba(255, 255, 255, 0.03); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 30px;">
                <tr>
                  <td valign="top">
                    <p style="font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Geplanter Termin</p>
                    <p style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 15px 0;">📅 ${eventDate} um ⏰ ${eventTime} Uhr</p>
                    
                    <p style="font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Kommentar von @${visitorUsername}</p>
                    <p style="font-size: 14px; font-style: italic; color: #e2e8f0; margin: 0; padding-left: 10px; border-left: 2px solid #38bdf8;">
                      "${commentText}"
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button Section -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper">
                      <tr>
                        <td align="center" style="background-color: #0ea5e9; border-radius: 14px; box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -1px rgba(14, 165, 233, 0.1);">
                          <a href="${deepLink}" target="_blank" class="button" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 14px; border: 1px solid #38bdf8;">
                            Verabredung ansehen & chatten 💬
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 25px;">
                <tr><td></td></tr>
              </table>

              <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; margin-bottom: 8px;">
                Falls der Button nicht funktioniert, kopiere diesen Link direkt in deinen Webbrowser:
              </p>
              <p style="font-size: 11px; line-height: 1.5; color: #38bdf8; word-break: break-all; margin-bottom: 0px;">
                <a href="${deepLink}" target="_blank" style="color: #38bdf8; text-decoration: underline;">
                  ${deepLink}
                </a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" valign="top" style="padding: 20px 40px 40px 40px; background-color: #0f172a; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="font-size: 11px; line-height: 1.6; color: #64748b; margin-bottom: 15px;">
                Du erhältst diese E-Mail, weil du auf <a href="https://www.efoilmap.com" target="_blank" style="color: #94a3b8; text-decoration: underline;">efoilmap.com</a> einen eFoil-Termin geplant hast und ein anderer Rider antwortete.
              </p>
              
              <p style="font-size: 11px; line-height: 1.6; color: #64748b; margin-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">
                <strong>eFoilMap.com</strong><br />
                Angelpower UG (haftungsbeschränkt)<br />
                Belvedereallee 5, 52070 Aachen, Deutschland<br />
                Vertreten durch die Geschäftsführung: Carlo Matic<br />
                E-Mail: <a href="mailto:hi@efoilmap.com" style="color: #64748b; text-decoration: none;">hi@efoilmap.com</a>
              </p>
              
              <p style="font-size: 10px; line-height: 1.5; color: #475569; margin-top: 20px;">
                © 2026 eFoilMap. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    // Ensure scratch directory exists inside the workspace
    const scratchDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    
    // Write email to the scratch directory as an artifact
    const filePath = path.join(scratchDir, 'last_visit_notification.html');
    fs.writeFileSync(filePath, emailHtml, 'utf8');

    // Also write to public folder so it can be viewed at http://localhost:3000/last_visit_notification.html
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicFilePath = path.join(publicDir, 'last_visit_notification.html');
    fs.writeFileSync(publicFilePath, emailHtml, 'utf8');

    // Print highly premium CLI announcement
    console.log(`\n\x1b[36m================== ⚡ eFoilMap EMAIL SIMULATOR ⚡ ==================\x1b[0m`);
    console.log(`\x1b[32m📧 Notification Triggered Successfully!\x1b[0m`);
    console.log(`\x1b[37mTo:\x1b[0m \x1b[33m${creatorEmail || 'unknown@efoilmap.com'}\x1b[0m`);
    console.log(`\x1b[37mSubject:\x1b[0m Neuer Mitfahrer für deinen eFoil-Termin am Spot ${spotName}!`);
    console.log(`\x1b[37mComment:\x1b[0m @${visitorUsername}: "${commentText}"`);
    console.log(`\x1b[36m-----------------------------------------------------------------\x1b[0m`);
    console.log(`\x1b[35m👉 Local Browser Preview Links:\x1b[0m`);
    console.log(`\x1b[37mWeb URL:\x1b[0m \x1b[4mhttp://localhost:3000/last_visit_notification.html\x1b[0m`);
    console.log(`\x1b[37mFile URL:\x1b[0m \x1b[4mfile://${filePath}\x1b[0m`);
    console.log(`\x1b[36m=================================================================\x1b[0m\n`);

  } catch (err) {
    console.error("Error writing simulated email:", err);
  }
}

interface QuestionEmailParams {
  creatorEmail: string;
  askerUsername: string;
  spotName: string;
  questionText: string;
  spotId: string;
  creatorLang: string;
}

const EMAIL_LOCALIZATION: Record<string, {
  subject: (spotName: string) => string;
  preheader: (asker: string, spotName: string) => string;
  greeting: string;
  bodyText: (asker: string, spotName: string) => string;
  ctaText: string;
  fallbackText: string;
  footerText: string;
}> = {
  de: {
    subject: (spotName) => `Neue Frage zu deinem eFoil-Spot ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} hat eine Frage zu deinem Spot ${spotName} gestellt!`,
    greeting: "Hallo!",
    bodyText: (asker, spotName) => `Gute Neuigkeiten aus der Community! Jemand hat eine Frage zu deinem Spot <strong>${spotName}</strong> gestellt. <strong>@${asker}</strong> fragt:`,
    ctaText: "Frage beantworten 💬",
    fallbackText: "Falls der Button nicht funktioniert, kopiere diesen Link direkt in deinen Webbrowser:",
    footerText: "Du erhältst diese E-Mail, weil du auf <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> einen eFoil-Spot eingetragen hast und ein anderer Rider eine Frage gestellt hat."
  },
  en: {
    subject: (spotName) => `New question about your eFoil spot ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} asked a question about your spot ${spotName}!`,
    greeting: "Hello!",
    bodyText: (asker, spotName) => `Good news from the community! Someone asked a question about your spot <strong>${spotName}</strong>. <strong>@${asker}</strong> asks:`,
    ctaText: "Answer question 💬",
    fallbackText: "If the button does not work, copy this link directly into your web browser:",
    footerText: "You are receiving this email because you contributed an eFoil spot on <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> and another rider asked a question."
  },
  es: {
    subject: (spotName) => `¡Nueva pregunta sobre tu spot de eFoil ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} ha hecho una pregunta sobre tu spot ${spotName}!`,
    greeting: "¡Hola!",
    bodyText: (asker, spotName) => `¡Buenas noticias de la comunidad! Alguien ha hecho una pregunta sobre tu spot <strong>${spotName}</strong>. <strong>@${asker}</strong> pregunta:`,
    ctaText: "Responder pregunta 💬",
    fallbackText: "Si el botón no funciona, copia este enlace directamente en tu navegador web:",
    footerText: "Recibes este correo electrónico porque registraste un spot de eFoil en <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> y otro rider hizo una pregunta."
  },
  fr: {
    subject: (spotName) => `Nouvelle question sur ton spot eFoil ${spotName} ! 🌊`,
    preheader: (asker, spotName) => `@${asker} a posé une question sur ton spot ${spotName} !`,
    greeting: "Bonjour !",
    bodyText: (asker, spotName) => `Bonne nouvelle de la communauté ! Quelqu'un a posé une question sur ton spot <strong>${spotName}</strong>. <strong>@${asker}</strong> demande :`,
    ctaText: "Répondre à la question 💬",
    fallbackText: "Si le bouton ne fonctionne pas, copie ce lien directement dans ton navigateur web :",
    footerText: "Tu reçois cet e-mail car tu as enregistré un spot eFoil sur <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> et un autre rider a posé une question."
  },
  it: {
    subject: (spotName) => `Nuova domanda sul tuo spot eFoil ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} ha fatto una domanda sul tuo spot ${spotName}!`,
    greeting: "Ciao!",
    bodyText: (asker, spotName) => `Buone notizie dalla community! Qualcuno ha posto una domanda sul tuo spot <strong>${spotName}</strong>. <strong>@${asker}</strong> chiede:`,
    ctaText: "Rispondi alla domanda 💬",
    fallbackText: "Se il pulsante non funziona, copia questo link direttamente nel tuo browser:",
    footerText: "Ricevi questa email perché hai inserito uno spot eFoil su <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> e un altro rider ha fatto una domanda."
  },
  pt: {
    subject: (spotName) => `Nova pergunta sobre o teu spot de eFoil ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} fez uma pergunta sobre o teu spot ${spotName}!`,
    greeting: "Olá!",
    bodyText: (asker, spotName) => `Boas notícias da comunidade! Alguém fez uma pergunta sobre o teu spot <strong>${spotName}</strong>. <strong>@${asker}</strong> pergunta:`,
    ctaText: "Responder à pergunta 💬",
    fallbackText: "Se o botão não funcionar, copia este link diretamente para o teu navegador:",
    footerText: "Recebeste este email porque registaste um spot de eFoil em <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> e outro rider fez uma pergunta."
  },
  nl: {
    subject: (spotName) => `Nieuwe vraag over jouw eFoil-spot ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} heeft een vraag gesteld over jouw spot ${spotName}!`,
    greeting: "Hallo!",
    bodyText: (asker, spotName) => `Goed nieuws van de community! Iemand heeft een vraag gesteld over jouw spot <strong>${spotName}</strong>. <strong>@${asker}</strong> vraagt:`,
    ctaText: "Vraag beantwoorden 💬",
    fallbackText: "Als de knop niet werkt, kopieer dan deze link rechtstreeks in je webbrowser:",
    footerText: "Je ontvangt deze e-mail omdat je een eFoil-spot hebt toegevoegd op <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> en een andere rider een vraag heeft gesteld."
  },
  pl: {
    subject: (spotName) => `Nowe pytanie o Twój spot eFoil ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} zadał pytanie o Twój spot ${spotName}!`,
    greeting: "Cześć!",
    bodyText: (asker, spotName) => `Dobre wieści ze społeczności! Ktoś zadał pytanie dotyczące Twojego spotu <strong>${spotName}</strong>. <strong>@${asker}</strong> pyta:`,
    ctaText: "Odpowiedz na pytanie 💬",
    fallbackText: "Jeśli przycisk nie działa, skopiuj ten link bezpośrednio do przeglądarki internetowej:",
    footerText: "Otrzymujesz tę wiadomość e-mail, ponieważ dodałeś spot eFoil na stronie <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a>, a inny użytkownik zadał pytanie."
  },
  sv: {
    subject: (spotName) => `Ny fråga om din eFoil-spot ${spotName}! 🌊`,
    preheader: (asker, spotName) => `@${asker} har ställt en fråga om din spot ${spotName}!`,
    greeting: "Hej!",
    bodyText: (asker, spotName) => `Goda nyheter från communityn! Någon har ställt en fråga om din spot <strong>${spotName}</strong>. <strong>@${asker}</strong> frågar:`,
    ctaText: "Besvara frågan 💬",
    fallbackText: "Om knappen inte fungerar, kopiera denna länk direkt till din webbläsare:",
    footerText: "Du får detta e-postmeddelande eftersom du har lagt till en eFoil-spot på <a href=\"https://www.efoilmap.com\" target=\"_blank\" style=\"color: #94a3b8; text-decoration: underline;\">efoilmap.com</a> och en annan åkare har ställt en fråga."
  }
};

export async function sendQuestionNotificationEmail({
  creatorEmail,
  askerUsername,
  spotName,
  questionText,
  spotId,
  creatorLang
}: QuestionEmailParams) {
  // Determine language, fallback to English if not found
  const langKey = EMAIL_LOCALIZATION[creatorLang] ? creatorLang : 'en';
  const local = EMAIL_LOCALIZATION[langKey];
  
  // Construct deep link to the spot question
  const deepLink = `http://localhost:3000/?spot=${spotId}&tab=questions`;
  
  const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${langKey}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${local.subject(spotName)}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 10px !important; }
      .button-wrapper { width: 100% !important; text-align: center !important; }
      .button { display: block !important; padding: 16px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #0f172a; color: #f8fafc;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${local.preheader(askerUsername, spotName)}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; table-layout: fixed;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #1e293b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <tr>
            <td height="6" style="background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);"></td>
          </tr>

          <tr>
            <td align="center" valign="top" style="padding: 40px 30px 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: rgba(56, 189, 248, 0.1); border-radius: 16px; padding: 12px; border: 1px solid rgba(56, 189, 248, 0.2);">
                    <span style="font-size: 24px; font-weight: 800; color: #38bdf8; letter-spacing: -1px; font-family: system-ui, sans-serif; display: block; line-height: 1;">⚡</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 20px 0 0 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">eFoilMap</h1>
              <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: 500; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px;">Co-Foil Coordination</p>
            </td>
          </tr>

          <tr>
            <td align="left" valign="top" style="padding: 10px 40px 30px 40px;">
              <p style="font-size: 16px; line-height: 1.6; color: #f8fafc; margin-bottom: 20px;">
                ${local.greeting}
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 25px;">
                ${local.bodyText(askerUsername, spotName)}
              </p>

              <!-- Card Event Details -->
              <table border="0" cellpadding="15" cellspacing="0" width="100%" style="background-color: rgba(255, 255, 255, 0.03); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 30px;">
                <tr>
                  <td valign="top">
                    <p style="font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Spot</p>
                    <p style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 15px 0;">📍 ${spotName}</p>
                    
                    <p style="font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">@${askerUsername}</p>
                    <p style="font-size: 14px; font-style: italic; color: #e2e8f0; margin: 0; padding-left: 10px; border-left: 2px solid #38bdf8;">
                      "${questionText}"
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button Section -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper">
                      <tr>
                        <td align="center" style="background-color: #0ea5e9; border-radius: 14px; box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -1px rgba(14, 165, 233, 0.1);">
                          <a href="${deepLink}" target="_blank" class="button" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 14px; border: 1px solid #38bdf8;">
                            ${local.ctaText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 25px;">
                <tr><td></td></tr>
              </table>

              <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; margin-bottom: 8px;">
                ${local.fallbackText}
              </p>
              <p style="font-size: 11px; line-height: 1.5; color: #38bdf8; word-break: break-all; margin-bottom: 0px;">
                <a href="${deepLink}" target="_blank" style="color: #38bdf8; text-decoration: underline;">
                  ${deepLink}
                </a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" valign="top" style="padding: 20px 40px 40px 40px; background-color: #0f172a; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="font-size: 11px; line-height: 1.6; color: #64748b; margin-bottom: 15px;">
                ${local.footerText}
              </p>
              
              <p style="font-size: 11px; line-height: 1.6; color: #64748b; margin-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">
                <strong>eFoilMap.com</strong><br />
                Angelpower UG (haftungsbeschränkt)<br />
                Belvedereallee 5, 52070 Aachen, Deutschland<br />
                Vertreten durch die Geschäftsführung: Carlo Matic<br />
                E-Mail: <a href="mailto:hi@efoilmap.com" style="color: #64748b; text-decoration: none;">hi@efoilmap.com</a>
              </p>
              
              <p style="font-size: 10px; line-height: 1.5; color: #475569; margin-top: 20px;">
                © 2026 eFoilMap. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const scratchDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    
    const filePath = path.join(scratchDir, 'last_question_notification.html');
    fs.writeFileSync(filePath, emailHtml, 'utf8');

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicFilePath = path.join(publicDir, 'last_question_notification.html');
    fs.writeFileSync(publicFilePath, emailHtml, 'utf8');

    // Print highly premium CLI announcement
    console.log(`\n\x1b[36m================== ⚡ eFoilMap EMAIL SIMULATOR ⚡ ==================\x1b[0m`);
    console.log(`\x1b[32m📧 Spot Question Notification Triggered Successfully!\x1b[0m`);
    console.log(`\x1b[37mTo:\x1b[0m \x1b[33m${creatorEmail || 'unknown@efoilmap.com'}\x1b[0m`);
    console.log(`\x1b[37mLanguage:\x1b[0m \x1b[35m${langKey.toUpperCase()}\x1b[0m`);
    console.log(`\x1b[37mSubject:\x1b[0m ${local.subject(spotName)}`);
    console.log(`\x1b[37mQuestion:\x1b[0m @${askerUsername}: "${questionText}"`);
    console.log(`\x1b[36m-----------------------------------------------------------------\x1b[0m`);
    console.log(`\x1b[35m👉 Local Browser Preview Links:\x1b[0m`);
    console.log(`\x1b[37mWeb URL:\x1b[0m \x1b[4mhttp://localhost:3000/last_question_notification.html\x1b[0m`);
    console.log(`\x1b[37mFile URL:\x1b[0m \x1b[4mfile://${filePath}\x1b[0m`);
    console.log(`\x1b[36m=================================================================\x1b[0m\n`);

  } catch (err) {
    console.error("Error writing simulated email:", err);
  }
}
