# TASKS: efoilmap.com Implementation Plan

## Phase 1: Foundation & Setup
- [ ] **Project Initialization**
    - [ ] Create Next.js App (`create-next-app` with TS, Tailwind, ESLint).
    - [ ] Setup Directory Structure (`components`, `lib`, `types`).
    - [ ] *Verification*: `npm run dev` loads default page.
- [ ] **UI Framework Setup**
    - [ ] Define CSS Variables for Colors (Dark Mode support).
    - [ ] Install Icons (Lucide React).
    - [ ] *Verification*: Check `index.css` and a sample component.
- [ ] **Mapbox Integration**
    - [ ] Install `mapbox-gl` and `react-map-gl` (or similar wrapper).
    - [ ] Get Mapbox Public Token (User needs to provide?).
    - [ ] *Verification*: Render a basic map centered on Aachen (default).

## Phase 2: Database & Backend (Supabase)
- [ ] **Supabase Setup**
    - [ ] Init Supabase project (local or cloud).
    - [ ] *Verification*: Connection string active.
- [ ] **Schema Migration: Spots**
    - [ ] Enable PostGIS extension.
    - [ ] Create `spots` table with columns: `name`, `status`, `location` (geography), `data` (jsonb for attributes).
    - [ ] Create `profiles` table.
    - [ ] *Verification*: SQL script inserts a test spot.
- [ ] **Backend API (Server Actions)**
    - [ ] Action: `getSpots(bounds)`
    - [ ] Action: `createSpot(data)`
    - [ ] *Verification*: Unit test calls action and retrieves data.

## Phase 3: Core Feature - The Map (Read)
- [ ] **Map Component**
    - [ ] Implement `Map.tsx` full screen.
    - [ ] Add User Location control.
    - [ ] *Verification*: Browser check - map loads and asks for location.
- [ ] **Spot Markers**
    - [ ] Fetch spots from Supabase.
    - [ ] Render custom markers (Green/Yellow/Red).
    - [ ] *Verification*: Mock data appears on map.
- [ ] **Spot Preview Card**
    - [ ] Tap marker -> Show bottom sheet summary.
    - [ ] One-handed 'close' gesture.
    - [ ] *Verification*: Interactive check.

## Phase 4: Core Feature - Add Spot (Write)
- [ ] **Auth Modal**
    - [ ] Supabase Auth UI (Magic Link / OTP).
    - [ ] *Verification*: Login flow works.
- [ ] **Add Spot UI (Wizard Pattern)**
    - [ ] **Step 1: Location**: Map view with fixed center crosshair. "Set Location" button.
    - [ ] **Step 2: Core Info**: Simple form (Name, Status Toggle, Entry Select). "Next" or "Save & Exit".
    - [ ] **Step 3: Details**: Accordions for Infrastructure/Photos. "Publish".
    - [ ] *Verification*: Time the flow to ensure < 2 minutes.

## Phase 5: Spot Details & Polish
- [ ] **Detail View (Bottom Sheet / Side Panel)**
    - [ ] Implement robust drawer component (Vaul for React or Framer Motion drag).
    - [ ] **Section 1**: Header (Name + Status Badge + Close Button).
    - [ ] **Section 2**: Core Info Grid (Icons for Entry, Parking, etc).
    - [ ] **Section 3**: Infrastructure List.
    - [ ] **Section 4**: Photo Carousel.
    - [ ] **Section 5**: Comments List.
    - [ ] **Footer Actions**: 
        - [ ] "Confirm Spot" button (Updates `last_verified_at`).
        - [ ] "Report Issue" button.
- [ ] **Filtering System**
    - [ ] Determine UI placement (Sticky pill list? Bottom sheet handle?).
    - [ ] Implement Filter State Context (Zustand or React Context).
    - [ ] Implement "Instant" client-side filtering (unless > 1000 spots, then server).
    - [ ] Logic: `if (filter.charging && (spot.charging === false)) return false; return true;` (Keep existing + nulls).
    - [ ] Add "verified only" toggle to exclude nulls.
- [ ] **PWA Manifest**
    - [ ] Icons and manifest.json.
    - [ ] *Verification*: Lighthouse PWA check.
