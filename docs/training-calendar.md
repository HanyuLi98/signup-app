# 2027 training calendar

The approved planning baseline is `2027_Training_Plan_CN_v1.0.docx` and `2027_Training_Plan_EN_v1.0.docx` in the Training Session Coordination folder. Dates remain proposed until confirmed for customer invitations.

## Entry points

- `/calendar`: application page, under the existing portal authentication layout.
- `/training-calendar-2027.html`: standalone, self-contained calendar; also available through the download link on `/calendar`. This static calendar contains planning information only and is publicly accessible as a static file. It contains no customer data or API credentials.
- `/` is the registration homepage, retaining the existing session cards and form. It defaults to 2027 and supports switching back to 2026. Course filters help users choose Onboarding, welding, or palletizing. The full calendar is a secondary link.
- There are 29 in-person courses open for registration. Quarterly webinars are listed separately with dates to be announced.
- In the app, calendar detail dialogs link to the corresponding registration form using `/?session=2027-MM-SESSION`. Standalone downloaded HTML remains an offline planning reference. Live availability is displayed in the registration UI, not in the static calendar.

## Single date source

The authoritative date source is `app/data/training-2027.json`. `app/lib/training-sessions.ts` derives 2027 registration identifiers, course options and schedules from it for both the UI and confirmation emails. Legacy 2026 UI sessions remain in that module with their existing identifiers.

Run `npm run calendar:sync` after editing the JSON to refresh the embedded `calendar-data` block in `public/training-calendar-2027.html`. `npm run calendar:check` verifies agreement; production builds run that check before compiling. The HTML is self-contained, with no external font, script, network or library dependency. Downloaded copies can run offline.

To revise the plan, update the JSON dates and version, then update the bilingual revision labels. The on-screen totals are derived from the date data. The current v1.1 plan has 29 in-person sessions, 71 training days and 290 participant attendances. Each in-person session currently assumes ten seats. Regenerate shared screenshots after checking the updated calendar. Keep previous distribution copies in the existing archive folder, not alongside the current version.

## v1.1 scheduling rules

- 21 three-day Onboarding sessions, Tuesday through Thursday; none in June and one in December.
- Application training takes place on the Friday after the second Onboarding of a selected month. Palletizing and welding are deliberately separated into different months. Palletizing is scheduled for January 29, April 30, August 27 and October 29. Welding is scheduled for February 26, May 28, September 24 and November 26.

- No training in June; the June 22–25 trade fair is marked as context, not as a training session.
- Training weeks are separated by at least one complete week, including across month boundaries.
- Four webinars have flexible dates. Their schedule/material/event deadlines are listed separately and are not represented as confirmed event dates. Q2 deadlines are May 10 / May 24 / May 31; Q4 is preferably held by December 15, with a December 31 deadline.
- VX500 uses recorded tutorials, not additional in-person calendar entries. Embodied AI remains unplanned pending Q2 confirmation.

## Calendar export and print

The `.ics` export contains all 29 in-person courses with stable IDs, exclusive end dates and `STATUS:TENTATIVE`. They are all-day entries; descriptions specify 09:30–17:00 Europe/Berlin. Unscheduled webinars and their planning deadlines are excluded from the export. The detail dialog also exports one course at a time.

Print / Save PDF temporarily restores all categories and planning deadlines, then restores the screen filters afterward. The print layout targets A3 landscape. The standalone HTML includes both English and Chinese; exported screenshots are language-specific.

## Registration data

Onboarding retains `S1` / `S2` within each month. The separately booked application courses use `WELDING` and `PALLETIZING`. Combined with the `YYYY-MM` month, these identify independent counts, registrations and certificate storage folders. The existing schema documents `session` as a text column; deployment should preserve support for these text values. No schema migration or production data change is included.

The API validates the 2027 course selection against the schedule, rejects cancelled June sessions, and checks ten-participant and five-company limits for open-registration courses. Availability lookups use one grouped query across known months. Database errors produce an availability error rather than appearing as zero bookings. These are application-level pre-insert checks, following the existing booking design; they do not add a database-level atomic capacity constraint.

For 2027, the form selects only the course associated with that booking. Confirmation schedules come from the same date source and omit the legacy Day 4 / half-day welding notes. The 2026 email schedule remains unchanged. Certificate downloads retain the existing `month/session` folder convention; any external certificate generation process must use the matching session identifier.

## Validation

Run `npm run test:training` for isolated API tests with mocked Supabase and email calls. They verify session mapping, confirmation dates, course separation, full sessions, company limits, removed course rejection, June rejection, database errors and legacy 2026 confirmation behavior. No real registrations or emails are produced.

Also verified with TypeScript, ESLint on modified application files and browser checks of desktop/mobile layouts, 2027 filtering and registration submission, 2026 selection, calendar-to-form navigation, all course dates and counts, quarterly frequency, June exclusion, training-week spacing, bilingual filtering and ICS parsing. Browser integration checks mock authentication and signup responses locally.

This change is local source implementation. Deployment uses the repository's normal release process; adding the calendar does not publish it automatically.



