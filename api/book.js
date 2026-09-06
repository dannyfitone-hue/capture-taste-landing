const { Resend } = require("resend");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    package: selectedPackage,
    firstName,
    lastName,
    email,
    phone,
    eventDate,
    guestCount,
    eventType,
    location,
    notes
  } = req.body || {};

  if (!selectedPackage || !firstName || !lastName || !email || !phone || !eventDate || !guestCount || !eventType || !location) {
    return res.status(400).json({ error: "Please complete all required fields." });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;
  const paymentInstructions = process.env.PAYMENT_INSTRUCTIONS || "Reply to this email for payment instructions.";
  const paymentLink = process.env.PAYMENT_LINK || "";

  if (!resendKey || !fromEmail || !notifyEmail) {
    return res.status(500).json({ error: "Email service is not configured yet." });
  }

  const resend = new Resend(resendKey);
  const fullName = `${firstName} ${lastName}`;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;background:#0b0d0e;color:#f7f7f4;padding:32px">
      <div style="max-width:640px;margin:auto;background:#141819;border:1px solid #2a3032;border-radius:18px;padding:28px">
        <div style="font-size:12px;letter-spacing:2px;color:#f6bc20;font-weight:bold">CAPTURE & TASTE</div>
        <h1 style="font-size:30px;margin:10px 0 6px">Welcome, ${escapeHtml(firstName)}.</h1>
        <p style="color:#c4c7c7">We received your booking registration for <strong>${escapeHtml(selectedPackage)}</strong>.</p>

        <div style="margin:24px 0;padding:18px;border-radius:14px;background:#0b0e0f">
          <p><strong>Event date:</strong> ${escapeHtml(eventDate)}</p>
          <p><strong>Guest count:</strong> ${escapeHtml(String(guestCount))}</p>
          <p><strong>Event type:</strong> ${escapeHtml(eventType)}</p>
          <p><strong>Location:</strong> ${escapeHtml(location)}</p>
        </div>

        <h2 style="font-size:20px">Complete your booking</h2>
        <p style="color:#c4c7c7">Your reservation is completed only after the required booking payment is made.</p>
        <div style="white-space:pre-line;background:#102116;border:1px solid #244b30;border-radius:14px;padding:18px;color:#dff7e4">${escapeHtml(paymentInstructions)}</div>
        ${paymentLink ? `<p style="margin-top:18px"><a href="${escapeAttr(paymentLink)}" style="display:inline-block;background:#f6bc20;color:#111;text-decoration:none;font-weight:bold;padding:14px 20px;border-radius:999px">Make Booking Payment</a></p>` : ""}

        <p style="margin-top:24px;color:#8f9697;font-size:13px">After payment, keep your payment confirmation. Our team will match it to this booking registration.</p>
        <p style="margin-top:28px">Thank you,<br><strong>M Cafe & Grill × RL Footage</strong><br>Capture & Taste</p>
      </div>
    </div>`;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;color:#111;padding:20px">
      <h1>New Capture & Taste Booking</h1>
      <p><strong>Package:</strong> ${escapeHtml(selectedPackage)}</p>
      <p><strong>Client:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Event date:</strong> ${escapeHtml(eventDate)}</p>
      <p><strong>Guest count:</strong> ${escapeHtml(String(guestCount))}</p>
      <p><strong>Event type:</strong> ${escapeHtml(eventType)}</p>
      <p><strong>Location:</strong> ${escapeHtml(location)}</p>
      <p><strong>Notes:</strong><br>${escapeHtml(notes || "None")}</p>
    </div>`;

  try {
    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Capture & Taste Booking Confirmation — ${selectedPackage}`,
        html: customerHtml
      }),
      resend.emails.send({
        from: fromEmail,
        to: notifyEmail,
        replyTo: email,
        subject: `NEW BOOKING: ${selectedPackage} — ${fullName}`,
        html: adminHtml
      })
    ]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Booking was received, but the email could not be sent. Please contact us directly." });
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeAttr(value) {
  return escapeHtml(value);
}
