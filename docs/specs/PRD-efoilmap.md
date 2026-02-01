# PRD: efoilmap.com

## 1. The Validation (Lean Canvas)
*   **Problem**: E-Foilers struggle to find legal or suitable spots to ride. Local regulations are often unclear, and finding good entry points relies on word-of-mouth.
*   **Customer Segment**: E-Foil owners and renters looking for new locations.
*   **Unique Value Proposition**: A crowd-sourced, focused map dedicated solely to E-Foiling spots with clear "Allowed/Tolerated" status.
*   **Unfair Advantage**: Niche focus (unlike generic boating maps), community-driven updates.
*   **Kill Criteria**: 
    *   Inability to verify "Allowed/Tolerated" status accurately (safety/legal risk).
    *   Costs of Map APIs exceeding value in early stage.

## 2. The Press Release (Working Backwards)
> **The Waze for E-Foiling is Here**
> 
> **AACHEN, Germany** – Riders of electric hydrofoils finally have a home. Today marks the launch of **efoilmap.com**, a mobile-first web application designed to answer the #1 question in the community: *"Where can I ride?"*
> 
> Until now, enthusiasts had to scour forums or guess local regulations, risking fines or dangerous conditions. **efoilmap.com** changes this by putting a live, community-edited global map in your pocket.
> 
> "I used to drive for hours hoping a lake was rideable, only to be turned away," says Max, an early beta tester from Bavaria. "With efoilmap, I check the map, see the green pins, and go straight to the water."
> 
> The app launches today as a streamlined web experience, accessible on any smartphone without a download.

## 3. Functional Requirements (The "What")
*   **Core UI (The Map)**: 
    *   **Immediate Access**: Homepage loads directly into full-screen map.
    *   **Geolocation**: Auto-centers on user location if permitted (shows nearby spots).
    *   **Pins**: Color-coded pins (Green=Allowed, Yellow=Tolerated, Red=Forbidden).
    *   **One-Handed UX**: All primary controls (Search, Add Spot, Filters) reachable with a thumb at the bottom of the screen. No top-left buttons.
    *   **Spot Detail UI**: 
        *   **Interaction**: Click marker -> Open Bottom Sheet (Mobile) / Side Panel (Desktop).
        *   **Content Hierarchy**: 
            1. Name + Legal Status.
            2. Core Info (Legal, Entry, Parking).
            3. Infrastructure (Charging, Food).
            4. Photos.
            5. Tips & Reviews.
            6. "Last Verified" Date.
*   **Spot Management**:
    *   **Add Spot (Speed < 2 mins)**: 
        *   **Workflow**: 
            1.  **Pin**: User centers map crosshair and clicks "Set Location".
            2.  **Basics (Mandatory)**: Name + Status + EntryType.
            3.  **Details (Optional)**: Progressive sections for Infrastructure/Photos.
        *   **Principle**: Progressive Disclosure (Don't confirm overwhelming forms).
    *   **Data Fields**: 
        *   **Core**: Name, Coordinates, Country/Region (Auto), Legal Status (Allowed/Tolerated/Unclear/Forbidden), Entry Accessibility (Possible/Difficult/Impossible).
        *   **Attributes**: Parking close (Yes/No/Unclear), Distance Car->Water, Entry Surface, Water Type, Crowd Level, Conflict Potential.
        *   **Infrastructure**: Charging (Yes/No), Charging Type, Distance Charger->Entry.
        *   **Gastronomy**: Food avail (Yes/No), Distance, Type.
        *   **Optional**: Text Tips, Photos.
    *   **Read Access**: Open to all (No Login required to view/filter).
*   **Community Features**:
    *   **Spot Verification**: Button "I was here & it works". Updates "Last Verified [Date]".
    *   **Comments**: Simple text comments for updates/warnings.
    *   **Reputation**: Implicit only (no badges/points in MVP).
    *   **Filter Logic**: 
        *   **Always Visible**: Filter controls accessible immediately (e.g., sticky bottom bar or top scrollable list).
        *   **Instant**: Map updates immediately upon selection (no "Apply" button).
        *   **Combinable**: Multiple filters work together (AND logic).
        *   **Inclusive Behavior**: Filtering for a feature (e.g., "Charging") includes confirmed "Yes" AND "Unknown" (Null), unless user explicitly toggles "Verified Only/Strict Mode". Missing data should not hide a spot by default.
*   **Tech Constraints**:
    *   Mobile-First Web App (PWA ready).
    *   **Fast load times**: Critical for mobile usage on data. (Target < 1.5s LCP).

## 4. Tone of Voice
*   **Style**: Clear, Direct, Rider-to-Rider.
*   **Avoid**: Legalese or bureaucratic warnings.
*   **Format**: "Users say riding is fine here" instead of "Authorized by municipal code". Focus on shared experience.

## 5. Non-Goals (The "Anti-Scope")
*   ❌ Native iOS/Android App Store release (V1 is Web only).
*   ❌ Social Networking (No friends lists, DMs, or "who is riding now" tracking for V1).
*   ❌ Booking/Rentals (No commercial transactions for V1).
*   ❌ Complex Offline Mode (Basic caching only).
