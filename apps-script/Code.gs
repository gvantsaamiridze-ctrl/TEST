/**
 * US Bookkeeping test — certificate mailer.
 *
 * Deploy as a web app:
 *   1. Open https://script.google.com → New project → paste this file as Code.gs
 *   2. Deploy → New deployment → type: Web app
 *      Execute as: Me   |   Who has access: Anyone
 *   3. Copy the Web app URL into index.html → CONFIG.certEndpoint
 *
 * The page POSTs a JSON body: { name, email, score, date, certId, instructor, testName }.
 * The score is reported by the browser, so this only checks that it is a passing score.
 * Gmail limits apply (about 100 emails/day for a free Google account).
 */

const PASSING_SCORE = 70;
const MAIL_SUBJECT = "Your US Bookkeeping test certificate";

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const name = String(d.name || "").trim().slice(0, 80);
    const email = String(d.email || "").trim();
    const score = Number(d.score);
    const date = String(d.date || "").slice(0, 40);
    const certId = String(d.certId || "").slice(0, 40);
    const instructor = String(d.instructor || "").slice(0, 80);
    const testName = String(d.testName || "US Bookkeeping test").slice(0, 80);

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json_({ ok: false, error: "invalid input" });
    if (!(score >= PASSING_SCORE && score <= 100)) return json_({ ok: false, error: "not a passing score" });

    const html = certificateHtml_({ name, score, date, certId, instructor, testName });
    const pdf = HtmlService.createHtmlOutput(html)
      .setWidth(1000)
      .setHeight(700)
      .getAs(MimeType.PDF)
      .setName("Certificate - " + name.replace(/[\\/:*?"<>|]/g, "") + ".pdf");

    MailApp.sendEmail({
      to: email,
      subject: MAIL_SUBJECT,
      body:
        "Dear " + name + ",\n\n" +
        "Congratulations on passing the " + testName + " with a score of " + score + "%.\n" +
        "Your certificate is attached as a PDF.\n\n" +
        "Certificate ID: " + certId + "\n" +
        "Date: " + date + "\n\n" +
        "Instructor: " + instructor,
      htmlBody:
        "<p>Dear " + escapeHtml_(name) + ",</p>" +
        "<p>Congratulations on passing the <strong>" + escapeHtml_(testName) + "</strong> with a score of <strong>" + score + "%</strong>.</p>" +
        "<p>Your certificate is attached as a PDF.</p>" +
        "<p>Certificate ID: " + escapeHtml_(certId) + "<br>Date: " + escapeHtml_(date) + "<br>Instructor: " + escapeHtml_(instructor) + "</p>",
      attachments: [pdf]
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml_(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function certificateHtml_(c) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: A4 landscape; margin: 0; }
    body { margin: 0; font-family: Georgia, "Times New Roman", serif; background: #fff; }
    .cert { box-sizing: border-box; width: 960px; height: 640px; margin: 20px auto; padding: 48px 56px;
            border: 8px double #b8902f; background: #fffdf5; text-align: center; color: #1f2937; }
    .kicker { letter-spacing: .25em; text-transform: uppercase; font-size: 13px; color: #8a6d1f; }
    h1 { font-size: 40px; margin: 14px 0 6px; font-weight: normal; }
    .name { font-size: 40px; font-style: italic; border-bottom: 2px solid #8a6d1f; display: inline-block;
            padding: 0 30px 6px; margin: 18px 0 22px; min-width: 420px; }
    .body { font-size: 18px; color: #374151; max-width: 680px; margin: 0 auto; line-height: 1.5; }
    .stamp { display: inline-block; margin: 22px 0 0; border: 3px solid #217346; color: #217346; font-weight: 800;
             letter-spacing: .2em; padding: 6px 18px; border-radius: 8px; transform: rotate(-4deg); font-family: Arial, sans-serif; }
    .meta { display: flex; justify-content: space-between; margin-top: 34px; font-family: Arial, sans-serif; font-size: 14px; color: #374151; }
  </style></head><body>
  <div class="cert">
    <div class="kicker">Certificate of Completion</div>
    <h1>Professional Certification</h1>
    <div class="kicker">${escapeHtml_(c.testName)}</div>
    <p class="body" style="margin-top:22px">This certifies that</p>
    <div class="name">${escapeHtml_(c.name)}</div>
    <p class="body">has successfully completed the ${escapeHtml_(c.testName)} with a score of
      <strong>${c.score}%</strong>, meeting the passing criteria (${PASSING_SCORE}%).</p>
    <div class="stamp">CERTIFIED</div>
    <div class="meta">
      <div>Date: <strong>${escapeHtml_(c.date)}</strong></div>
      <div>Certificate ID: <strong>${escapeHtml_(c.certId)}</strong></div>
      <div>Instructor: <strong>${escapeHtml_(c.instructor)}</strong></div>
    </div>
  </div></body></html>`;
}
