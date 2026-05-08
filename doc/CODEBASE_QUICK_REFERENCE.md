# Quick Reference: Codebase Analysis - At a Glance

## 📑 Quick Navigation

- **[Complete Analysis](./CODEBASE_ANALYSIS.md)** - Full detailed report
- **[This File]** - Quick reference tables and summaries

---

## 🎯 TOP ISSUES TO FIX (Priority Order)

### Issue #1: HTTP Response Validation (CRITICAL)
```
⚠️ Severity: CRITICAL
📊 Occurrences: 7+
📦 Files: 5 different files
💾 Code Duplication: ~100 lines
```

**Example:**
```typescript
// REPEATED 7 times:
if (res.status != 200)
  return Promise.reject(new Error("Response not status 200 : " + JSON.stringify(res)));
```

**Fix:** Extract to utility function (saves ~100 lines)

---

### Issue #2: DataTable URLSearchParams (CRITICAL)
```
⚠️ Severity: CRITICAL  
📊 Occurrences: 5 functions
📦 Files: customer.ts (1 file but 5 massive functions)
💾 Code Duplication: ~150 lines of identical parameter building
```

**Example Functions:**
- `httpGetProfileCustomer()` - 90 lines
- `httpGetUnpaidCustomer()` - 120 lines
- `httpGetPaidCustomer()` - 100 lines
- `httpGetCustomer()` - 130 lines

**Fix:** Build reusable column builder (saves ~120 lines)

---

### Issue #3: Over-sized Components (HIGH)
```
⚠️ Severity: HIGH
📊 Over-sized Files: 3
📦 Files: 
  - PaymentPage.tsx (320 lines)
  - CustomerPage.tsx (280 lines)
  - SelectCustomer.tsx (200 lines)
💾 Code that should be extracted: ~200 lines
```

**Fix:** Split into smaller, focused components

---

### Issue #4: Hard-coded Values (HIGH)
```
⚠️ Severity: HIGH
📊 Occurrences: 15+
📦 Files: 8 different files
💾 Maintenance Risk: HIGH
```

**Examples:**
- `"https://tungkalilir.rlradius.app"` (8+ times)
- `750` px scroll threshold
- `25` page size
- `"7975 0100 0814 504"` account number

**Fix:** Move to `src/config/constants.ts`

---

### Issue #5: Duplicate DateTimeInputText.tsx (HIGH)
```
⚠️ Severity: HIGH
📊 Status: NOT USED - Just a copy
📦 File: src/components/input/DateTimeInputText.tsx
💾 Code: ~90 lines of dead code
```

**Fix:** Delete immediately

---

## 📊 FUNCTION INVENTORY AT A GLANCE

### By Category

#### Utilities (10 functions)
```
✅ formatRupiah()              src/utils/helpers.ts
✅ formatDate()                src/utils/helpers.ts
✅ getDaysUntilDue()           src/utils/helpers.ts
✅ timeConvertToString()       src/utils/helpers.ts
✅ dateConvertToString()       src/utils/helpers.ts
✅ dateTimeConvertToString()   src/utils/helpers.ts
✅ logError()                  src/utils/helpers.ts
✅ getCookieTungkaLilirAdmin() src/utils/cookie.ts
✅ isExpiredCookie()           src/utils/cookie.ts
✅ handleOpenBrowserLoginGetCookie() src/utils/cookie.ts
```

#### HTTP/API (14 functions)
```
⚠️ HttpPaymentApi.getAll()     src/utils/payment.ts
⚠️ HttpPaymentApi.read()       src/utils/payment.ts
⚠️ HttpPaymentApi.create()     src/utils/payment.ts
⚠️ HttpPaymentApi.update()     src/utils/payment.ts
⚠️ HttpPaymentApi.delete()     src/utils/payment.ts
⚠️ HttpPaymentRlradius.getCSRF()  src/utils/payment.ts
⚠️ HttpPaymentRlradius.setLunas() src/utils/payment.ts
❌ httpGetHomeCustomer()       src/hook/requests/customer.ts
❌ httpGetProfileCustomer()    src/hook/requests/customer.ts (90 lines)
❌ httpGetUnpaidCustomer()     src/hook/requests/customer.ts (120 lines)
❌ httpGetPaidCustomer()       src/hook/requests/customer.ts (100 lines)
❌ httpGetCustomer()           src/hook/requests/customer.ts (130 lines)
⚠️ PaymentList.create()        src/utils/payment.ts
⚠️ PaymentList.update()        src/utils/payment.ts
```

