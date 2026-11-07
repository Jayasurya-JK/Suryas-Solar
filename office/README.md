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
| `attendance.sql` | Daily attendance table, its grants and rules (staff mark today only; admins back-fill), plus the trigger that logs it |
| `entry-only.sql` | `profiles.entry_only` - staff who may add records but not see the team's, per screen |

All of them are already applied to the live project (7 Nov 2026). They are repeatable, so they stay here as the
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
- **Staff** - sees the screens ticked for them (Leads, Quotes, Expenses). Inside a screen they see the whole
  team's records, not just their own, so two people following up on the same customer are looking at the same
  list. What they may change is narrower: any lead or quote on the screens they hold, but only the expenses
  they entered themselves (for two days), and only the owner can delete.
- **Entry only** - a per-screen switch the owner can set on a staff member (Settings > Team > Manage). On that
  screen the person can add records but sees only the ones they added, so they key in leads, expenses or quotes
  without reading the team's. Their own entries stay visible so they can correct a mistake. Enforced in the
  database (`profiles.entry_only` plus `private.entry_only()`), so calling the API directly does not get around
  it, and an admin can neither set nor clear it.
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

## Attendance

Staff are asked once a day, when they open the app, to mark **Working**, **Working partially** or **Leave**
(the answer is stored per person per day in `public.attendance`). They can change it any time that day from
the Attendance tab; the ask is remembered per device per day, so it does not nag on every screen.

The owner and admins are never asked and never mark themselves - they find the screen under
**More > Attendance**, which lists the team's status for today with this month's counts. Tapping a staff
member opens a day picker for the last seven days, so an admin can fill in a day the staff member forgot or
correct a wrong tap.

Staff may only mark **today**, and only for themselves - both enforced in the database (`private.is_staff()`
plus `work_date = current_date`), not just the UI. Back-filling a past day is an admin action.

## Expenses: months, details and bills

The Expenses screen opens on the current month, so an entry dated last month can look missing. Four things
prevent that:

- An **All months** button next to the month picker shows every entry at once.
- The total card always lists the other months that hold entries ("Also recorded: October 2026 · 4"), so you
  can tap straight to them.
- The add form prints the chosen date in words, offers **Use today**, and warns "goes under October 2026"
  when the date is outside the open month. After saving it says which month the entry went into.
- Tapping an entry opens **Expense detail**: amount, date, what it was for, site, who paid, how, the note, who
  entered it and when, with the bill photo and (for the owner) delete.
- **Edit** (pencil, in the list and in the detail sheet) corrects any entry. The owner and admins can change
  every entry; a staff member can change their own. The database has the final say: an update that is not
  allowed comes back with no rows, and the sheet says so instead of failing silently.
- The same words are never printed twice for one entry: "Travel speed material" under a Material chip does
  not repeat "Material" on the line below, and the detail sheet hides the note when it is the same as what
  the entry was for. The detail sheet shows the time it was entered, so two entries with the same name on
  the same day can be told apart.

Bill photos open **inside the app** in a lightbox. They used to use `window.open`, which an installed app
blocks, so on a phone a tap on the camera did nothing at all.

Saving an expense or an edit used to confirm only inside the add panel, which on a phone is a closed sheet.
The message now sits at the top of the list, so it is always seen.

## Follow-ups

