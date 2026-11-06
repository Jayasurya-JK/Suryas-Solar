# Surya's Solar Office

Internal app for the Surya's Solar team: leads, quotations, expenses and team access.
Separate from the public website in `../Web`. Deployed at `app.suryassolar.com`.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env.local` needs two public values (safe in the browser - security comes from the database rules):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Preview without logging in

```bash
NEXT_PUBLIC_DEMO=1 npm run dev
```

`src/lib/demo.js` stands in for Supabase with sample data. Add `NEXT_PUBLIC_DEMO_ROLE` to check a role:
`owner` (default), `staff`, `pending` or `declined`. Never set these on Vercel.

## Database

Supabase. Run each SQL file in `supabase/` **once**, in order, in the Supabase SQL editor.
They only add things and replace the access rules - no table, row or file is deleted.

| File | What it does |
| --- | --- |
| `staff-access-and-activity.sql` | User IDs, per-screen access, owner approval, "last active", and the activity history |

This one is already applied to the live project (6 Nov 2026). It is repeatable, so it stays here as the
setup script for a fresh project.

### Sign-ups only work if "Confirm email" is off

Staff request access with a User ID, which becomes a hidden address on the business Gmail. If Supabase has
**Authentication -> Sign In / Providers -> Email -> Confirm email** switched on, sign-up returns no session
and the person is stuck on "sign-in is not switched on yet". Switch it off, or confirm each account by hand
in Authentication -> Users.

The business Gmail (`STAFF_MAIL` in `src/lib/format.js`) must be a real inbox, or staff can never reset a
password.

## Roles

- **Owner** - sees everything, approves new people, reads the activity history.
- **Staff** - sees only the screens ticked for them (Leads, Quotes, Expenses), and only their own records.
- **Pending** - someone who tapped "Request access" on the sign-in page. They see a waiting screen that
  opens by itself once the owner approves. Pending people get nothing until then.

Staff sign in with a User ID instead of an email. The User ID is mapped to a hidden plus-address on the
business Gmail (`STAFF_MAIL` in `src/lib/format.js`), because the domain has no mailboxes.

## Activity history

`/activity` (owner only) lists every change with the field-by-field differences, grouped by day, and can be
filtered by type, by person (from Settings > Team) or by search. Each lead and quote also shows its own
history at the bottom.

Writes are recorded by database triggers (`private.log_change`), so they are captured even if a change is
made outside the app. Things that change no row - sign-in, PDF download, WhatsApp send, bill photo view -
are recorded by the app calling `log_event`.

## Before pushing

```bash
npm run lint
npm run build
```