#### Components (15 components)
```
⚠️ DetailCardCustomer         src/components/customer/    (150+ lines)
✅ PaymentDetailCustomer      src/components/customer/
✅ SelectCustomer             src/components/customer/    (180+ lines)
✅ DateTimeInput              src/components/input/
❌ DateTimeInputText          src/components/input/       (DUPLICATE)
✅ ImagePicker                src/components/input/
✅ DataList                   src/components/list/
✅ DataListScrolling          src/components/list/
✅ BaseLayout                 src/components/layout/
✅ HeaderFilterChipToolbar    src/components/toolbars/
✅ TextSearchToolbar          src/components/toolbars/
✅ ExploreContainer           src/components/            (UNUSED)
```

#### Pages (5 pages)
```
⚠️ CustomerPage              src/pages/Customer/         (280 lines)
⚠️ PaymentPage               src/pages/Payment/          (320 lines)
❌ UnpaidPage                src/pages/Unpaid/           (NOT IN ROUTER)
⚠️ ValidationPage            src/pages/Validation/       (MINIMAL)
❌ Home                      src/pages/Home/             (NOT IN ROUTER)
```

#### Hooks (3 hooks)
```
⚠️ useCustomer()             src/hook/requests/customer.ts (OVERSIZED)
✅ useShareTarget()          src/hook/share-target.ts
⚠️ useShareTargetListener()  src/hook/share-target.ts (INTERNAL)
```

#### Database (2 functions)
```
✅ initializeDataSources()   src/databases/utilities.ts
✅ getCountOfElements()      src/databases/utilities.ts
```

**Legend:**
- ✅ Well-implemented
- ⚠️ Needs attention
- ❌ Critical issues

---

## 🔴 RED FLAGS - Critical Code Smells

| Issue | Count | Impact | Files |
|-------|-------|--------|-------|
| Methods >150 lines | 3 | Hard to test/maintain | CustomerPage, PaymentPage, SelectCustomer |
| Repeated HTTP validation | 7 | Bug propagation risk | 5 files |
| Hard-coded URLs | 2 | Maintenance nightmare | payment.ts, 4 HTTP functions |
| Dead/unused code | 4 files | Confusing, increases size | Home.tsx, UnpaidPage.tsx, ExploreContainer, DateTimeInputText |
| No type safety | 3 instances | Runtime errors | Home.tsx, Payment validation |
| Commented code blocks | 3 | Clutters codebase | Payment.tsx, Home.tsx |
| Mixed patterns (async/promise) | Throughout | Inconsistency | All API functions |

---

## 📦 DUPLICATE CODE SUMMARY

### Pattern #1: HTTP Response Validation
```typescript
// Appears in:
// 1. HttpPaymentApi.getAll() - line 250
// 2. HttpPaymentApi.read() - line 270
// 3. HttpPaymentApi.create() - line 290
// 4. HttpPaymentApi.update() - line 310
// 5. httpGetProfileCustomer() - line 65
// 6. httpGetUnpaidCustomer() - line 185
// 7. httpGetPaidCustomer() - line 305

// Total lines duplicated: ~70 lines
// Fix savings: ~60 lines with 1 extracted function
```

### Pattern #2: URLSearchParams Building
```typescript
// Appears in:
// 1. httpGetProfileCustomer() - 8 columns, 20 lines
// 2. httpGetUnpaidCustomer() - 17 columns, 50 lines
// 3. httpGetPaidCustomer() - 18 columns, 45 lines
// 4. httpGetCustomer() - 19 columns, 60 lines
// 5. Home.tsx (commented) - Hard-coded

// Total lines duplicated: ~175 lines
// Fix savings: ~120 lines with builder function
```

