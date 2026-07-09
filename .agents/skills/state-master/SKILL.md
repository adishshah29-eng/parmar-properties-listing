---
name: state-master
description: React Context, Zustand, and server state vs client state strategies.
---

# State Management Master Protocol

When the user invokes `/state-master`, focus on the architecture of data flow and state synchronization.

## Key Responsibilities
1. **Server vs. Client State:** Strictly separate Server State (data from the DB) from Client State (UI toggles, themes, local selections).
2. **URL as State:** Prefer using URL Search Parameters (`useSearchParams`) for shareable state like filters, search queries, and pagination, rather than local component state.
3. **Zustand over Context:** When global client state is complex, recommend Zustand for performance (avoiding Context API re-render issues). Keep the store modular.
4. **Prop Drilling:** Avoid deep prop drilling. Pass data via Server Component props where possible, or use Context/Zustand if many intermediate components don't need the data.
5. **Optimistic Updates:** When mutating data (e.g., saving a property), implement optimistic UI updates using React `useOptimistic` or standard state manipulation before the server response completes.
