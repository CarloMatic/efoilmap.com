# Architecture: efoilmap.com

## 1. System Context (C4)
[Rider] -> [Web App (Next.js)] -> [Rest API (Supabase)] -> [Database (PostgreSQL + PostGIS)]
                                -> [Mapbox API (Maps/Geocoding)]

## 2. Domain Model (DDD)
*   **Aggregate**: Spot (Root)
    *   **Entity**: Location (GeoJSON Point)
        *   *Attributes*: `lat`, `lng`, `country`, `region` (auto-fetched via geocoding)
    *   **Value Object**: LegalStatus (ALLOWED, TOLERATED, UNCLEAR, FORBIDDEN)
    *   **Value Object**: Reachability
        *   `access_difficulty`: (EASY, HARD, IMPOSSIBLE)
        *   `parking_close`: boolean
        *   `distance_car_water`: integer (meters)
        *   `entry_surface`: string (sand, stones, concrete, etc)
    *   **Value Object**: Environment
        *   `water_type`: (LAKE, RIVER, SEA)
        *   `crowd_level`: (EMPTY, MEDIUM, CROWDED)
        *   `conflict_potential`: string (e.g. "fishermen", "swimmers")
    *   **Entity**: Infrastructure
        *   `charging_available`: boolean
        *   `charging_type`: string
        *   `distance_charger`: integer
    *   **Entity**: Gastronomy
        *   `available`: boolean
        *   `distance`: integer
        *   `type`: string
    *   **Entity**: SpotImage (URL + metadata)
    *   **Entity**: Review (Rating + Text)
*   **Aggregate**: User
    *   **Entity**: Profile (User details, no public statistics in MVP)

## 3. Key Decisions (ADRs)
*   **[ADR-001]: Use Supabase + PostGIS**
    *   **Context**: We need to store and query geospatial data (find spots within radius) and handle auth.
    *   **Decision**: Supabase offers native PostGIS support and easy Auth. No need for custom backend.
    *   **Trade-off**: Vendor lock-in, but speed is paramount.
*   **[ADR-002]: Use Mapbox GL JS**
    *   **Context**: Requirement for "Premium Design" and smooth mobile interaction.
    *   **Decision**: Mapbox provides vector tiles for smooth zooming/rotation and `Studio` for custom "wow" styling.
    *   **Trade-off**: Cost after 50k loads, but better UX than Leaflet.
*   **[ADR-003]: Next.js + PWA**
    *   **Context**: "Mobile-first Web App".
    *   **Decision**: Use Next.js for easy definition of PWA manifest and route handling.
*   **[ADR-004]: Vanilla CSS + Design Tokens**
    *   **Context**: Requirements standard.
    *   **Decision**: Use CSS Variables for the "Design System" (Colors, Spacing) to ensure the "Premium" look is consistent. 

## 4. Failure Modes
*   **Risk**: Mapbox API Key quota exceeded.
*   **Mitigation**: Implement frontend caching (SWR) for spot data; investigate caching strategy for map tiles is hard, so set billing alerts.
*   **Risk**: Bad Data (Spots on land).
*   **Mitigation**: PostGIS constraints? Mostly community moderation (Report button).

## 5. Security
*   **RLS (Row Level Security)**:
    *   `spots`: Public Read, Authenticated Insert.
    *   `reviews`: Public Read, Authenticated Insert (author_id = auth.uid()).
