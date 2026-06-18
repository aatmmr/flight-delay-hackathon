---
name: backend-testing
description: Structure and test Express.js routes using Vitest for unit and integration tests of RESTful APIs
---

# Backend Testing with Vitest & Supertest

Test Express.js routes and services using Vitest for unit/integration tests. This skill covers setting up tests, mocking dependencies, creating reusable fixtures, and testing API responses.

## Quick Setup

### Install Dependencies
```bash
npm install --save-dev vitest supertest @types/supertest
npm install express cors csv-parser dotenv
```

### Configuration Files

**vitest.config.ts** — Minimal Node.js test environment:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,  // Enable describe, it, expect globally
  },
});
```

**package.json** — Add test scripts:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^4.1.9",
    "supertest": "^7.2.2",
    "@types/supertest": "^7.2.0",
    "typescript": "^4.9.4"
  }
}
```

---

## Test Types & When to Use Each

| Test Type | Scope | Speed | What to Test |
|-----------|-------|-------|--------------|
| **Unit** | Single function in isolation | Fast | Service logic, filters, calculations |
| **Integration** | Route + mocked services | Medium | Request → response flow, pagination, sorting |
| **End-to-end** | Full stack with real data | Slow | Real CSV loading, API + frontend together |

This skill focuses on **unit + integration** testing (fastest feedback loop for development).

references unit testing: [](./references/unit-testing.md)

---

## Test Structure & Pattern

### 1. Create Fixtures (Mock Data)

**File: `src/tests/fixtures.ts`**

Store reusable mock data that represents real domain objects. Fixtures should match your TypeScript interfaces exactly.

```typescript
import { Flight, AirportInfo, DelayStats } from '../types.js';

// Mock flights covering different scenarios (on-time, delayed, cancelled)
export const mockFlights: Flight[] = [
  {
    year: 2013,
    month: 1,
    dayOfMonth: 1,
    dayOfWeek: 2,
    carrier: 'AA',
    originAirportId: 10397,
    originAirportName: 'Atlanta, GA: Hartsfield-Jackson Atlanta International',
    depDelay: 10,      // Delayed flight
    depDel15: 0,       // Not >15 min delayed
    arrDelay: 15,
    arrDel15: 1,
    cancelled: 0,
    // ... other fields
  },
  {
    // ... more mock objects covering edge cases
  },
];

export const mockAirports: AirportInfo[] = [
  { id: 10397, name: 'Atlanta, GA: Hartsfield-Jackson Atlanta International', ... },
  // ...
];

// Mock pre-computed statistics
export const mockDelayStatsByCarrier: Record<string, DelayStats> = {
  AA: {
    carrier: 'AA',
    totalFlights: 2,
    delayedFlights: 0,
    averageDepDelay: 5,
    averageArrDelay: 5,
    delayPercentage: 0,
  },
  // ...
};
```

**Key Practices:**
- Create fixtures that match your real domain objects exactly
- Include multiple scenarios: happy path, edge cases, empty states
- Use sensible defaults that reflect real data patterns
- Export as named exports for selective import in tests

---

### 2. Mock Service Dependencies

**Pattern: Module-level mocking before import**

```typescript
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { mockFlights, mockAirports } from './fixtures.js';

// ✅ MOCK BEFORE IMPORTING THE ROUTE
vi.mock('../services/dataService.js', () => {
  const flights = mockFlights;

  return {
    getAllFlights: () => flights,
    searchFlights: (query: {
      origin?: string;
      destination?: string;
      carrier?: string;
      minDelay?: number;
      maxDelay?: number;
    }) =>
      flights.filter((f) => {
        if (query.origin && f.originAirportName !== query.origin) return false;
        if (query.destination && f.destAirportName !== query.destination) return false;
        if (query.carrier && f.carrier !== query.carrier) return false;
        if (query.minDelay !== undefined && f.depDelay < query.minDelay) return false;
        if (query.maxDelay !== undefined && f.depDelay > query.maxDelay) return false;
        return true;
      }),
    getUniqueAirportNames: () => mockAirports.map((a) => a.name),
    getUniqueCarriers: () => ['AA', 'DL'],
  };
});

// ✅ THEN IMPORT THE ROUTE (will use mocked services)
const { default: flightsRouter } = await import('../routes/flights.js');
```

