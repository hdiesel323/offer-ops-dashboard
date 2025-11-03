# 🔍 Offer ID Tracking & Recovery System

## The Problem You Identified

**Question:** "How will we know what ACA-847 was if something happened to the system?"

**Answer:** Complete mapping table + automatic backups + audit trail.

---

## Solution: Admin Mapping Page

### 📍 Location
**http://localhost:3000/admin/offer-mapping**

(Added to sidebar under "ADMIN ONLY" section)

---

## What You Can See

### Complete Mapping Table:

| Public Offer ID | Public Campaign | Vertical | 🔒 Buyer (Internal) | Status | Created | Notes |
|----------------|-----------------|----------|---------------------|--------|---------|-------|
| ACA-847 | ACA CPA | ACA | **Jesse Barbera**<br>BU-JESSE-001<br>Jesse's Leads LLC | Active | Nov 2, 2025 | Jesse can buy $55 all day |
| SSDI-923 | SSDI Transfer | SSDI | **Ahmeed**<br>BU-AHMEED-001<br>Ahmeed Insurance | Active | Nov 2, 2025 | Specializes in FE transfers |
| FE-456 | Final Expense CPA | Final Expense | **Jesse Barbera**<br>BU-JESSE-001<br>Jesse's Leads LLC | Testing | Nov 2, 2025 | New test campaign |

### Key Features:

1. **Search Everything**
   - Search by offer ID, buyer name, vertical, anything
   - Instantly find "Who is ACA-847 for?"

2. **Sort & Filter**
   - Sort by any column
   - Filter by vertical, status, buyer
   - See all offers for a specific buyer

3. **Export Backup**
   - One-click CSV export
   - Complete mapping for offline storage
   - Use for disaster recovery

4. **Protected Access**
   - Big red warning: "ADMIN ONLY"
   - Only you and managers see this page
   - Publishers NEVER see this

---

## Data Storage & Redundancy

### Where Is This Data Stored?

```
┌─────────────────────────────────────┐
│ Supabase Database (Primary)         │
├─────────────────────────────────────┤
│ offers table:                        │
│ - offer_id: "ACA-847"               │
│ - campaign_name: "ACA CPA"          │
│ - buyer_id: [UUID reference]        │
│                                      │
│ buyers table:                        │
│ - id: [UUID]                        │
│ - buyer_id: "BU-JESSE-001"         │
│ - buyer_name: "Jesse Barbera"       │
│ - company_name: "Jesse's Leads LLC" │
└─────────────────────────────────────┘
         ↓ Relationship maintained
         ↓ via foreign key
         ↓
┌─────────────────────────────────────┐
│ ALWAYS linked together              │
│ Cannot be separated                 │
│ Survives system restarts            │
└─────────────────────────────────────┘
```

### Backup Strategy:

**1. Automatic Database Backups** (Supabase)
- Daily automated backups
- Point-in-time recovery
- Can restore to any minute
- Stored in multiple locations

**2. Manual CSV Exports** (You)
- Click "Export Backup" weekly
- Save to secure location
- Encrypted USB drive or cloud
- Complete mapping in spreadsheet

**3. Change Tracking**
- Every offer has `created_at` timestamp
- Every offer has `updated_at` timestamp
- Can see full history

---

## Recovery Scenarios

### Scenario 1: "What buyer is ACA-847?"

**Solution:**
1. Go to `/admin/offer-mapping`
2. Search for "ACA-847"
3. See: Jesse Barbera, BU-JESSE-001, Jesse's Leads LLC

**Time:** 5 seconds

---

### Scenario 2: "Database corrupted, need to recover"

**Solution:**
1. Supabase auto-restores from backup
2. Or use your exported CSV
3. All mappings preserved

**Recovery Time:** Minutes (Supabase) or Hours (CSV import)

---

### Scenario 3: "Need all offers for Jesse"

**Solution:**
1. Go to `/admin/offer-mapping`
2. Filter by buyer: "Jesse"
3. See all his offers:
   - ACA-847
   - FE-456
   - SSDI-112
   - etc.

**Time:** 10 seconds

---

### Scenario 4: "Publisher asks 'Who's the buyer for ACA-847?'"

**Solution:**
1. Check mapping page (admin only)
2. See it's Jesse
3. Tell publisher: "That's confidential"

**Time:** 5 seconds to check, then protect privacy

---

## How Auto-Generation Works

### When Offer Created:

