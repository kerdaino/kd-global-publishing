# KD Global Publishing House

Production-ready Next.js platform for KD Global Publishing House, a Christian publishing brand under KD Global.

The platform supports a public website, bookstore, author pages, publishing inquiries, sermon-to-book inquiries, physical print requests, Paystack checkout preparation, secure eBook downloads, Resend email notifications, and a protected Supabase-powered admin dashboard.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, and Storage
- Paystack payments
- Resend email

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=

RESEND_API_KEY=
ADMIN_NOTIFY_EMAIL=
RESEND_FROM_EMAIL="KD Global Publishing House <hello@example.com>"
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run [supabase/schema.sql](/supabase/schema.sql) in the Supabase SQL editor.
3. Create a Supabase Auth user for each admin.
4. Insert the admin email into `admin_users`.

Example:

```sql
insert into public.admin_users (email)
values ('admin@example.com');
```

The first successful admin login links the authenticated Supabase user ID to that admin row.

## Storage Buckets

The schema creates these buckets:

- `book-covers`: public cover images
- `sample-files`: public sample downloads
- `ebook-files`: private paid eBook files

For private eBooks, store the file path in `books.ebook_file_path`, for example:

```text
mums-first-book.pdf
```

The download page validates the token and creates a short-lived signed URL from the private `ebook-files` bucket. `ebook_file_url` remains available as a fallback for manually hosted public files.

## Payments

Paystack flow:

1. Buyer submits name, email, and optional phone from a book page.
2. `/api/paystack/initialize` creates a pending order and initializes Paystack.
3. Paystack redirects to `/checkout/success?reference=...`.
4. `/api/paystack/verify` verifies payment, marks the order paid, creates a download token, and sends emails.
5. `/api/paystack/webhook` also handles `charge.success` safely for duplicate-tolerant fulfillment.

Amount is stored in naira in Supabase and sent to Paystack in kobo.

## Email

Resend sends:

- customer eBook download confirmation
- admin order notification
- admin publishing inquiry notification
- admin sermon-to-book notification
- admin print request notification

Email failures are handled safely and should not break successful payment verification.

## Admin Dashboard

Admin routes live under `/admin`.

Protected pages:

- `/admin`
- `/admin/books`
- `/admin/orders`
- `/admin/inquiries`
- `/admin/sermon-projects`
- `/admin/print-requests`

Login:

```text
/admin/login
```

Only authenticated users whose email exists in `admin_users` can access the dashboard.

## Production Checks

Run before deployment:

```bash
npm run lint
npm run build
```

## Vercel Deployment Notes

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add all environment variables in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain, for example:

```text
https://kdglobalpublishing.com
```

5. Add the production Paystack callback URL:

```text
https://your-domain.com/checkout/success
```

6. Add the Paystack webhook URL:

```text
https://your-domain.com/api/paystack/webhook
```

7. Configure Resend sender/domain verification before using a branded `RESEND_FROM_EMAIL`.

## Important Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, callbacks, and download links |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase key for admin operations, payments, and downloads |
| `PAYSTACK_SECRET_KEY` | Server-only Paystack secret key |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Browser-safe Paystack public key for future client-side features |
| `RESEND_API_KEY` | Server-only Resend API key |
| `ADMIN_NOTIFY_EMAIL` | Email address that receives admin notifications |
| `RESEND_FROM_EMAIL` | Verified Resend sender address |

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, or `RESEND_API_KEY` to the browser.