**Key Practices:**
- Use `vi.mock()` BEFORE importing the module under test
- Mock logic mirrors real service behavior (e.g., filtering)
- Return objects matching the service's real API
- Use `.js` extensions for ESM imports

---

### 3. Set Up Express App for Testing

**Pattern: Create isolated app instance**

```typescript
const app = express();
app.use(express.json());
app.use('/api/flights', flightsRouter);
app.use('/api/analytics', analyticsRouter);
```

**Benefits:**
- Isolated from global app state
- Each test suite gets a fresh instance
- No port binding required (Supertest handles it)

---

### 4. Write Route Tests

**Pattern: Test status code, response shape, and business logic**

```typescript
describe('GET /api/flights', () => {
  // Test 1: Default behavior
  it('returns paginated flights with default page and limit', async () => {
    const res = await request(app).get('/api/flights');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      page: 1,
      limit: 100,
      total: mockFlights.length,
      totalPages: 1,
    });
    expect(res.body.data).toHaveLength(mockFlights.length);
  });

  // Test 2: Query parameter handling
  it('respects the page query parameter', async () => {
    const res = await request(app).get('/api/flights?page=2&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].carrier).toBe(mockFlights[1].carrier);
  });

  // Test 3: Validation & constraints
  it('caps limit at 500', async () => {
    const res = await request(app).get('/api/flights?limit=9999');

    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(500);
  });

  // Test 4: Response shape validation
  it('returns correct flight shape', async () => {
    const res = await request(app).get('/api/flights?limit=1');

    expect(res.status).toBe(200);
    const flight: Flight = res.body.data[0];
    expect(flight).toMatchObject({
      carrier: expect.any(String),
      year: expect.any(Number),
      month: expect.any(Number),
      depDelay: expect.any(Number),
    });
  });
});
```

**Test Categories:**

| Category | Purpose | Example |
|----------|---------|---------|
| **Happy Path** | Default behavior works | GET without params returns data |
| **Input Validation** | Constraints are enforced | Limit capped at 500 |
| **Query Parameters** | Filters and pagination work | page=2&limit=1 |
| **Response Shape** | Data structure is correct | All required fields present |
| **Sorting & Ordering** | Data is ordered correctly | Results sorted by delay descending |
| **Edge Cases** | Boundary conditions handled | Empty results, single item |

---

### 5. Unit Testing Services (Direct Function Testing)

**File: `src/tests/dataService.test.ts`** — Test service logic without HTTP layer