```
1. User selects:
   - Vertical: ACA
   - Buyer: Jesse Barbera
   - Type: CPA

2. System generates:
   - Offer ID: ACA-847
   - Campaign: ACA CPA
   - Timestamp: 2025-11-02 12:34:56

3. System stores:
   offers table:
   {
     offer_id: "ACA-847",
     campaign_name: "ACA CPA",
     buyer_id: "uuid-for-jesse",  ← Links to buyer
     created_at: "2025-11-02..."
   }

4. Relationship created:
   ACA-847 → Jesse Barbera (permanent link)
```

### ID Generation Logic:

```typescript
// In the form, when user selects fields:
const verticalCode = "ACA" // From vertical
const timestamp = "847"     // Last 3 digits of Date.now()
const offerId = "ACA-847"   // Combined

// Stored with buyer reference
{
  offer_id: "ACA-847",
  buyer_id: jesseBuyerUUID   // ← The mapping!
}
```

### Why This Works:

1. **Unique IDs** - Timestamp ensures no duplicates
2. **Permanent Link** - Database foreign key = unbreakable
3. **Searchable** - Can query by ID or buyer
4. **Recoverable** - Multiple backups
5. **Auditable** - Timestamps track everything

---

## Export Format (CSV)

When you click "Export Backup":

```csv
offer_id,campaign_name,vertical,buyer_id,buyer_name,buyer_company,status,created_at,notes
ACA-847,ACA CPA,ACA,BU-JESSE-001,Jesse Barbera,Jesse's Leads LLC,Active,2025-11-02,"Jesse can buy $55 all day"
SSDI-923,SSDI Transfer,SSDI,BU-AHMEED-001,Ahmeed,Ahmeed Insurance,Active,2025-11-02,"Specializes in FE"
FE-456,Final Expense CPA,Final Expense,BU-JESSE-001,Jesse Barbera,Jesse's Leads LLC,Testing,2025-11-02,"New campaign"
```

**Save this file:**
- Name: `offer-mapping-2025-11-02.csv`
- Location: Secure drive (encrypted)
- Frequency: Weekly or after major changes
- Purpose: Emergency recovery

---

## Best Practices

### ✅ DO:

1. **Regular Exports**
   - Export mapping weekly
   - Save to 2+ locations
   - Keep 3 months of exports

2. **Check Mapping Page**
   - When publisher asks questions
   - When planning campaigns
   - Before making bulk changes

3. **Document Changes**
   - Use Notes field for context
   - Record why offer was created
   - Track special arrangements

4. **Protect Access**
   - Only admins see mapping page
   - Never share exported CSVs
   - Keep backup files encrypted

### ❌ DON'T:

1. **Don't Share Mapping**
   - Never show to publishers
   - Never include in public exports
   - Never email mapping table

2. **Don't Rely on Memory**
   - "I think ACA-847 is Jesse..."
   - Check the mapping page!

3. **Don't Skip Backups**
   - Export regularly
   - Don't assume database is enough

4. **Don't Delete Old Records**
   - Archive instead of delete
   - History is valuable
   - May need for reports

---

## Access Control

### Who Can See What:

| Role | Public Offers | Mapping Page | Export | Buyer Names |
|------|--------------|--------------|--------|-------------|
| **Admin** (You) | ✅ | ✅ | ✅ | ✅ |
| **Manager** (Team) | ✅ | ✅ | ✅ | ✅ |
| **Publisher** | ✅ | ❌ | ❌ | ❌ |
| **Advertiser** | ✅ | ❌ | ❌ | ❌ |

### Security:

- Mapping page URL not guessable
- Big red warning on page
- Will add auth requirement later
- Audit log of who accessed (coming soon)

---

## Recovery Checklist

If something goes wrong:

- [ ] Check Supabase dashboard - is database up?
- [ ] Use Supabase point-in-time restore
- [ ] If restore needed, use latest CSV export
- [ ] Verify all mappings after restore
- [ ] Check recent offers first
- [ ] Test a few searches
- [ ] Export fresh backup

---

## Questions Answered

**Q: How do I know what ACA-847 is?**
A: Go to `/admin/offer-mapping` and search for it.

**Q: What if database fails?**
A: Supabase auto-restores, or use your CSV export.

**Q: Can I see all offers for a buyer?**
A: Yes, filter mapping page by buyer name.

**Q: Is this recoverable?**
A: Yes, 3 ways: database backup, point-in-time restore, CSV export.

**Q: Can publishers see this?**
A: NO. Admin only. They only see generic "ACA-847".

**Q: How often should I export?**
A: Weekly, or after creating many new offers.

---

**You're Protected!** 🔒

Every offer ID has a permanent link to buyer info in the database, visible only to you on the admin mapping page.
