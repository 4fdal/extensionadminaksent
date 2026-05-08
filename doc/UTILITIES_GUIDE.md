# Utilities & Helpers Guide

Panduan lengkap untuk menggunakan centralized utilities dan helpers yang telah diorganisir.

## 📁 Struktur Folder

```
src/
├── config/                  # Configuration & constants
├── utils/
│   ├── helpers/            # Reusable helper functions
│   ├── http/               # HTTP utilities
│   └── validators/         # Validators & builders
└── hooks/                  # Custom React hooks
```

---

## 🔧 Utilities Overview

### 1. Constants (`src/config/constants.ts`)

Semua hard-coded values terpusat di satu file.

```typescript
import {
  API_CONFIG,
  DB_CONFIG,
  LIST_CONFIG,
  UI_CONFIG,
  STATUS_FILTERS,
  ERROR_MESSAGES
} from "@/config";

// API Configuration
console.log(API_CONFIG.BASE_URL);        // "https://tungkalilir.rlradius.app"
console.log(API_CONFIG.TIMEOUT);         // 30000

// List Configuration
const pageSize = LIST_CONFIG.DEFAULT_PAGE_SIZE; // 25
const threshold = LIST_CONFIG.SCROLL_THRESHOLD_PX; // 750

// UI Configuration
const breakpoints = UI_CONFIG.MODAL_BREAKPOINTS; // [0, 0.5, 0.8, 1]

// Status Filters
const filterKey = STATUS_FILTERS.UNPAID; // "UNPAID"
```

---

### 2. HTTP Validation (`src/utils/http/response-validator.ts`)

Centralized HTTP response validation dan error handling.

```typescript
import { validateHttpResponse, handleHttpError } from "@/utils/http";
import { CapacitorHttp } from "@capacitor/core";

// Example usage in API call
async function getCustomers() {
  try {
    const res = await CapacitorHttp.get({
      url: `${API_CONFIG.BASE_URL}/api/customers`,
    });

    // Single line validation replaces 10+ lines of duplicate code
    const data = validateHttpResponse(res, "getCustomers");
    return data;
  } catch (error) {
    const message = handleHttpError(error, "Failed to fetch customers");
    console.error(message);
  }
}
```

**Benefits**:
- Eliminates 7+ duplicate validation blocks (~100 lines saved)
- Consistent error messages
- Better debugging with context parameter

---

### 3. DataTable Builder (`src/utils/validators/datatable-builder.ts`)

Build DataTable parameters with 1 function instead of 90+ lines per function.

```typescript
import {
  buildDataTableParams,
  COMMON_COLUMNS
} from "@/utils/validators";

// Build parameters for customer list
const params = buildDataTableParams({
  columns: COMMON_COLUMNS.customer,
  start: 0,
  length: 25,
  search: "customer name",
  order: [{ column: 0, dir: "asc" }]
});

// Use with API call
const queryString = params.toString();
const url = `https://api.example.com/customers?${queryString}`;
```

**Pre-defined column sets**:
- `COMMON_COLUMNS.customer` - Customer list columns
- `COMMON_COLUMNS.payment` - Payment columns
- `COMMON_COLUMNS.unpaid` - Unpaid customers columns

---

### 4. Data Validators (`src/utils/validators/data-validators.ts`)

Common validation functions.

```typescript
import {
  isValidPhoneNumber,
  isValidEmail,
  isNotEmpty,
  hasRequiredFields,
  isDeepEqual
} from "@/utils/validators";

// Phone validation
isValidPhoneNumber("+628123456789");     // true
isValidPhoneNumber("invalid");           // false

// Email validation
isValidEmail("user@example.com");        // true

// Required fields check
const user = { id: 1, name: "John", email: "" };
hasRequiredFields(user, ["id", "name", "email"]); // false

// Deep comparison
isDeepEqual({ a: 1 }, { a: 1 });        // true
```

---

## 🎯 Helper Functions

### Array & Object Helpers

```typescript
import {
  groupBy,
  sortBy,
  uniqueBy,
  pick,
  omit,
  deepMerge
} from "@/utils/helpers";

