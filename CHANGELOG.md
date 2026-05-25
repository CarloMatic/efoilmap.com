# Changelog

All notable changes to this project will be documented in this file.

## [0.12.0] - 2026-05-25

### Added
- **Cinematic YouTube Video Modal**: Enabled detection of YouTube links (regular, mobile, shortcodes, and shorts) inside spot descriptions, rendering them as interactive red YouTube badges that open a gorgeous, full-screen aspect-video modal using embedded `<iframe>` elements and dynamic autoplay.
- **Layers Switcher Repositioning**: Moved the floating map style switcher widget from the bottom-left edge to `left-28`, placing it elegantly directly to the right of the Mapbox ScaleControl indicator for a more balanced layout.

## [0.11.0] - 2026-05-25

### Added
- **Image Lightbox Magnifier**: Implemented a stunning dark glassmorphic full-screen lightbox overlay (`z-index: 150`, `backdrop-blur-md`) allowing users to view full-resolution spot photos by clicking on them.
- **Photos Label Renaming**: Renamed the upload/existing photos section heading to `"Fotos"` (DE) / `"Photos"` (EN) across all 9 supported languages to provide a cleaner layout structure.
- **Enlarged Upload Previews**: Configured both existing photos lists and new file uploads/previews to be fully expandable in the edit dialog.

## [0.10.0] - 2026-05-25

### Added
- **Map View Switcher**: Designed a floating glassmorphic Layers selector widget allowing users to switch dynamically between Light, Dark, Satellite, and Outdoors/Terrain views.
- **Robust Layer Rendering**: Hardened layer paint routines with graceful fallback try-catch scopes to prevent crashes when switching raster map formats.
- **9 Platform Languages support**: Fully localized the map views selector labels for all supported locales.

## [0.9.0] - 2026-05-25

### Added
- **Spot Deletion**: Enabled creators and administrators to permanently delete spots directly from the edit modal.
- **Database RLS Policies**: Added a secure deletion RLS policy on the `spots` table to restrict deletion actions strictly to creators and global admins.
- **Dynamic State Refresh**: Re-engineered frontend Map and Drawer states to remove deleted spots instantly without full page reloads.
- **Unit Test Coverage**: Added comprehensive, 9-language translation dictionary checks for all new spot deletion elements.

## [0.8.0] - 2026-05-25

### Added
- **Spot Comments Renaming**: Shifted spot Q&As entirely into a sleek Comments ("Kommentare") system in 9 languages, while retaining technical structure for search engine FAQ schemas.
- **User Profile Likes**: Integrated interactive heart toggle widgets with live count updates on community profile cards.
- **Profile Ratings & Reviews**: Designed a glassmorphic 5-star profile rating widget and textual review timeline.
- **Review Replies & Deletions**: Enabled direct author and profile owner replies to reviews, with complete deletion support for authors, owners, and admins.
- **Direct Settings E-Mails**: Added a new "Spot-Kommentare" toggle setting to notification settings and generated direct settings link pathways in email footers.

## [0.7.0] - 2026-05-25

### Added
- **Spot Liking System**: Interactive heart toggle in spot dialog with live count sync.
- **Spot Bookmarks (Merkliste)**: Integrated spot saving with a "My Saved Spots" (Merkliste) tab in profile dialog.
- **Clickable Community Profiles**: Enabled clickable usernames and avatars everywhere to open a user profile dialog detailing contributed spots and planned visits.
- **Amenities Refactoring**: Reorganized cluttered spot options into a polished 2x2 glassmorphic facts grid.
- **Search Engine Optimization**: Complete dynamic SEO sitemap support, Place dynamic structured data, and server-side SSR search engine crawler directories.

### Fixed
- **Creator Username Fallback**: Synchronized database creator mapping columns (`created_by`) to fix fallback placeholder `@efoiler` tag.
- **Multi-Device Notification Sync**: Integrated server-side read timestamp tracking to keep unread badges synchronized across all devices.

## [0.4.0] - 2026-05-25

### Added
- **Notification Center**: New notification center next to the user profile with live unread badge for interaction alerts.
- **Comment Management**: Users can now edit or delete their own comments on spot visits and delete their own spot reviews.
- **Admin Moderation**: Admins (callematic@gmail.com) can now delete any spot review or visit comment directly from the UI.
- **Filter Updates**: Added a "Not Forbidden" status filter (excluding 'forbidden' spots) and auto-closing map filters when clicking outside.
- **Reactions UI Fixes**: Fixed visit comment button logic to say "Join" vs "Cancel" correctly when you are the creator or simply a participant.

### Changed
- **Privacy & Imprint**: Updated privacy policy to reflect new data handling features and updated imprint contact info in all languages.

## [0.2.1] - 2026-05-16

### Added
- **Full Localization**: Localized Profile Edit, Profile Setup, and Auth components across all languages (EN, DE, ES, FR).
- **Expanded Dictionary**: Added missing keys for profile management and community interactions.

## [0.2.0] - 2026-05-16

### Added
- **Image Compression**: Automatic WebP compression (max 1200px) for spot photos to optimize storage and performance.
- **Improved Review Authors**: Displaying raw usernames in reviews (removing the @ prefix and "Community User" fallback).

### Fixed
- **Suggest Edit Pre-fill**: Fixed an issue where previous "Add Spot" location data would prevent existing spot values from pre-filling in the suggestion form.
- **Photo Upload Type Safety**: Restricted uploads to images only using `accept="image/*"` and `image/webp` content type.

### Changed
- Shared `compressImage` utility moved to `@/lib/image-utils` for consistency between profile and spot photos.

## [0.1.0] - Initial Release
- Basic map functionality with Mapbox.
- Supabase integration for spots and auth.
- Multi-language support (EN, DE, ES, FR).
