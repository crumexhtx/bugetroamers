# Planora
Trip planning and cost estimation website.

## Local development

```sh
npm install
npm run dev
```

`VITE_SITE_URL` is optional in development and defaults to
`http://localhost:5173`. Copy `.env.example` to `.env.local` when you need to
override it or configure other optional integrations.

## Production and Vercel

Production builds require `VITE_SITE_URL` so canonical URLs, Open Graph URLs,
`robots.txt`, and `sitemap.xml` point to the deployed origin.

1. Import the repository into Vercel.
2. Add `VITE_SITE_URL` in the Vercel project environment variables for
   Production (and Preview if preview builds should succeed), for example
   `https://your-project.vercel.app`.
3. Configure contact delivery:
   - `RESEND_API_KEY`: a Resend API key allowed to send from your domain.
   - `CONTACT_TO_EMAIL`: the mailbox that receives contact messages.
   - `CONTACT_FROM_EMAIL`: a sender on a domain verified in Resend, such as
     `Planora <contact@example.com>`.
4. Optionally configure Sentry:
   - `VITE_SENTRY_DSN`: the public browser DSN. When present, Sentry initializes
     with a 2% traces sample rate, no default PII, and no session replay.
   - `SENTRY_DSN`: the server DSN used for unexpected `/api/contact` failures.
     Contact field values are not attached to those reports.
5. Enable Web Analytics in the Vercel project to receive page views and custom
   events from `@vercel/analytics`.
6. Deploy. `vercel.json` runs `npm run build` and publishes `dist`; Vercel also
   deploys the TypeScript function at `/api/contact`.

Before promoting to production, open the Vercel preview URL, confirm its final
origin is configured as `VITE_SITE_URL`, verify the social preview image and
analytics events, submit the contact form, and confirm the message is actually
delivered by Resend. Check both browser and server Sentry projects for a clean
preview run.

The build prerenders every supported route, creates `dist/404.html`, and
generates `dist/robots.txt` and `dist/sitemap.xml`. Vercel serves those files
directly; there is intentionally no catch-all rewrite to `index.html`, so
unknown URLs return the real 404 document instead of a soft 404.

The contact form sends same-origin JSON to `/api/contact`. It does not store
submissions in the browser. Local `vite` development does not emulate Vercel
Functions; use `vercel dev` with the three server-side contact variables when
testing end-to-end email delivery locally.

Custom analytics cover destination selection and estimate engagement, currency
converter use, and contact submission outcomes. Events contain only coarse
interaction metadata such as destination IDs, currency codes, status codes, and
planner mode. Names, email addresses, message contents, exact budgets, converted
amounts, and expense details are not sent.

To verify a production build locally in PowerShell:

```powershell
$env:VITE_SITE_URL='https://planora-test.vercel.app'; npm run build
```