Every lead carries a **next follow-up** date. The add-lead form asks for it near the top ("When should we
call them again?") with Today, Tomorrow, In 3 days and Next week chips, so entering a lead never ends without
a call date.

On opening the app, anyone with the Leads screen sees **Follow up today** - every lead whose date has arrived,
with call and WhatsApp buttons. It is shown once a day per device (the same `localStorage` pattern as the
attendance ask) and a lead leaves the list as soon as its stage becomes Won or Lost.

## Screens each role gets

The dashboard is the owner's and admins' screen - it carries company-wide money. Staff open straight onto
their own first screen (Leads, or Expenses if that is all they have). Any address they do not hold, such as
`/dashboard` from an old shortcut, quietly redirects there instead of showing a refusal.

## Slow connections

Tapping something on a weak signal used to look like nothing happened, so people tapped again and a second
record was saved. Two changes prevent that:

- `NavProgress` (in `AppShell`) shows a thin blue bar at the top the moment an internal link or a form is
  used, and clears when the new screen renders. Sampled at 50 ms on a throttled connection: visible for the
  whole wait.
- `useOnce` (in `src/lib/useOnce.js`) wraps every save action - expense, lead, quote, package, approve, PIN,
  sign-in - so a second tap while the first is still running is ignored. Verified by triple-tapping "Create
  quote": one quote row, not three.

Every editor also updates state functionally (`setQ(cur => ...)`). Reading the previous value out of the
render closure meant one field could write a stale copy of the others back, which is how values in one box
appeared to change by themselves.

### When the connection dies mid-load

The app used to sit on a blank spinner for ever if `auth.getSession()` or the first profile query failed,
and any screen that threw showed the browser's white "Application error: a client-side exception has
occurred" page. Now:

- The boot runs its queries in one `Promise.all` (one round trip instead of six) and never renders a
  spinner without words. After 7 seconds it says the connection is slow and offers **Try again**.
- A failed boot shows a **No connection** card. It retries by itself after 2, 4, 8, 15 and 30 seconds, and
  **Try again** recovers the moment the signal is back (verified by blocking every `supabase.co` request,
  then unblocking it).
- The last good profile, settings, team and brands are kept in `sessionStorage` (`so-boot-v1`) so reopening
  the installed app paints the real screens straight away instead of a spinner. Signing out clears it.
- `app/(app)/error.jsx` catches a screen that throws and shows it in place of just that page - the sidebar
  and tabs keep working, so nobody is stuck on a dead screen.
- `app/error.jsx` and `app/global-error.jsx` cover the routes outside the shell and a failure of the root
  layout. The global one carries its own inline styles because the stylesheet may not have loaded.
- If the browser asks for a script from a build that is no longer live (`Loading chunk ... failed`, the
  usual cause of the white error page after a deploy) `watchErrors` reloads once, guarded to one reload per
  30 seconds and skipped while a screen has unsaved edits.

Crashes are written to `public.client_errors` by `src/lib/reportError.js` (kind, message, stack, page,
device, online state). **That table is created by `supabase/projects.sql`** - paste it into the Supabase SQL
editor once (see Projects below). Until then reporting fails silently and nothing else changes.

The last eight problems on a phone are also kept in its own `localStorage` (`so-errors`) and listed under
**My profile > Recent problems**, so the cause can be read on the affected phone without the database log.

## Quote extras are rupee amounts

Structure, pillars and extra floors are typed as **amounts in rupees**, each with its own box. They used to
be a count multiplied by a rate from Settings, so a digit meant as rupees ("2600") became 2600 floors and
the total jumped to ₹65 lakh. The Settings rates now only prefill a box when a structure size is chosen; the
number stays editable, and anything above ₹2,00,000 shows a red warning. Older quotes without amounts are
read from their saved rates, so their totals do not move.

## Sending a quote on WhatsApp

The WhatsApp button sends the **PDF itself**, and it opens on the customer's own number. Tapping it builds the
file, then asks how to send:

- **Chat on +91 94893 45125** - opens WhatsApp on the number saved in the quote (which comes from the lead)
  with the message ready. WhatsApp cannot take a file from a link, so the PDF is saved at the same moment and
  attached with the paperclip in the chat that opens.
- **Share the PDF file** - the phone's share sheet carries the file: pick WhatsApp, then the contact.

A desktop browser cannot share a file, so there it saves the PDF and opens WhatsApp Web on the number with the
same message. A quote with no mobile number says so, and WhatsApp asks who to send it to.

`buildQuotePdf` in `src/lib/quotePdf.js` returns the Blob so the same file can be downloaded (Save as PDF) or
shared (WhatsApp) without building it twice.

## Saving a quote as a PDF

The Save as PDF button builds a real `.pdf` file in the browser - no print dialog, so nobody has to hunt for
"Save as PDF" in a print sheet (which is what people were getting stuck on).

The A4 sheets are already laid out in the DOM, so `src/lib/quotePdf.js` photographs each `.sheet` and stacks
them into a PDF with `html2canvas-pro` + `jspdf`, both loaded on demand. The file therefore looks exactly like
the preview. It photographs a hidden full-size copy (`.pdf-source`) rather than the visible one, so it works
from any screen size without opening anything.

Preview opens the sheets full screen with - / + zoom. On a phone it deliberately starts at 80%, not "fit
width", because a whole A4 page squeezed into 390px is about 45% and unreadable.

`window.print()` remains only as a fallback (the "Print instead" button if the PDF build ever fails). While
the preview dialog is open, `body.qd-modal-open` hides the copy behind it so printing cannot produce two sets
of pages.

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

Attendance is logged by its own trigger (`private.log_attendance`, in `attendance.sql`), because it is a row
per person per day rather than an edit: "Marked Working for 07.11.2026", "Changed Manojkumar from Working to
Leave on 04.11.2026", "Cleared the attendance mark of Monisha for 06.11.2026". A save that changes nothing is
not logged, so correcting the same day twice does not fill the feed.

## Before pushing

```bash
npm run lint
npm run build
```
## Projects: the whole job, end to end

`/projects` holds every customer from the first survey to the last payment - the paper register, in the app.
One row per job, and each job carries its eleven steps, its payments and a free note.

- **Setup, once:** paste `supabase/projects.sql` into the Supabase SQL editor and press Run. It creates
  `projects`, `project_steps`, `project_payments`, `project_files` and `client_errors`, seeds the eleven
  steps for every new job, numbers jobs `SSP/0001/26`, and grants the `projects` screen to whoever is given
  it in Settings > Team. It is idempotent, so running it twice is safe.
- **Steps** are created by a trigger when the job is saved: survey, quotation, advance, material,
  installation, wiring, TNEB meter application, meter fixed, subsidy filed, subsidy received, handover.
  Ticking a step dates it and moves the job's current stage to the next open step.
- **Money** is a running ledger per job: quoted, received, balance. The advance typed on the first screen
  becomes the first ledger entry, so the balance is right from day one.
- **Paste a list** (owner) imports the register that is still on paper: one customer per line,
  `Name, Phone, Town, kW, Quoted, Advance, Start date`. No file needed.
- Permission is the same model as the other screens: the `projects` module in Settings > Team, with an
  entry-only switch for people who should only see the jobs they added.
- Until the SQL is run, the screen says so plainly instead of failing.

## Quote brandsThe partner logos offered on a quote are the ones we actually install: **Premier Energies** (default), **Tata Power Solar**, **Waaree** and **Avaada**. Adani Solar and Microtek are switched off in Settings > Brands rather than deleted, so quotes already issued still print their names.

Picking a partner writes the makes that partner is responsible for (`src/lib/makes.js`), on a new quote as well as when the partner is changed later. The strip under the logos repeats the rule and offers a one-tap "Set the usual makes" for an older quote.

Each partner's artwork lives in `public/brands/<name>.png` and `brands.logo_url` holds that path. Add a partner by dropping the file there, then setting `logo_url` on its row.

| Row | Tata Power Solar | Any other partner (Premier, Waaree, Avaada) |
| --- | --- | --- |
| Solar module | TPS | the partner chosen |
| String inverter | TPS | left as it is |
| MMS structure | TPS | JSW Galvanization |
| ACDB / DCDB | TPS | left as it is |
| DC cable | Polycab | Polycab |
| AC cable, earthing cable | Polycab | Polycab |
| Earthing kit | TPS | Pure copper rod |
| UPVC pipe | Reputed make | Reputed make |

Every row stays editable, so a customer asking for a different cable or structure is one tap away.

"Address as" prints on the name as well: **Sir** gives Mr. Vinoth Raj and "Dear Sir", **Madam** gives Mrs., **Miss** gives Miss (not every woman is a Mrs.), and **Sir/Madam** leaves the name plain so nothing is assumed. Panel warranty is **12 years product and 18 years performance**, with **1 year** free service, editable in Settings > Quote wording.