// Group by status
const users = [
  { id: 1, name: "John", status: "active" },
  { id: 2, name: "Jane", status: "inactive" },
  { id: 3, name: "Bob", status: "active" }
];

const grouped = groupBy(users, "status");
// { active: [...], inactive: [...] }

// Sort by name
const sorted = sortBy(users, "name", "asc");

// Remove duplicates by ID
const unique = uniqueBy(users, "id");

// Extract specific fields
const names = users.map(u => pick(u, ["id", "name"]));

// Remove sensitive fields
const safe = users.map(u => omit(u, ["password", "token"]));
```

### String Helpers

```typescript
import {
  capitalize,
  titleCase,
  truncate,
  maskEmail,
  formatPhoneNumber
} from "@/utils/helpers";

capitalize("hello");                     // "Hello"
titleCase("hello world");               // "Hello World"
truncate("Long text here", 10);         // "Long text..."
maskEmail("user@example.com");          // "us****@example.com"
formatPhoneNumber("08123456789");       // "081-234-56789"
```

### Date Helpers

```typescript
import {
  formatDate,
  addDays,
  daysDifference,
  timeAgo,
  isToday,
  isPast
} from "@/utils/helpers";

// Format date
formatDate(new Date());                  // "08/05/2026"
formatDate(new Date(), "YYYY-MM-DD");   // "2026-05-08"

// Date arithmetic
const tomorrow = addDays(new Date(), 1);
const daysAgo = daysDifference(new Date(2026, 4, 1), new Date());

// Human readable time
timeAgo(new Date(Date.now() - 3600000)); // "1 hour ago"

// Date checking
isToday(new Date());                     // true
isPast(new Date(2020, 0, 1));           // true
```

### Number & Currency Helpers

```typescript
import {
  formatRupiah,
  parseRupiah,
  formatNumber,
  formatPercent,
  calculateDiscount
} from "@/utils/helpers";

// Currency formatting
formatRupiah(15000);                     // "Rp 15.000"
formatRupiah("15000");                   // "Rp 15.000"

// Parse currency back
parseRupiah("Rp 15.000");               // 15000

// Number formatting
formatNumber(1234567.89, 2);            // "1,234,567.89"
formatPercent(0.85);                    // "85%"

// Calculations
calculateDiscount(100, 20);             // 80 (20% off)
```

---

## 🎣 Custom Hooks

### usePagination

```typescript
import { usePagination } from "@/hooks";

function MyComponent() {
  const pagination = usePagination(25); // pageSize = 25

  return (
    <>
      <div>Page: {pagination.currentPage + 1}</div>
      <div>Total Pages: {pagination.totalPages}</div>
      <div>Showing items {pagination.startIndex} - {pagination.endIndex}</div>

      <button onClick={pagination.nextPage} disabled={!pagination.hasNextPage}>
        Next
      </button>
      <button onClick={pagination.previousPage} disabled={!pagination.hasPreviousPage}>
        Previous
      </button>
    </>
  );
}
```

### useAsync

```typescript
import { useAsync } from "@/hooks";

