# Changelog

All notable changes to this project will be documented in this file.

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