### Pattern #3: Cookie Headers
```typescript
// Appears in:
// 1. httpGetProfileCustomer()
// 2. httpGetUnpaidCustomer()
// 3. httpGetPaidCustomer()
// 4. httpGetCustomer()

// Identical headers in each:
// headers: {
//   Accept: "application/json, text/javascript, */*; q=0.01",
//   "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//   "X-Requested-With": "XMLHttpRequest",
//   Cookie: cookie,
// }

// Fix: Extract to constant
```

### Pattern #4: Date/Time Conversion
```typescript
// Appears in:
// 1. dateConvertToString() - manual formatting
// 2. timeConvertToString() - manual formatting
// 3. DateTimeInputText.tsx - 90 lines of duplicate logic

// Issue: Inconsistent approaches (toLocaleDateString vs padStart)
// Fix: Consolidate to single implementation
```

---

## 🎯 FILES TO DELETE (IMMEDIATE)

| File | Size | Reason | Impact |
|------|------|--------|--------|
| `DateTimeInputText.tsx` | ~90 lines | Exact duplicate of DateTimeInput.tsx | ✅ Safe to delete |
| `UnpaidPage.tsx` | ~300 lines | Not in router, dummy data | ✅ Safe to delete |
| `Home.tsx` | ~100 lines | Not in router, deprecated | ✅ Safe to delete |
| `ExploreContainer.tsx` | ~10 lines | Template component, never used | ✅ Safe to delete |
| `ValidationPage.tsx` | ~10 lines | Just redirects to /customer | ⚠️ Could keep for future |

**Total savings: ~400-500 lines**

---

## 🏗️ REFACTORING ROADMAP

### WEEK 1: High-Impact Extractions
```
Day 1-2: Extract HTTP response handler
  ↳ Saves ~70 lines
  ↳ Improves error consistency
  
Day 3: Create DataTable builder
  ↳ Saves ~120 lines
  ↳ Reduces customer.ts from 800 lines to ~400
  
Day 4-5: Extract constants
  ↳ Saves ~30 lines
  ↳ Improves maintainability
```

### WEEK 2: Component Cleanup
```
Day 1-2: Delete duplicate/unused files
  ↳ Saves ~400 lines
  ↳ Reduces confusion
  
Day 3-4: Split large components
  ↳ PaymentPage (320 → 3 files of ~100 each)
  ↳ CustomerPage (280 → 3 files of ~90 each)
  
Day 5: Create custom hooks
  ↳ usePageState()
  ↳ Reduces code in pages
```

### WEEK 3: Architecture Improvements
```
Day 1-2: Create src/api/ directory
  ↳ http-client.ts
  ↳ rlradius-client.ts
  ↳ datatable.ts
  
Day 3-4: Refactor useCustomer hook
  ↳ Split into useCustomerData, useCustomerFilter, useCustomerSync
  
Day 5: Add error boundaries & logging
```

---

## 📊 BEFORE & AFTER METRICS

### Current State
```
Total src/ lines:        ~3,500
Duplicated lines:        ~350
Dead code:               ~400
Very long methods:       3
Hard-coded values:       15+
HTTP handlers (duped):   7
```

### After Refactoring
```
Total src/ lines:        ~2,400 (-30%)
Duplicated lines:        ~50 (-85%)
Dead code:               0 (-100%)
Very long methods:       0 (-100%)
Hard-coded values:       0 (-100%)
HTTP handlers (duped):   1 (-85%)
```

---

## 🔧 REFACTORING TEMPLATES

### Template 1: Extract HTTP Validation
```typescript
// BEFORE (in every HTTP function):
if (res.status != 200)
  return Promise.reject(new Error("Response not status 200 : " + JSON.stringify(res)));
if (res.headers["Content-Type"].search("application/json") == -1)
  return Promise.reject({ res });
return res.status == 200 ? typeof res.data == "string" ? JSON.parse(res.data) : res.data : null;

// AFTER:
try {
  const data = await validateHttpResponse(res);
  return Promise.resolve(data);
} catch (err) {
  return Promise.reject(err);
}

// New utility function:
export const validateHttpResponse = (res: CapacitorHttpResponse): any => {
  if (res.status !== 200) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(res)}`);
  }
  if (!res.headers["Content-Type"]?.includes("application/json")) {
    throw new Error("Response is not JSON");
  }
  return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
};
```

### Template 2: Extract DataTable Builder
```typescript
// BEFORE (90+ lines of repetitive column definitions):
data: new URLSearchParams({
  draw: "1",
  "columns[0][data]": "invoice",
  "columns[0][name]": "",
  "columns[0][searchable]": "true",
  "columns[0][orderable]": "false",
  // ... 15 more column definitions
}).toString(),

