# DATABASE CONNECTION FIX

## Correct Database Connection String:

```
postgresql://postgres.qacheypfgltcnouxokxe:EmpTrack@2024!SecureDB@qacheypfgltcnouxokxe.supabase.co:5432/postgres
```

## What to Update on Render:

1. Go to your Render dashboard
2. Find your emptrack-backend service
3. Go to "Environment" tab
4. Update DATABASE_URL to the correct string above

## The Fix:
- Changed from: `aws-0-us-east-1.pooler.supabase.co` (WRONG)
- Changed to: `qacheypfgltcnouxokxe.supabase.co` (CORRECT)

This matches your actual Supabase project ID: qacheypfgltcnouxokxe
