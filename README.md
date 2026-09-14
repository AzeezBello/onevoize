# ONE VOIZE FRIENDS CLUB OF LAGOS

A public NGO website built with Next.js, TypeScript, Tailwind CSS, Paystack, Flutterwave, and Vercel.

## Organization identity

**Registered name:** ONE VOIZE FRIENDS CLUB OF LAGOS

The codebase uses the registered organization name across the public website, metadata, payment checkout labels, footer, and governance content.

The registered identity and constitution-derived organisation details are reflected in the site. Programme descriptions, biographies, campaigns, imagery, impact metrics and other editorial content can be updated in the source files.

## Included

- Responsive public NGO website
- About, history, mission, vision, values, leadership, team, board, partners and governance
- Programs, projects and campaigns
- Campaign-specific donation pages
- Gallery, events and membership form
- Volunteer and contact flows
- One-time Paystack donations
- One-time Flutterwave donations
- Server-side transaction verification
- Paystack and Flutterwave webhook verification
- Automatic campaign fundraising totals
- Mailto-based membership, volunteer and contact forms
- Constitution-derived organisation identity and governance seed data

## Environment variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_SECRET_HASH=
```

## Run locally

```bash
npm install
npm run dev
```

For production verification:

```bash
npm run build
npm start
```

## Deploy to Vercel

Add the payment and site URL environment variables to the Vercel project. Configure Paystack and Flutterwave webhooks to point to the corresponding `/api/payments/.../webhook` routes in the deployed application.

## Content

The site currently uses some placeholders by design. Replace organization details, contact information, campaigns, programs, imagery, and impact metrics in the source files as real information becomes available.

## Source-derived registration details

The current public-facing identity is based on the uploaded Certificate of Incorporation and Incorporated Trustee Constitution. The certificate records registration number **8534259**, tax identification number **33256537-0001**, incorporation on **3 June 2025**, and the registered name **ONE VOIZE FRIENDS CLUB OF LAGOS**. The constitution states that the organisation is not-for-profit and non-political, gives the registered address as **12, HOGAN BASSEY CRESCENT, SURULERE, LAGOS STATE, NIGERIA**, and sets out its aims, trustees and governing body.

The uploaded source documents should remain the authoritative records for legal details. Website copy should not be treated as a substitute for those documents.
# onevoize
