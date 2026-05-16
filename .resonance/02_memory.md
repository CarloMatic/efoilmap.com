# Incident: Critical State Loop in Map.tsx
**Root Cause**: `setFilteredSpots` was called synchronously inside a `useEffect` that depended on `filters` and `spots`. This caused a potential infinite render loop and performance degradation, flagged by `react-hooks/set-state-in-effect`.

**Fix**: 
1. Refactored `filteredSpots` to use `useMemo`, eliminating the need for `useState` and `useEffect` entirely for this logic.
2. Removed redundant `token` state sync effect in `Map.tsx`.

**Verification**: 
- `npm run lint` no longer reports `set-state-in-effect` for `Map.tsx`.
- Remaining errors in `i18n.tsx` and `CookieConsent.tsx` are related to hydration (reading localStorage) and are less critical (run once on mount), though they should be refactored to `useSyncExternalStore` in the future.

**Prevention**: Enforced "Derived State" rule: If it can be calculated during render, do not put it in state/effect.