```typescript
import { describe, it, expect } from 'vitest';
import { searchFlights, calculateDelayStats } from '../services/dataService.js';
import { mockFlights } from './fixtures.js';

describe('searchFlights()', () => {
  // Test filtering logic
  it('filters flights by origin airport', () => {
    const result = searchFlights({
      origin: 'Atlanta, GA: Hartsfield-Jackson Atlanta International',
    });

    expect(result).toHaveLength(2);  // AA flights
    expect(result.every((f) => f.originAirportName === 'Atlanta')).toBe(true);
  });

  // Test multiple filters
  it('applies multiple filters simultaneously', () => {
    const result = searchFlights({
      origin: 'Atlanta, GA: Hartsfield-Jackson Atlanta International',
      carrier: 'AA',
      minDelay: 5,
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((f) => f.depDelay >= 5)).toBe(true);
  });

  // Test boundary conditions
  it('returns empty array when no flights match filters', () => {
    const result = searchFlights({
      origin: 'NonExistent Airport',
    });

    expect(result).toEqual([]);
  });

  // Test numeric comparisons
  it('filters by delay range correctly', () => {
    const result = searchFlights({
      minDelay: 15,
      maxDelay: 30,
    });

    expect(result.every((f) => f.depDelay >= 15 && f.depDelay <= 30)).toBe(true);
  });
});

describe('calculateDelayStats()', () => {
  // Test aggregation logic
  it('calculates correct average delays', () => {
    const stats = calculateDelayStats(mockFlights);

    expect(stats['AA'].averageDepDelay).toBe(5);  // (10 + 0) / 2
    expect(stats['DL'].averageDepDelay).toBe(30);  // Only 1 flight
  });

  // Test percentage calculation
  it('calculates delay percentage correctly', () => {
    const stats = calculateDelayStats(mockFlights);

    expect(stats['AA'].delayPercentage).toBe(0);    // 0 / 2 flights
    expect(stats['DL'].delayPercentage).toBe(100);  // 1 / 1 flight
  });

  // Test grouping
  it('groups flights by carrier', () => {
    const stats = calculateDelayStats(mockFlights);

    expect(stats).toHaveProperty('AA');
    expect(stats).toHaveProperty('DL');
    expect(stats['AA'].totalFlights).toBe(2);
    expect(stats['DL'].totalFlights).toBe(1);
  });
});
```

**Key Practices for Service Tests:**
- Mock external dependencies (file I/O, databases), not domain logic
- Test pure functions directly without HTTP/Express overhead
- Use fixtures same as route tests for consistency
- Test boundary conditions: empty results, single items, large datasets
- Verify aggregation/calculation accuracy with concrete numbers

---

### 6. Error Handling & Validation Testing

**Pattern: Mock pre-computed statistics, verify response structure**

```typescript
describe('GET /api/analytics/delays', () => {
  // Test required fields are present
  it('returns an analytics response with all required fields', async () => {
    const res = await request(app).get('/api/analytics/delays');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('delaysByCarrier');
    expect(res.body).toHaveProperty('delaysByDayOfWeek');
    expect(res.body).toHaveProperty('delaysByMonth');
    expect(res.body).toHaveProperty('topRoutes');
  });

  // Test sorting
  it('returns delays by carrier sorted by delayedFlights descending', async () => {
    const res = await request(app).get('/api/analytics/delays');

    expect(res.status).toBe(200);
    const carriers = res.body.delaysByCarrier;
    for (let i = 0; i < carriers.length - 1; i++) {
      expect(carriers[i].delayedFlights).toBeGreaterThanOrEqual(
        carriers[i + 1].delayedFlights
      );
    }
  });

  // Test data structure (keyed record vs array)
  it('returns delays by day of week as a keyed record', async () => {
    const res = await request(app).get('/api/analytics/delays');

    expect(res.status).toBe(200);
    expect(res.body.delaysByDayOfWeek).toHaveProperty('2');
    expect(res.body.delaysByDayOfWeek).toHaveProperty('4');
  });

  // Test limits
  it('limits topRoutes to 20 entries', async () => {
    const res = await request(app).get('/api/analytics/delays');

    expect(res.status).toBe(200);
    expect(res.body.topRoutes.length).toBeLessThanOrEqual(20);
  });
});
```

---

## Error Handling & Validation Testing

**Pattern: Test invalid inputs, constraints, and error responses**

