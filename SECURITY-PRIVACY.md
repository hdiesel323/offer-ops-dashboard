# 🔒 Security & Privacy Controls

## Data Visibility by Role

### Problem
Publishers should NOT see buyer information, and vice versa. This protects your business relationships and prevents poaching.

---

## Role-Based Access Control

### **Admin** (You)
✅ Sees everything:
- All buyer information
- All publisher information
- Both pricing sides (payout + revenue)
- Profit margins
- All notes and internal details

### **Manager** (Your Team)
✅ Sees everything except:
- ⚠️ Cannot delete offers (only admins)

### **Publisher** (Traffic Sources)
✅ Can see:
- Offer ID (generic format)
- Campaign name (generic, no buyer names)
- Vertical
- Status
- Their payout rates
- Targeting requirements (states, age, etc.)

❌ CANNOT see:
- 🔒 Buyer names
- 🔒 Buyer companies
- 🔒 Advertiser pricing
- 🔒 Profit margins
- 🔒 Internal notes
- 🔒 Other publishers

### **Advertiser/Buyer** (Your Clients)
✅ Can see:
- Offer ID
- Campaign name
- Vertical
- Status
- Their pricing
- Performance data for their offers

❌ CANNOT see:
- 🔒 Publisher names
- 🔒 Publisher payouts
- 🔒 Profit margins
- 🔒 Internal notes
- 🔒 Other buyers

---

## Data Protection Implementation

### 1. Naming Convention Changed

**Before (INSECURE):**
```
Offer ID: ACA-JESSE-001
Campaign: ACA CPA - Jesse
```
→ **Problem**: Publishers can see "Jesse" is the buyer!

**After (SECURE):**
```
Offer ID: ACA-847
Campaign: ACA CPA
```
→ **Solution**: Generic names, buyer info stored internally

### 2. Field-Level Security

**Publisher View:**
```json
{
  "offer_id": "ACA-847",
  "campaign_name": "ACA CPA",
  "vertical": "ACA",
  "status": "Active",
  "publisher_payout": "$55-75",
  "buyer": "[Private]",           // 🔒 Hidden
  "advertiser_price": "[Hidden]", // 🔒 Hidden
  "notes": "[Hidden]"             // 🔒 Hidden
}
```

**Admin View:**
```json
{
  "offer_id": "ACA-847",
  "campaign_name": "ACA CPA",
  "vertical": "ACA",
  "status": "Active",
  "publisher_payout": "$55-75",
  "buyer": "Jesse Barbera",       // ✅ Visible
  "advertiser_price": "$65-85",   // ✅ Visible
  "notes": "Full internal notes"  // ✅ Visible
}
```

---

## How It Works

### Current Implementation (Phase 1)
**Status:** ⚠️ In Development

- ✅ Role definitions created (`lib/roles.ts`)
- ✅ Permission checking functions
- ✅ Data filtering utilities
- ✅ Generic naming (no buyer names in IDs)
- ⏳ Auth integration (coming next)

### Next Phase (Phase 2)
**Status:** 📋 Planned

Will implement:
1. User authentication (Supabase Auth)
2. Role assignment per user
3. Automatic data filtering based on logged-in user
4. Row-level security in Supabase
5. Audit logging (who viewed what)

---

## Testing Roles

To test different role views, change this in `lib/roles.ts`:

```typescript
// For testing only - will be replaced with real auth
export const CURRENT_USER_ROLE: UserRole = 'admin' // Change this

// Try these:
'admin'       → See everything
'manager'     → See everything except delete
'publisher'   → See limited data, no buyer info
'advertiser'  → See limited data, no publisher info
```

---

## Best Practices

### ✅ **DO:**
- Keep buyer and publisher information separate
- Use generic offer names/IDs
- Store sensitive info in notes (admin-only)
- Give each external party their own login
- Log all data access

### ❌ **DON'T:**
- Put buyer names in public-facing fields
- Share admin credentials with publishers
- Expose profit margins to anyone except admins
- Use the same login for multiple people
- Store sensitive data in unprotected fields

---

## Example Scenarios

### Scenario 1: Publisher Portal
**Publisher logs in and sees:**
```
Offers Available:
- ACA-847 | ACA CPA | $55-75 payout
- SSDI-123 | SSDI Transfer | $30 flat
```

They see their rates, but NOT who's buying the leads.

### Scenario 2: Buyer Portal
**Buyer (Jesse) logs in and sees:**
```
Your Campaigns:
- ACA-847 | ACA CPA | $65-85 pricing
- Performance: 150 leads this week
```

He sees his campaigns and pricing, but NOT who's delivering the traffic.

### Scenario 3: Admin Dashboard
**You log in and see:**
```
Full Details:
- Offer: ACA-847
- Publisher: Alpha Traffic ($55-75 payout)
- Buyer: Jesse Barbera ($65-85 revenue)
- Margin: $10 per lead
- Notes: "Jesse wants higher volume next week"
```

You see everything to manage the business.

---

## Privacy by Design

### Offer ID Format
**Public-Facing:**
```
ACA-847
SSDI-923
FE-456
```

**Internal Mapping (Admin Only):**
```
ACA-847  → Jesse Barbera buying from Alpha Traffic
SSDI-923 → Ahmeed buying from Beta Leads
FE-456   → Jesse buying from multiple sources
```

The mapping is stored in your database but only visible to admins.

---

## Future: Row-Level Security

When we implement Supabase RLS:

```sql
-- Publishers can only see offers they're assigned to
CREATE POLICY "Publishers see their offers"
  ON offers FOR SELECT
  USING (
    auth.uid() IN (
      SELECT publisher_id FROM offer_publishers
      WHERE offer_id = offers.id
    )
  );

-- Hide buyer information from publishers
CREATE POLICY "Hide buyers from publishers"
  ON offers FOR SELECT
  USING (
    CASE 
      WHEN user_role() = 'publisher' 
      THEN buyer_id IS NULL -- Force NULL for publishers
      ELSE true
    END
  );
```

---

## Questions?

**Q: Can publishers reverse-engineer who buyers are?**
A: No - offer IDs and names are generic, no buyer information exposed.

**Q: What if a publisher asks "Who's the buyer?"**
A: Tell them it's confidential. That's standard in the industry.

**Q: Can buyers see other buyers' offers?**
A: No - they only see their own campaigns via their login.

**Q: What about internal team members?**
A: Give them "Manager" role - they see everything except delete permissions.

---

**Privacy = Protecting Your Business Relationships** 🔒
