# Capture & Taste Landing Page

Premium landing page for the M Cafe & Grill × RL Footage collaboration.

## What is already built

- Exact original M Cafe and RL Footage logo files included as supplied.
- Responsive premium landing page.
- Package selection flow.
- Booking registration form.
- Automatic customer confirmation email.
- Automatic admin notification email with client and event details.
- Payment instructions included in the customer's confirmation email.
- Optional payment-link button.
- Ready for Vercel deployment.

## Before going live

Package 1 is now named **Capture & Taste Signature 50**, designed for approximately 50–60 guests, at **$2,800** reduced from **$4,000**.

The 100-guest and 100+ guest cards are intentionally configured as custom-rate options because their final prices were not supplied yet. Edit `index.html` once those prices are finalized.

Also review the package bullet points and replace them with the exact M Cafe menu details, RL Footage coverage hours, edited deliverables, additional-guest pricing and any add-ons you want to sell.

## Vercel setup

1. Upload this project to GitHub.
2. Import the repository into Vercel.
3. In Vercel → Project → Settings → Environment Variables, add:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `BOOKING_NOTIFY_EMAIL`
- `PAYMENT_INSTRUCTIONS`
- `PAYMENT_LINK` (optional)

Example values:

`FROM_EMAIL`
Capture & Taste <bookings@yourdomain.com>

`BOOKING_NOTIFY_EMAIL`
your-business-email@example.com

`PAYMENT_INSTRUCTIONS`
To complete your booking, please send the required booking payment using: [your payment instructions here]. Include your full name and event date in the payment memo.

`PAYMENT_LINK`
https://your-payment-link.com

4. Redeploy after adding the variables.

## Email provider

The included backend uses Resend because it is simple to connect to Vercel. You must verify the sending domain/address in Resend before production email can be delivered reliably.

## Booking behavior

When a customer submits the form:

1. Customer receives a welcome / confirmation email.
2. Email summarizes the selected package and event details.
3. Email provides your payment instructions.
4. You receive a separate new-booking email with:
   - Client name
   - Email
   - Phone
   - Package selected
   - Event date
   - Guest count
   - Event type
   - Location
   - Notes

Payment is described as the final step required to complete the reservation.


## Signature 50 package

### M Cafe & Grill — menu choice
Customer selects one catering direction:

**Pizza & Sandwich Menu**
- Pizza & sandwich mix of choice
- Salad

**Traditional Persian Menu**
- Beef Koobideh (fresh ground premium beef)
- Chicken Koobideh (fresh ground premium chicken)
- 1 choice of stew
- Rice
- Salad

### RL Footage
- Up to 4 hours premium 4K filming coverage
- 1–2 minute premium edited event highlight reel
- Access to all raw footage
- Complete premium photography
- Unlimited photo shots
- Professionally color-retouched and edited photos
- Digital download-link photo album


## Vercel 404 fix included in v3

This version removes the unnecessary local Vercel dependency, explicitly rewrites `/` to `/index.html`,
and places the two logo assets at the repository root as well as in `/public`.

After replacing the GitHub repository contents with this version, Vercel should redeploy automatically.
You can also verify `/health.txt` on the deployed domain; if that file loads, the static deployment is working.


## Vercel deployment — Vite version

This version is now a standard Vite project to avoid the prior 404 behavior.

Use these Vercel settings:
- Framework Preset: **Vite**
- Root Directory: **./**
- Build Command: **npm run build**
- Output Directory: **dist**
- Install Command: leave default

Do not upload the ZIP itself to GitHub. Upload the files and folders inside it so `index.html` and `package.json` are visible at the repository root.


## Package 2 — Signature 50 Premium Plus

Price: **$3,500**

Designed for approximately **50–60 guests**.

### M Cafe & Grill
- Beef Koobideh
- Chicken Koobideh
- 2 choices of stew
- Rice
- Beef Kabob
- Salad

### RL Footage
Same media coverage as Signature 50:
- Up to 4 hours premium 4K filming coverage
- Premium edited 1–2 minute highlight reel covering the full event
- Access to all raw footage
- Complete premium photography
- Unlimited photo shots
- Professionally color-retouched and edited photos
- Digital download-link album


## Package 3 — Signature 100

Designed for events of **up to 100 guests**.

This package uses the **same service details as Signature 50**, scaled for the larger guest count.

### M Cafe & Grill — menu choice

**Pizza & Sandwich Menu**
- Pizza & sandwich mix of choice
- Salad

**Traditional Persian Menu**
- Beef Koobideh (fresh ground premium beef)
- Chicken Koobideh (fresh ground premium chicken)
- 2 choices of stew
- Rice
- Salad

### RL Footage
- Up to 4 hours premium 4K filming coverage
- 1–2 minute premium edited event highlight reel
- Access to all raw footage
- Complete premium photography
- Unlimited photo shots
- Professionally color-retouched and edited photos
- Digital download-link album

**Price: $3,800 all-in.**
