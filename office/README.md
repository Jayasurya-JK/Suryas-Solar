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
| `admin-role.sql` | The `admin` role (same powers as the owner) and the guard that protects the owner account |
| `activity-viewers.sql` | Who exactly may read the activity history (`profiles.sees_activity`), and the final `guard_owner_row` |
| `profile-and-pin.sql` | Own-name editing and the PIN functions (`set_my_pin`, `reset_member_pin`) |

All four are already applied to the live project (6 Nov 2026). They are repeatable, so they stay here as the
setup scripts for a fresh project. Run them in that order.

### Sign-ups only work if "Confirm email" is off

Staff request access with a User ID, which becomes a hidden address on the business Gmail. If Supabase has
**Authentication -> Sign In / Providers -> Email -> Confirm email** switched on, sign-up returns no session
and the person is stuck on "sign-in is not switched on yet". Switch it off, or confirm each account by hand
in Authentication -> Users.

It is currently **off**, which is what this flow needs. If it is ever turned back on, every access request
also sends a confirmation email - and the free plan only allows a couple of those per hour.

The business Gmail (`STAFF_MAIL` in `src/lib/format.js`) must be a real inbox, or staff can never reset a
password.

### Creating a person without sending them an email

Insert the `auth.users` row with `extensions.crypt(password, extensions.gen_salt('bf'))`, add a matching
`auth.identities` row (provider `email`), set `email_confirmed_at`, then set their role in `public.profiles`.
Without the identity row and the confirmation date they cannot sign in.

## Roles

- **Owner** - the one account that can never be locked out. Sees everything, approves new people.
- **Admin** - every owner power in the app, including making another person an admin. Cannot change or
  switch off the owner account, cannot remove another admin, and cannot see the activity history unless the
  owner grants it.
- **Staff** - sees only the screens ticked for them (Leads, Quotes, Expenses), and only their own records.
- **Pending** - someone who tapped "Request access" on the sign-in page. They see a waiting screen that
  opens by itself once an admin approves. Pending people get nothing until then.

The activity history is narrower than the owner role. Only people with `sees_activity = true` on their
`profiles` row can open it - the owner always does, and the owner switches it on or off for anyone else in
Settings > Team > Manage. Everyone else, admins included, does not see the Activity screen, the per-lead
and per-quote history, or the "see what X did" link.

The flag is guarded by `private.guard_owner_row`: an admin who calls the API directly is rejected with
"Only the owner can change who sees the activity history".

Staff sign in with a User ID instead of an email. The User ID is mapped to a hidden plus-address on the
business Gmail (`STAFF_MAIL` in `src/lib/format.js`), because the domain has no mailboxes.

## Staying signed in

A person stays signed in until they tap Sign out. The **browser** client is the only thing that refreshes the
session; `middleware.js` just checks that the auth cookie exists and never calls Supabase. Do not add a
server-side `getUser()` there again - the server and the browser then refresh the same refresh token at the
same time, the token rotates, one of them ends up holding a dead token, and people get thrown back to the
login screen. That is exactly what was happening before.

`AppShell` calls `sb.auth.getSession()` once per load. It refreshes the token if it has expired, which is the
one and only refresh point in the app.

## Profile and the sign-in PIN

`/profile` - reached by tapping your name in the sidebar, or your photo in the phone header - lets a person
change **their own name** and set a **PIN**. The role is shown but not editable; only the owner or an admin
changes roles.

The PIN is not a second password kept on the side: `public.set_my_pin()` writes a fresh bcrypt hash into
`auth.users.encrypted_password`, so the PIN *is* the password from then on. Signing in with the User ID and
the 4 to 6 digit PIN is a normal Supabase password login, so nothing about the session changes. Forgot it?
The owner or an admin sets a new one in Settings > Team > Manage (`public.reset_member_pin`).

Both functions are `SECURITY DEFINER` and granted to `authenticated` only, so no service-role key is needed
anywhere in the app. An admin cannot reset the owner's PIN; only the owner can.

A 4 digit PIN is weaker than a password, so treat it as one: the login is rate limited by Supabase per IP,
and the real protection is still the database rules.

## Installing on a phone (no Play Store)

The app is an installable PWA: `app/manifest.js` (name, icons 192/512, `display: standalone`), a minimal
`public/sw.js` service worker, an offline page, and an "Install on this phone" strip that appears in the app
when Chrome says it can install.

To install on Android: open **https://app.suryassolar.com in Chrome** (not the browser inside WhatsApp or
Instagram - those cannot install), sign in, then tap the Install strip, or Chrome's menu -> **Install app**
(older Chrome: **Add to Home screen**). If the strip is not there on the first visit, pull to refresh once -
Chrome needs the service worker active before it offers the install.

The service worker deliberately caches **nothing** except `offline.html`. The app ships several times a day
and a stale cache would show people an old screen with no obvious way out.

iOS has no install prompt; use Safari's Share -> **Add to Home Screen** (the app shows that hint instead).

## Activity history

`/activity` (owner plus anyone the owner has granted it to) lists every change with the field-by-field
differences, grouped by day, and can be filtered by type, by person (from Settings > Team) or by search.
Each lead and quote also shows its own history at the bottom, for the same people only.

Row level security on `activity_log` uses `private.can_see_activity()`, so the restriction holds in the
database too - a hidden screen is not the only thing stopping someone.

Writes are recorded by database triggers (`private.log_change`), so they are captured even if a change is
made outside the app. Things that change no row - sign-in, PDF download, WhatsApp send, bill photo view -
are recorded by the app calling `log_event`.

## Before pushing

```bash
npm run lint
npm run build
```
