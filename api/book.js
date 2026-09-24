const nodemailer = require("nodemailer");

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
    notes,
    consent
  } = req.body || {};

  if (!selectedPackage || !firstName || !lastName || !email || !phone || !eventDate || !guestCount || !eventType || !location) {
    return res.status(400).json({ error: "Please complete all required fields." });
  }

  const packages = new Set([
    "Capture & Taste Signature 50",
    "Capture & Taste Signature 50 Premium Plus",
    "Capture & Taste Signature 100",
    "Capture & Taste Signature 100 Premium Plus"
  ]);
  const fields = [selectedPackage, firstName, lastName, email, phone, eventDate, eventType, location];
  if (fields.some(value => typeof value !== "string" || !value.trim() || value.length > 250) ||
      !packages.has(selectedPackage) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || !Number.isInteger(Number(guestCount)) ||
      Number(guestCount) < 1 || Number(guestCount) > 10000 ||
      (notes != null && (typeof notes !== "string" || notes.length > 5000)) ||
      !["on", true].includes(consent)) {
    return res.status(400).json({ error: "Please check your event details and confirm the booking acknowledgment." });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const fromEmail = { name: "Capture & Taste | RL Footage", address: gmailUser };
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;
  const paymentInstructions = process.env.PAYMENT_INSTRUCTIONS || "Reply to this email for payment instructions.";
  const paymentLink = process.env.PAYMENT_LINK || "";

  if (!gmailUser || !gmailPassword || !notifyEmail) {
    return res.status(503).json({ error: "Online requests are temporarily unavailable. Please email rl.footage.orangecounty@gmail.com with your event details." });
  }

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: gmailPassword },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true
  });
  const fullName = `${firstName} ${lastName}`.replace(/[\r\n]+/g, " ");

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;background:#0b0d0e;color:#f7f7f4;padding:32px">
      <div style="max-width:640px;margin:auto;background:#141819;border:1px solid #2a3032;border-radius:18px;padding:28px">
        <div style="font-size:12px;letter-spacing:2px;color:#f6bc20;font-weight:bold">CAPTURE & TASTE</div>
        <h1 style="font-size:30px;margin:10px 0 6px">Welcome, ${escapeHtml(firstName)}.</h1>
        <p style="color:#c4c7c7">We received your booking registration for <strong>${escapeHtml(selectedPackage)}</strong>.</p>

        <h2 style="font-size:20px">What happens next</h2>
        <p style="color:#c4c7c7">Alexa will contact you shortly to go over your selected package and walk you through the booking process.</p>
        <p style="color:#c4c7c7">If you would prefer a specific day and time for a call, please reply to this email with your preferred date, time, and time zone.</p>

        <div style="margin:24px 0;padding:18px;border-radius:14px;background:#0b0e0f">
          <p><strong>Your phone number:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Your email:</strong> ${escapeHtml(email)}</p>
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

  const customerText = [
    `Welcome, ${firstName}.`,
    `We received your booking registration for ${selectedPackage}.`,
    "",
    "What happens next",
    "Alexa will contact you shortly to go over your selected package and walk you through the booking process.",
    "If you would prefer a specific day and time for a call, please reply to this email with your preferred date, time, and time zone.",
    "",
    `Your phone number: ${phone}`,
    `Your email: ${email}`,
    `Event date: ${eventDate}`,
    `Guest count: ${guestCount}`,
    `Event type: ${eventType}`,
    `Location: ${location}`,
    "",
    "Complete your booking",
    "Your reservation is completed only after the required booking payment is made.",
    paymentInstructions,
    ...(paymentLink ? [`Make Booking Payment: ${paymentLink}`] : []),
    "After payment, keep your payment confirmation. Our team will match it to this booking registration.",
    "",
    "Thank you,",
    "M Cafe & Grill × RL Footage",
    "Capture & Taste"
  ].join("\n");

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
    // Notify the owner first so customer-email problems cannot lose the lead.
    const notification = await transport.sendMail({
        from: fromEmail,
        to: notifyEmail,
        replyTo: email,
        subject: `NEW BOOKING: ${selectedPackage} — ${fullName}`,
        html: adminHtml,
        text: [
          "New Capture & Taste booking request",
          `Package: ${selectedPackage}`, `Client: ${fullName}`, `Email: ${email}`,
          `Phone: ${phone}`, `Event date: ${eventDate}`, `Guest count: ${guestCount}`,
          `Event type: ${eventType}`, `Location: ${location}`, `Notes: ${notes || "None"}`
        ].join("\n")
      });
    if (!notification.accepted?.some(address => address.toLowerCase() === notifyEmail.toLowerCase())) {
      console.error("Booking notification was not accepted by Gmail");
      return res.status(502).json({ error: "We could not send your request. Please try again or email rl.footage.orangecounty@gmail.com." });
    }
  } catch (error) {
    console.error("Booking notification failed", error?.name || "send_error");
    return res.status(502).json({ error: "We could not confirm your request was sent. Please email rl.footage.orangecounty@gmail.com before submitting again." });
  }

  let customerEmailSent = false;
  try {
    const confirmation = await transport.sendMail({
      from: fromEmail,
      to: email,
      replyTo: notifyEmail,
      subject: `Capture & Taste Booking Confirmation — ${selectedPackage}`,
      html: customerHtml,
      text: customerText
    });
    customerEmailSent = Boolean(confirmation.accepted?.some(address => address.toLowerCase() === email.toLowerCase()));
    if (!customerEmailSent) console.warn("Customer confirmation was not accepted by Gmail");
  } catch (error) {
    console.warn("Customer confirmation failed", error?.name || "send_error");
  }
  return res.status(200).json({ ok: true, customerEmailSent });
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
