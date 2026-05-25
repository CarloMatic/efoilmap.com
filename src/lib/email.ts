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
