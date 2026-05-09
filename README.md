# KD Global Publishing House

KD Global Publishing House is a Christian publishing platform built by KD Global.

Portfolio: [https://www.kdevglobal.com](https://www.kdevglobal.com)

The platform supports eBook publishing, author profiles, publishing service inquiries, sermon-to-book production, print requests, Paystack checkout, secure eBook delivery, Resend email notifications, and a private admin dashboard.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Database, Auth, and Storage
- Paystack
- Resend
- Vercel

## Core Features

- Public bookstore for published eBooks
- Book detail pages with checkout
- Author profiles with uploaded profile images
- Paystack checkout and payment verification
- Secure eBook download tokens
- Resend order and inquiry notifications
- Publishing inquiry forms
- Sermon-to-book inquiry forms
- Print request forms
- Admin dashboard for books, authors, orders, inquiries, sermon projects, and print requests

## Environment Variables

Create `.env.local` for local development and set the same values in Vercel for production.

```bash
NEXT_PUBLIC_SITE_URL=https://publishing.kdevglobal.com

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYSTACK_SECRET_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_NOTIFY_EMAIL=

NEXT_PUBLIC_CONTACT_EMAIL=
```

Only `NEXT_PUBLIC_*` values are available to browser code. Keep `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, and `RESEND_API_KEY` server-side only.

The public publishing contact phone and WhatsApp number are managed in `src/lib/site.ts` as `+2347011780857` and `https://wa.me/2347011780857`. The public email is optional and should be set with `NEXT_PUBLIC_CONTACT_EMAIL` only when an official publishing email is ready; if it is empty, the email link is hidden.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

Before deployment:

```bash
npm run lint
npm run build
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor, or apply the migration files in `supabase/migrations`.
3. Create Supabase Auth users for approved admins.
4. Add each admin email to `public.admin_users`.

```sql
insert into public.admin_users (email)
values ('admin@your-domain.com');
```

The first successful admin login links the Supabase Auth user ID to the matching admin row.

## Storage Buckets

The schema configures these buckets:

- `author-images`: public author profile images
- `book-covers`: public book cover images
- `sample-files`: public PDF samples
- `ebook-files`: private paid eBook files

Author images and book covers are served through public Supabase Storage URLs. Paid eBook files should use `books.ebook_file_path` with files stored in the private `ebook-files` bucket.

## Paystack Setup

Set `PAYSTACK_SECRET_KEY` in the server environment.

Configure Paystack with:

- Callback URL: `https://publishing.kdevglobal.com/checkout/success`
- Webhook URL: `https://publishing.kdevglobal.com/api/paystack/webhook`

Checkout flow:

1. A reader submits checkout details from a book page.
2. The app creates a pending order in Supabase.
3. Paystack collects payment.
4. The app verifies the transaction.
5. A secure download token is created for the order.
6. The reader receives the download link on the success page and by email when Resend is configured.

## Resend Setup

Set:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_NOTIFY_EMAIL`

Resend sends customer download emails and admin notifications for orders, publishing inquiries, sermon-to-book inquiries, and print requests.

## Admin Setup

Admin access is intentionally not linked from public navigation. Go directly to:

```text
/admin/login
```

Dashboard areas:

- Overview
- Books
- Authors
- Orders
- Inquiries
- Sermon Projects
- Print Requests

## Vercel Deployment

1. Import the repository into Vercel.
2. Set all production environment variables.
3. Confirm `NEXT_PUBLIC_SITE_URL` is `https://publishing.kdevglobal.com`.
4. Deploy.
5. Verify Paystack callback and webhook URLs.
6. Verify Supabase Storage upload policies for admin users.
7. Run a live checkout using the correct Paystack mode before launch.

## Launch Checklist

- Supabase schema applied
- Admin user created and added to `admin_users`
- Storage buckets available
- Published books entered with cover images and eBook file paths
- Active authors created with profile images
- Paystack secret key set for the intended environment
- Paystack callback and webhook URLs configured
- Resend sender verified
- Admin notification email set
- Public phone, WhatsApp, Lagos location, and optional publishing email confirmed
- `npm run lint` passes
- `npm run build` passes
- Public navigation has no admin links
- `/admin/login` works by direct URL
