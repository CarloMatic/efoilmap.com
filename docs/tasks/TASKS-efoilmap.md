# eFoilMap.com - Task List

## Phase 1: Compliance & Localization (✅ Completed)
- [x] **GDPR Cookie Consent**: Setup `CookieBanner` and blocked Mapbox.
- [x] **Internationalization (i18n)**:
    - [x] Established `dictionaries.ts` (EN, DE, ES, FR).
    - [x] Implemented `LanguageProvider` and `LanguageSwitcher`.
- [x] **Legal Pages**: Created Imprint/Privacy pages.
- [x] **Header Polish**: Unified header with Logo and Slogan.

## Phase 2: Search & Filters (✅ Completed)
- [x] **Database**: Defined `spots` table schema.
- [x] **Search UI**: Implemented `SearchBox` with Mapbox Geocoding.
- [x] **Filter UI**: Implemented `FilterBar` (Status, Amenities).
- [x] **Enhance Spot Dialog**
  - [x] Connect "Suggest Edit" button
  - [x] Separate Photo Upload from Verification
  - [x] Implement "Community Reviews" list
  - [x] Fix "Missing Token" flicker in Map
  - [x] Use Toast Notifications instead of Alert
  - [x] Fix State Reset on Spot Switch
  - [x] Fix RLS Policies for Anon Users (Reviews & Photos)
- [x] **Data Integration**:
    - [x] `npx supabase db reset` (Migrations fixed, requires manual restart).
    - [x] Fetch real spots in `Map.tsx`.
- [x] **Verification**: Verified UI functionality in browser.

## Phase 3: Community Features (✅ Completed)
- [x] **Add Spot**:
    - [x] Scaffold `AddSpotButton` and `AddSpotDrawer`.
    - [x] Implement "Add Spot" Form logic (UI & State).
    - [x] Fix "Add Spot" Drawer (Make it a Modal/Window).
- [x] Implement "Save Spot" logic (Form & DB Connection).
- [x] **Verify Spot**: "I was here" logic with **Star Rating** and **Comments**.
- [x] **Spot Details**: Photo Upload (Separate) & Suggest Edit (Connected).

## Phase 4: Polish & Deploy (🚧 In Progress)
- [x] Update Slogan/Meta for SEO (Localized).
- [x] Visual Polish: Blue Water & Button Transparency.
- [x] **Localization Deep Dive**:
    - [x] Localized all Forms (Add/Edit/Detail).
    - [x] Updated Main Title to "Gemeinsam die besten eFoil Spots finden".
- [x] **Features & Fixes**:
    - [x] **Auto-Rating**: Created DB Trigger for average rating calculation.
    - [x] **Photo-on-Create**: Allowed uploading photos while creating a spot.
    - [x] **Crash Fix**: Resolved `createSpot` return value format issue.
- [ ] Performance Audit.
- [ ] Final Deployment Prep.
