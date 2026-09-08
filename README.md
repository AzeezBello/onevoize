# ONE VOIZE FRIENDS CLUB OF LAGOS

A full NGO website and administration platform built with Next.js, TypeScript, Tailwind CSS, ShadCN-ready UI patterns, Supabase, Paystack, Flutterwave, and Vercel.

## Organization identity

**Registered name:** ONE VOIZE FRIENDS CLUB OF LAGOS

The codebase now uses the registered organization name across the public website, admin dashboard, metadata, donation receipts, payment checkout labels, footer, and Supabase organization seed data.

The registered identity and constitution-derived organisation details are reflected in the site. Programme descriptions, biographies, campaigns, imagery, impact metrics and other editorial content remain intentionally editable through the CMS.

## Included

- Responsive public NGO website
- About, history, mission, vision, values, leadership, team, board, partners and governance
- Programs, projects and campaigns
- Campaign-specific donation pages
- Blog and events
- Volunteer and contact flows
- One-time Paystack donations
- One-time Flutterwave donations
- Server-side transaction verification
- Paystack and Flutterwave webhook verification
- Automatic campaign fundraising totals
- Donation receipts
- Donation email confirmations via Resend
- Donation reporting and CSV export
- Supabase PostgreSQL schema and RLS
- Supabase authentication
- Protected admin dashboard
- Admin CRUD for programs, projects, campaigns, blog posts, team, board and events
- Volunteer and message management
- Supabase Storage media library
- Constitution-derived organisation identity and governance seed data

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In Supabase Authentication, create the first admin user with email/password.
4. Promote the user to `super_admin` using SQL:

```sql
update public.profiles
set role = 'super_admin', full_name = 'Organization Administrator'
where id = (select id from auth.users where email = 'YOUR_ADMIN_EMAIL');
```

If the profile row does not exist, use:

```sql
insert into public.profiles (id, full_name, role)
select id, 'Organization Administrator', 'super_admin'
from auth.users
where email = 'YOUR_ADMIN_EMAIL'
on conflict (id) do update set role='super_admin';
```

## Environment variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_SECRET_HASH=
RESEND_API_KEY=
DONATION_FROM_EMAIL=
```

Never expose server-side payment keys or the Supabase service-role key to browser/client code.

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

Add all production environment variables to the Vercel project. Configure Paystack and Flutterwave webhooks to point to the corresponding `/api/payments/.../webhook` routes in the deployed application.

## Content

The site currently uses placeholders by design. Replace organization details, contact information, team/board profiles, campaigns, programs, blog posts, imagery, and impact metrics through the CMS/database as real information becomes available.

## Source-derived registration details

The current public-facing identity is based on the uploaded Certificate of Incorporation and Incorporated Trustee Constitution. The certificate records registration number **8534259**, tax identification number **33256537-0001**, incorporation on **3 June 2025**, and the registered name **ONE VOIZE FRIENDS CLUB OF LAGOS**. The constitution states that the organisation is not-for-profit and non-political, gives the registered address as **12, HOGAN BASSEY CRESCENT, SURULERE, LAGOS STATE, NIGERIA**, and sets out its aims, trustees and governing body.

The uploaded source documents should remain the authoritative records for legal details. Website copy should not be treated as a substitute for those documents.
# onevoize
