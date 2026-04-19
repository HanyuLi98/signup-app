@AGENTS.md

# RegisterWeb — Dobot Europe Training Registration System

## Project Purpose
A full-stack training registration and certificate management web app for Dobot Europe GmbH.
Participants register for CRA robotic training sessions (May–December 2026), receive confirmation emails, and download PDF certificates after training.

## Tech Stack
- **Framework:** Next.js (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 + PostCSS
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage (bucket: `certificates`)
- **Email:** Brevo via `@getbrevo/brevo` SDK
- **Certificate generation:** Python script (`../cert_tool/gen_cert.py`) using python-pptx + LibreOffice headless

## Key Files
| File | Role |
|------|------|
| `app/page.tsx` | Main UI: session grid, registration form, certificate modal |
| `app/api/signup/route.ts` | Registration submission, session capacity queries |
| `app/api/certificates/route.ts` | Password-protected certificate URL generation |
| `app/layout.tsx` | Root layout with Geist font |
| `.env.local` | Supabase keys + Brevo API key (never commit) |

## Directory Structure
```
signup-app/
├── app/
│   ├── page.tsx                  # Main client component
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── signup/route.ts
│       └── certificates/route.ts
├── public/
│   └── Background_EMEA.png
└── .env.local                    # Secret keys
```

## Database Schema
**Table: `signups`**
```
month             TEXT   -- e.g. "2026-05"
session           TEXT   -- "S1" or "S2"
company_name      TEXT
country_region    TEXT
name              TEXT
job_title         TEXT
job_responsibilities TEXT
training_sessions TEXT   -- comma-separated list
email             TEXT
telephone         TEXT
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/signup` | Submit registration; sends confirmation email; rejects duplicates and full sessions |
| GET | `/api/signup` | Without params: all session counts. With `?month=&session=`: specific session count + registrant list |
| POST | `/api/certificates` | Validates password, returns signed PDF URLs (1-hour expiry) |

## Business Rules
- Max **10 participants** per session
- Duplicate email per session is rejected
- Certificate download password: `DOBOTEMEA`
- Training sessions: 16 total — May through December 2026, 2 per month (S1/S2)
- Daily schedule: 09:30–12:00, 13:00–17:00
- Training address: Dobot Europe GmbH, Werner-Heisenberg-Str. 2A, 63263 Neu-Isenburg, Germany

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BREVO_API_KEY=
```

## Certificate Generation (offline tool)
Run `../cert_tool/gen_cert.py` manually after training to:
1. Fetch all signups from Supabase
2. Generate PDFs from PPTX template using LibreOffice headless
3. Upload to Supabase Storage at path: `certificates/{month}/{session}/{name}.pdf`
- Cert number format: `EMEA{YYMM}S{n}-{index:02d}` (e.g. `EMEA2605S1-01`)

## Development
```bash
npm run dev    # Start dev server at http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

## Contact
- Developer: @ikun
- Contact: hanyu.li@dobot-global.com
- Company: Dobot Europe GmbH
