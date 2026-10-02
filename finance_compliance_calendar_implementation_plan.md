# 📑 Implementation Plan: Single-Table JSON Architecture for Finance Compliance

---

## 1. Why the Single-Table Architecture is Ideal for Your Use Case

For your scale (a few companies, each with 30–40 compliance rows), storing the entire company workspace inside **one single table** using PostgreSQL `JSONB` columns offers significant benefits:

| Multi-Table Approach (4–5 Tables) | Single-Table JSONB Approach (`finance_compliance`) |
| :--- | :--- |
| Requires 4–5 migrations, foreign keys, and complex SQL joins | **1 single clean table** (`finance_compliance`) |
| Slower queries with multiple network roundtrips | **1 instant query** loads company, people, calendar, and logs atomically |
| Harder to migrate, backup, or copy | **100% portable** JSON structure (easy backup, export, import) |
| Adding new custom fields requires `ALTER TABLE` migrations | **Zero migration overhead** for future extensions |

---

## 2. The Unified Single-Table Schema: `finance_compliance`

```sql
CREATE TABLE IF NOT EXISTS public.finance_compliance (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name      TEXT NOT NULL,
  industry          TEXT,
  pan_number        TEXT,
  gstin             TEXT,
  cin_number        TEXT,
  address           TEXT,
  website           TEXT,
  
  -- 1. Company People / Members (JSONB Array)
  persons           JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- 2. Compliance Items Master Rules (JSONB Array)
  compliance_items  JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- 3. Monthly Execution Entries (JSONB Map keyed by "year_month")
  monthly_entries   JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- 4. Email Dispatch History (JSONB Array)
  email_logs        JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. JSON Data Structure Example (Single Row)

A single row in `finance_compliance` represents the complete company record:

```json
{
  "id": "c1f7a240-5b8e-4a67-90f1-1a2b3c4d5e6f",
  "company_name": "SC&H INDIA PVT. LTD.",
  "industry": "Corporate Consulting & Tax Advisory",
  "pan_number": "AAACS1234F",
  "gstin": "07AAACS1234F1Z5",
  "cin_number": "U74140DL2020PTC367890",
  "address": "DLF Cyber City, Tower B, Gurugram",

  "persons": [
    {
      "id": "p-1",
      "name": "Dave Smith",
      "designation": "Finance Controller",
      "email": "dave@schindia.com",
      "phone": "+91 98765 43210",
      "is_primary": true
    },
    {
      "id": "p-2",
      "name": "Aanchal Verma",
      "designation": "Tax Manager",
      "email": "aanchal@schindia.com",
      "phone": "+91 98111 22334",
      "is_primary": false
    }
  ],

  "compliance_items": [
    {
      "id": "item-1",
      "s_no": 1,
      "compliance_nature": "TDS - Salary Payments",
      "frequency": "Monthly",
      "statutory_due_date": "7th of following month",
      "internal_control_due_date": "1st of following month"
    },
    {
      "id": "item-2",
      "s_no": 2,
      "compliance_nature": "GST Return \"3B\"",
      "frequency": "Monthly",
      "statutory_due_date": "20th of following month",
      "internal_control_due_date": "18th of following month"
    }
  ],

  "monthly_entries": {
    "2026_9": {
      "item-1": {
        "actual_payment_date": "Wednesday, September 02, 2026",
        "status": "Completed",
        "remarks": "Paid on time"
      },
      "item-2": {
        "actual_payment_date": "Thursday, September 17, 2026",
        "status": "Completed",
        "remarks": "Filed 3B"
      }
    }
  },

  "email_logs": [
    {
      "id": "log-1",
      "sent_at": "2026-09-30T10:00:00Z",
      "recipient_email": "dave@schindia.com",
      "recipient_name": "Dave Smith",
      "subject": "Statutory Compliance Calendar - SC&H INDIA PVT. LTD. (Sep'26)",
      "status": "sent",
      "items_count": 30,
      "completed_count": 16
    }
  ]
}
```

---

## 4. How It Works with the UI & API

1. **Company List / Hub (`/other-modules/finance`)**:
   - `SELECT id, company_name, industry, pan_number, gstin, persons, compliance_items, monthly_entries FROM finance_compliance`
   - Shows company cards with live progress bars computed instantly from JSON.
2. **Company Workspace & Calendar (`/other-modules/finance/compliance-calendar?companyId=...`)**:
   - Fetches the single company row by ID.
   - The UI immediately has the Company Profile, People list, Compliance Items, and active month entries.
3. **Instant Live Updates (Inline Editing)**:
   - When a user changes a status to **Completed** (Green) or edits remarks, the frontend sends the updated `monthly_entries` key to `/api/finance/compliance` to save instantly.
4. **Email Dispatch**:
   - Reads the recipients from `persons`, reads the period from `monthly_entries["2026_9"]`, generates the HTML report, and appends the record into `email_logs`.

---

## 5. Execution Steps

1. **Migration**: Update [20260930000000_create_finance_compliance_calendar.sql](file:///Users/anshu/Desktop/Universe%20one%20Bnc/supabase/migrations/20260930000000_create_finance_compliance_calendar.sql) with the single `finance_compliance` table.
2. **Consolidated API Route**: Create `/api/finance/compliance/route.js` and `/api/finance/compliance/[id]/route.js` supporting CRUD on the single table.
3. **Frontend Integration**: Hook `/other-modules/finance` and `/other-modules/finance/compliance-calendar` directly to this unified single-table API.
