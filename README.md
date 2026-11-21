# Happy Tripod — Alpha Build (PWA)

A progressive web application designed to help photographers discover great photo locations worldwide and plan travel routes to capture pictures along the way.

---

## Changelog & Version History

### Version 1.4.2-alpha (2026-11-19)
* **Centered Home Banner Overlay:** Consolidated `.homeBannerOverlay` into a single rule with `align-items: center` and `text-align: center`, accompanied by explicit `.homeBannerOverlay h1` and `.homeBannerOverlay p` rules for clean banner typography control.
* **Offline Service Worker:** Updated cache version to `happytripod-v1.4.2-alpha`.

### Version 1.4.1-alpha (2026-11-19)
* **Carousel Portrait & Letterbox Fitting:** Updated `.carouselWrapper` and `.carouselSlide` to a `#000000` black background with `object-fit: contain` on images (`max-width: 100%; max-height: 100%; width: auto; height: auto;`) so portrait and landscape images fit inside the fixed-height container without cropping or jumping, filling side margins with pure black.
* **Width-Matched Banner & Responsive Overlay Typography:** Updated `.homeBanner` and `.homeBanner img` to match the full card width cleanly (`width: 100%; height: auto; max-height: 340px; object-fit: cover;`) and scaled overlying banner text using fluid `clamp()` sizing so headlines and subtext remain readable across viewports.
* **Offline Service Worker:** Updated cache version to `happytripod-v1.4.1-alpha`.

### Version 1.4.0-alpha (2026-11-19)
* **Cross-Platform Mobile Browser Consistency:** Normalized form controls, buttons, inputs, and scrollbars (`appearance: none`, explicit border/font/color resets) so visual affordances and behavior remain 100% consistent across iOS Safari, Android Chrome, and desktop browsers without relying on OS-level styling.
* **About Images Relocated:** Moved `about.jpg` and `aboutfooter.jpg` references to `images/about/about.jpg` and `images/about/aboutfooter.jpg`.
* **Navigation & Title Bar Enhancements:**
  * Updated navigation button label from `Add Spot` to `Add Place`.
  * Added live version badge (`v1.4.0-alpha`) to the header title bar.
  * Added `Concise` / `Verbose` mode toggle buttons in the header to switch between streamlined and detailed card/UI views across the app.
* **Fixed-Height Carousel Container:** Locked `.carouselWrapper` and `.carouselSlide` dimensions (`height: 360px` on desktop, `240px` on mobile, `flex-shrink: 0`) so elements below the carousel never jump or shift when switching slides.

### Version 1.3.1-alpha (2026-11-17)
* **Header Compact Refinement:** Changed `Add Location` button label to `Add Spot`, reduced `.nav-btn` padding and font size, and made `#locationCountDisplay` render across two compact lines.

### Version 1.3.0-alpha (2026-11-17)
* **Header Layout Redesign:** Restructured header layout with title and live location count above the navigation bar.

### Version 1.2.0-alpha (2026-11-17)
* **Navigation & Layout:** Added Home, Explore, Routing, Add Location, and About views.

### Version 1.1.0-alpha (2026-11-12)
* Decoupled location seed data from `app.js` into `location_data.json` (25 locations).

### Version 1.0.0-alpha (2026-11-12)
* Initial implementation of the zero-cost vanilla PWA architecture.

---

## Project Setup Instructions

1. **Prerequisites:**
   * Install [Microsoft VS Code](https://code.visualstudio.com/).
   * Install the **Live Server** extension in VS Code.

2. **Image Assets Placement:**
   * Place your banner image at `images/banner/banner-12.jpg`.
   * Place your carousel images in `images/carousel/`.
   * Place `about.jpg` and `aboutfooter.jpg` in `images/about/`.

3. **Local Development Setup:**
   * Extract the project archive into a local workspace folder.
   * Open the folder in VS Code.
   * Right-click `index.html` and select **"Open with Live Server"**.