```typescript
describe('GET /api/flights - Error Cases', () => {
  // Test invalid query parameters
  it('returns 400 for invalid page number', async () => {
    const res = await request(app).get('/api/flights?page=abc');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('page');
  });

  // Test boundary violations
  it('returns 400 for negative limit', async () => {
    const res = await request(app).get('/api/flights?limit=-10');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('limit must be positive');
  });

  // Test constraint enforcement
  it('returns 400 for limit exceeding maximum', async () => {
    const res = await request(app).get('/api/flights?limit=10000');

    expect(res.status).toBe(400);
    expect(res.body.limit).toBeUndefined();  // Should not be capped, should error
  });

  // Test required field validation
  it('returns 400 when required filter is missing', async () => {
    // If POST /api/flights/:id required origin in body:
    const res = await request(app)
      .post('/api/flights/search')
      .send({ destination: 'JFK' });  // Missing 'origin'

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('origin');
  });

  // Test 404 for non-existent resources
  it('returns 404 for non-existent flight ID', async () => {
    const res = await request(app).get('/api/flights/999999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  // Test 500 for server errors (optional: mock service failure)
  it('returns 500 when service throws error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});  // Suppress error log
    
    // Force service error (if testable)
    const res = await request(app)
      .get('/api/flights?badParam=causeError');

    // Depending on implementation: either 400 or 500
    expect([400, 500]).toContain(res.status);
    
    console.error.mockRestore();
  });
});

describe('POST /api/flights/search - Request Validation', () => {
  // Test missing required fields
  it('rejects request with missing required fields', async () => {
    const res = await request(app)
      .post('/api/flights/search')
      .send({});  // Empty body

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Test type validation
  it('rejects invalid data types', async () => {
    const res = await request(app)
      .post('/api/flights/search')
      .send({
        origin: 'ATL',
        minDelay: 'not-a-number',  // Should be number
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('minDelay');
  });

  // Test Content-Type validation
  it('rejects non-JSON requests', async () => {
    const res = await request(app)
      .post('/api/flights/search')
      .set('Content-Type', 'text/plain')
      .send('origin=ATL&minDelay=10');

    expect(res.status).toBe(400);
  });
});

describe('GET /api/analytics - Edge Cases', () => {
  // Test when no data available
  it('returns empty stats when no flights match filter', async () => {
    vi.mock('../services/dataService.js', () => ({
      calculateDelayStats: () => ({}),  // No carriers
      calculateDelayStatsByDayOfWeek: () => ({}),
      calculateDelayStatsByMonth: () => ({}),
      calculateRouteStats: () => [],
    }));

    const res = await request(app).get('/api/analytics/delays');

    expect(res.status).toBe(200);
    expect(Object.keys(res.body.delaysByCarrier)).toHaveLength(0);
    expect(Object.keys(res.body.delaysByDayOfWeek)).toHaveLength(0);
  });

  // Test null/undefined handling
  it('handles null statistics gracefully', async () => {
    const res = await request(app).get('/api/analytics/delays');

    expect(res.status).toBe(200);
    // Should not have null or undefined in response
    expect(JSON.stringify(res.body)).not.toContain('null');
  });
});
```

**Common HTTP Status Codes to Test:**

| Code | Scenario | Example |
|------|----------|---------|
| **200** | Success | GET returns data |
| **201** | Created | POST creates resource |
| **400** | Bad Request | Invalid query params, missing fields |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Unhandled exception (rare in tests) |

**Validation Testing Strategy:**
1. **Type validation** — Wrong data type (string instead of number)
2. **Boundary validation** — Values outside allowed range
3. **Required fields** — Missing mandatory parameters
4. **Format validation** — Invalid email, date, etc.
5. **Cross-field validation** — min > max, etc.
6. **Constraint enforcement** — Limits, caps, maximums

---

## Best Practices Checklist

### Before Writing Tests
- [ ] All TypeScript types defined in `src/types.ts`
- [ ] Service methods have clear input/output contracts
- [ ] Routes are mounted to a specific prefix (e.g., `/api/flights`)

### Creating Fixtures
- [ ] Mock data matches TypeScript interfaces exactly
- [ ] Include multiple scenarios (happy path, edge cases, boundaries)
- [ ] Use sensible real-world values
- [ ] Store in dedicated `fixtures.ts` file

### Mocking
- [ ] Mock calls come BEFORE route imports
- [ ] Mock return values match real service contracts
- [ ] Mock filtering/search logic to support test scenarios
- [ ] Use `.js` extensions for ESM module paths

### Service Unit Testing
- [ ] Test pure functions directly without Express layer
- [ ] Use same fixtures as route tests for consistency
- [ ] Test filtering, aggregation, calculation logic separately
- [ ] Verify boundary conditions: empty results, single items
- [ ] Test numeric accuracy: averages, percentages, totals