// AFTER:
const columnDefs = [
  { data: "invoice", searchable: true, orderable: false },
  { data: "namapelanggan", searchable: true, orderable: true },
  // ... only 3 lines instead of 50!
];
data: buildDataTableParams(columnDefs, search, start, length).toString(),

// New utility function:
export const buildDataTableParams = (
  columnDefs: Array<{ data: string; searchable: boolean; orderable: boolean }>,
  search: string = "",
  start: number = 0,
  length: number = 25
): URLSearchParams => {
  const params = new URLSearchParams({
    draw: "1",
    start: start.toString(),
    length: length.toString(),
    "search[value]": search,
    "search[regex]": "false",
  });

  columnDefs.forEach((col, idx) => {
    params.append(`columns[${idx}][data]`, col.data);
    params.append(`columns[${idx}][name]`, "");
    params.append(`columns[${idx}][searchable]`, col.searchable ? "true" : "false");
    params.append(`columns[${idx}][orderable]`, col.orderable ? "true" : "false");
    params.append(`columns[${idx}][search][value]`, "");
    params.append(`columns[${idx}][search][regex]`, "false");
  });

  return params;
};
```

---

## ✅ CHECKLIST: Quick Wins

- [ ] Delete DateTimeInputText.tsx
- [ ] Delete UnpaidPage.tsx (or keep marked as "TODO")
- [ ] Delete Home.tsx (or move to archive branch)
- [ ] Delete ExploreContainer.tsx
- [ ] Rename `uc` variable to `customerResult` (search & replace)
- [ ] Rename `res` variable to `httpResponse` (search & replace)
- [ ] Extract 7x HTTP validation to single function
- [ ] Create constants file with hard-coded URLs
- [ ] Remove all commented code blocks

---

## 📝 NOTES FOR DEVELOPERS

### Common Patterns Used
1. **React Hooks** - Good use throughout
2. **Context API** - Used for app-wide state (imageShare, customer)
3. **Capacitor** - For mobile features (HTTP, Preferences, FilePicker)
4. **Ionic** - UI framework
5. **Tailwind CSS** - Styling (with some inline styles mixed in)
6. **TypeORM** - Database with SQLite
7. **date-fns** - Date manipulation (good choice!)

### Dependencies to Be Aware Of
- `@capacitor/*` - Mobile plugins
- `@ionic/react` - UI components
- `typeorm` - ORM
- `date-fns` - Dates
- `react-router` - Navigation

### Architectural Decisions Made
1. ✅ Separation of concerns (pages, components, hooks, utils)
2. ✅ Context for app-wide state
3. ✅ Custom hooks for logic reuse
4. ⚠️ Mixed pattern in API layer (Classes + Hooks)
5. ⚠️ No clear distinction between components and containers

---

## 🎓 RECOMMENDATIONS FOR NEW DEVELOPERS

1. **Start with:** Understanding the data flow (customer → payment → invoice)
2. **Key files to study:**
   - `src/types/customer.ts` - Data model
   - `src/hook/requests/customer.ts` - API layer
   - `src/pages/Customer/Customer.tsx` - Main page pattern
3. **Common patterns:**
   - Use `useAppContext()` for app state
   - Use `useCustomer()` for customer data
   - Follow component naming: `<Feature>Page.tsx` for pages
4. **When adding features:**
   - Add types to `src/types/`
   - Add utilities to `src/utils/`
   - Add hooks to `src/hooks/`
   - Add components to `src/components/`
   - Add pages to `src/pages/`

---

**Last Updated:** May 8, 2026
**Analysis Tool:** GitHub Copilot Codebase Analysis
**Report Version:** 1.0
