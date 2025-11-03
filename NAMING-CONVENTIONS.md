# 📝 Offer-Ops Naming Conventions

## Automated ID & Name Generation

To prevent confusion and ensure consistency, Offer IDs and Campaign Names are **automatically generated** when you fill out the form.

---

## Offer ID Format

**Pattern:** `VERTICAL-BUYER-###`

**Examples:**
- `ACA-JESSE-001` - ACA offer for Jesse
- `SSDI-AHMEED-042` - SSDI offer for Ahmeed  
- `AUTO-ANCELET-156` - Auto Insurance for Ancelet
- `FE-JESSE-003` - Final Expense for Jesse

**Rules:**
1. **VERTICAL** - First 6 letters of vertical (uppercase, no spaces)
   - "Auto Insurance" → "AUTO"
   - "Final Expense" → "FINALE"
   - "ACA" → "ACA"

2. **BUYER** - First 8 letters of buyer's first name (uppercase)
   - "Jesse Barbera" → "JESSE"
   - "Ahmeed" → "AHMEED"
   - "Tom M" → "TOM"

3. **###** - Last 3 digits of timestamp (unique identifier)
   - Auto-generated when form is filled
   - Ensures uniqueness even with same buyer/vertical

**Auto-Generated:** As soon as you select:
- Vertical
- Buyer
- Offer Type

**Can Override:** Yes, you can manually edit if needed, but not recommended.

---

## Campaign Name Format

**Pattern:** `Vertical Type - Buyer`

**Examples:**
- `ACA CPA - Jesse`
- `SSDI Transfer - Ahmeed`
- `Auto Insurance CPL - Ancelet`
- `Final Expense CPA - Jesse`

**Rules:**
1. **Vertical** - Full vertical name (proper case)
2. **Type** - Offer type (CPA, CPL, Transfer, etc.)
3. **Buyer** - Buyer's first name or full name

**Auto-Generated:** Updates automatically when you change:
- Vertical
- Offer Type
- Buyer

**Can Override:** Yes, you can customize the campaign name if needed.

---

## Why Auto-Generate?

### ❌ **Without Auto-Generation:**
```
Offer IDs created manually:
- ACA-jesse-1
- aca_Jesse_001
- ACA - JESSE - 2
- jesse-aca-offer
- JesseACA2024
```
→ **Chaos!** No one knows which is which.

### ✅ **With Auto-Generation:**
```
All follow the same pattern:
- ACA-JESSE-001
- ACA-JESSE-002
- SSDI-JESSE-003
- FE-AHMEED-001
```
→ **Clean!** Everyone understands the format instantly.

---

## Benefits

1. **Consistency** - Everyone follows the same format
2. **No Confusion** - Easy to identify vertical, buyer, sequence
3. **Sortable** - IDs naturally group by vertical and buyer
4. **Searchable** - Easy to find offers by typing partial ID
5. **Professional** - Looks clean in reports and exports
6. **No Duplicates** - Timestamp suffix prevents collisions

---

## Manual Override

If you need a custom ID or name:

1. **Wait for auto-generation** first
2. **Then edit** the field as needed
3. System will warn if the ID already exists

**Example Use Cases:**
- Legacy offer IDs (migrating old data)
- Special naming for client-facing offers
- Test offers with specific names

---

## Best Practices

### ✅ **DO:**
- Let the system auto-generate IDs
- Only override when absolutely necessary
- Keep vertical and buyer names consistent
- Use the standard format for new offers

### ❌ **DON'T:**
- Create custom formats manually
- Use special characters or spaces
- Change the format mid-project
- Duplicate existing IDs

---

## Examples by Vertical

### ACA Offers:
```
ACA-JESSE-001  → ACA CPA - Jesse
ACA-JESSE-002  → ACA CPL - Jesse
ACA-AHMEED-001 → ACA Transfer - Ahmeed
```

### SSDI Offers:
```
SSDI-JESSE-001   → SSDI CPA - Jesse
SSDI-JESSE-002   → SSDI Downsell - Jesse
SSDI-TOMM-001    → SSDI Transfer - Tom M
```

### Auto Insurance:
```
AUTO-ANCELET-001 → Auto Insurance CPL - Ancelet
AUTO-ANCELET-002 → Auto Insurance RTB - Ancelet
```

### Final Expense:
```
FE-JESSE-001   → Final Expense CPA - Jesse
FE-AHMEED-001  → Final Expense Transfer - Ahmeed
```

---

## Migration from Old Data

If you have existing offers with different formats:

1. **Keep old IDs** in the `notes` field
2. **Use new format** for the offer_id field
3. **Add a note**: "Legacy ID: OLD-FORMAT-123"

This way you maintain history but move forward with consistency.

---

**Questions?** The form will show you the auto-generated ID in real-time as you fill it out!