### Testing
- [ ] Test status codes first (200, 400, 404)
- [ ] Verify response shape with `toMatchObject()` or type assertion
- [ ] Test pagination, sorting, filtering separately
- [ ] Use `expect.any(Type)` for flexible field validation
- [ ] One assertion per "feature" (pagination vs filtering)
- [ ] Test both success (200) and error (400, 404, 500) paths
- [ ] Validate required fields and type constraints
- [ ] Test boundary conditions (empty results, limits, ranges)

### Organization
- [ ] Group related tests in `describe()` blocks by endpoint
- [ ] Name tests descriptively: "returns X when Y"
- [ ] Use sequential `it()` calls, not nested `describe()` in tests

---

## Common Assertions

```typescript
// Response status
expect(res.status).toBe(200);
expect(res.statusCode).toBe(404);

// Response shape
expect(res.body).toMatchObject({ page: 1, limit: 100 });
expect(res.body).toHaveProperty('data');
expect(res.body.data).toBeInstanceOf(Array);

// Array assertions
expect(res.body.data).toHaveLength(10);
expect(res.body.data).toEqual(expect.arrayContaining([...]));

// Type checking
expect(flight.carrier).toBe('AA');
expect(flight.year).toBe(2013);
expect(flight).toMatchObject({
  carrier: expect.any(String),
  year: expect.any(Number),
});

// Sorting/ordering
for (let i = 0; i < items.length - 1; i++) {
  expect(items[i].priority).toBeGreaterThanOrEqual(items[i + 1].priority);
}

// Keyed records
expect(res.body.stats).toHaveProperty('AA');
expect(res.body.stats['AA']).toMatchObject({ totalFlights: 5 });
```

---

## Running Tests

```bash
# Single run (CI/testing)
npm run test

# Watch mode (development)
npm run test:watch

# With coverage report
npm run test:coverage

# Run specific file
npm run test -- src/tests/flights.test.ts

# Run tests matching pattern
npm run test -- --grep "pagination"
```

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `Cannot find module` | ESM import missing `.js` extension | Change `import x from './y'` to `import x from './y.js'` |
| Mock not working | `vi.mock()` called after import | Move mock to top of test file, before route import |
| Wrong fixture data | Fixture fields don't match type | Compare fixture object keys with TypeScript interface |
| Test hangs | Async handler not awaited | Ensure `async` on test function: `it('...', async () => {})` |
| Port already in use | Leftover Supertest instance | Supertest doesn't bind ports; issue is elsewhere |

---

## Example Test File Structure

```typescript
// 1. Imports (types, vitest, express, supertest, fixtures)
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { mockFlights, mockAirports } from './fixtures.js';

// 2. Mock dependencies (BEFORE importing route)
vi.mock('../services/dataService.js', () => ({
  getAllFlights: () => mockFlights,
  getUniqueAirportNames: () => mockAirports.map((a) => a.name),
}));

// 3. Import route under test
const { default: flightsRouter } = await import('../routes/flights.js');

// 4. Set up test app
const app = express();
app.use(express.json());
app.use('/api/flights', flightsRouter);

// 5. Describe test suite
describe('GET /api/flights', () => {
  it('returns paginated flights', async () => {
    const res = await request(app).get('/api/flights');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      page: 1,
      limit: 100,
      total: expect.any(Number),
    });
  });

  it('respects page parameter', async () => {
    const res = await request(app).get('/api/flights?page=2&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(10);
  });
});
```

---

## Related Documentation

- [Vitest API Reference](https://vitest.dev/api/) — `describe`, `it`, `expect`, `vi.mock()`
- [Supertest Guide](https://github.com/visionmedia/supertest) — HTTP assertion library for Express
- [Jest Matchers](https://vitest.dev/api/expect.html) — Assertion methods (Vitest uses Jest-compatible API)