function MyComponent() {
  const { data, isLoading, isError, error, execute } = useAsync(
    async () => {
      const res = await fetch("/api/data");
      return res.json();
    },
    true, // execute immediately
    {
      onSuccess: (data) => console.log("Data loaded:", data),
      onError: (error) => console.error("Error:", error)
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

### useForm

```typescript
import { useForm } from "@/hooks";

function MyForm() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      age: 0
    },
    onSubmit: async (values) => {
      await submitForm(values);
    },
    onError: (error) => console.error("Error:", error)
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.name && form.errors.name && (
        <span>{form.errors.name}</span>
      )}

      <button type="submit" disabled={form.isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

### useDebounce & useThrottle

```typescript
import { useDebounce, useThrottle } from "@/hooks";

// Debounce search input
const [searchTerm, setSearchTerm] = useState("");
const debouncedTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  // Search only after user stops typing for 500ms
  if (debouncedTerm) {
    performSearch(debouncedTerm);
  }
}, [debouncedTerm]);

// Throttle scroll event
const handleScroll = useThrottle(() => {
  console.log("Scrolling...");
}, 300); // Max once per 300ms
```

### useLocalStorage

```typescript
import { useLocalStorage } from "@/hooks";

function MyComponent() {
  const [user, setUser, removeUser] = useLocalStorage("user", null);

  return (
    <>
      <button onClick={() => setUser({ id: 1, name: "John" })}>
        Save User
      </button>
      <button onClick={removeUser}>Clear User</button>
      <div>User: {JSON.stringify(user)}</div>
    </>
  );
}
```

---

## 📋 Import Cheat Sheet

```typescript
// Constants
import { API_CONFIG, STATUS_FILTERS, ERROR_MESSAGES } from "@/config";

// HTTP
import { validateHttpResponse, handleHttpError } from "@/utils/http";

// Validators
import {
  isValidEmail,
  buildDataTableParams,
  COMMON_COLUMNS
} from "@/utils/validators";

// Helpers (Array/Object)
import {
  groupBy,
  sortBy,
  uniqueBy,
  pick,
  omit,
  getNestedValue
} from "@/utils/helpers";

// Helpers (String)
import {
  capitalize,
  truncate,
  formatPhoneNumber,
  maskEmail
} from "@/utils/helpers";

// Helpers (Date)
import {
  formatDate,
  addDays,
  timeAgo,
  isToday
} from "@/utils/helpers";

// Helpers (Number)
import {
  formatRupiah,
  formatPercent,
  calculateDiscount
} from "@/utils/helpers";

// Hooks
import {
  usePagination,
  useAsync,
  useForm,
  useDebounce,
  useThrottle,
  useLocalStorage
} from "@/hooks";
```

---

## 🚀 Migration Guide

### Before (Old Way)

```typescript
// Hard-coded values
const pageSize = 25;
const baseUrl = "https://tungkalilir.rlradius.app";

// Validation scattered
if (response.status !== 200) {
  throw new Error("Invalid response");
}

// Helper functions inline
function formatCurrency(amount) {
  return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

// Data manipulation inline
const grouped = users.reduce((acc, user) => {
  if (!acc[user.status]) acc[user.status] = [];
  acc[user.status].push(user);
  return acc;
}, {});
```

### After (New Way)

```typescript
// Centralized constants
import { LIST_CONFIG, API_CONFIG } from "@/config";
const pageSize = LIST_CONFIG.DEFAULT_PAGE_SIZE;
const baseUrl = API_CONFIG.BASE_URL;

// Centralized validation
import { validateHttpResponse } from "@/utils/http";
const data = validateHttpResponse(response);

// Reusable helpers
import { formatRupiah } from "@/utils/helpers";
const formatted = formatRupiah(15000);

// Reusable utilities
import { groupBy } from "@/utils/helpers";
const grouped = groupBy(users, "status");
```

---

## ✅ Best Practices

1. **Use Constants** - Never hard-code values
   ```typescript
   // ❌ Bad
   const url = "https://tungkalilir.rlradius.app/api";
   
   // ✅ Good
   const url = `${API_CONFIG.BASE_URL}/api`;
   ```

2. **Use Validators** - Before processing data
   ```typescript
   // ✅ Good
   if (!isValidEmail(email)) return error("Invalid email");
   ```

3. **Use Helpers** - Instead of inline code
   ```typescript
   // ✅ Good
   const sorted = sortBy(items, "name", "asc");
   ```

4. **Use Custom Hooks** - Reduce component complexity
   ```typescript
   // ✅ Good
   const form = useForm({ initialValues, onSubmit });
   ```

---

## 📚 More Documentation

- [CLEAN_CODE_IMPLEMENTATION.md](./CLEAN_CODE_IMPLEMENTATION.md) - Complete implementation summary
- [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) - Refactoring checklist
- [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md) - Detailed code analysis

---

Last Updated: May 8, 2026
