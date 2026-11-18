# Happy Tripod — Alpha Build (PWA)

A progressive web application designed to help photographers discover great photo locations worldwide and plan travel routes to capture pictures along the way.

---

## Changelog & Version History

### Version 1.3.1-alpha (2026-11-17)
* **Header Compact Refinement:** Incorporated user refinements to compact mobile header fit: changed `Add Location` button label to `Add Spot`, reduced `.nav-btn` padding (`6px 4px`) and font size (`0.8rem`).
* **Two-Line Location Counter:** Updated `#locationCountDisplay` to render across two compact lines (`25 locations` / `worldwide`) with a reduced font size (`0.8rem`, `line-height: 1.2`).
* **Offline Service Worker:** Updated cache version to `happytripod-v1.3.1-alpha`.

### Version 1.3.0-alpha (2026-11-17)
* **Header Layout Redesign:** Restructured header matching the reference image layout. The title ("📷 Happy Tripod") sits on the left alongside the live location count (`xx locations worldwide`), while the navigation buttons (`Home`, `Explore`, `Routing`, `Add Location`, `About`) are grouped neatly on a second line beneath the title/count section with the active view highlighted in Neon Purple.
* **Offline Service Worker:** Updated cache version to `happytripod-v1.3.0-alpha`.

### Version 1.2.0-alpha (2026-11-17)
* **Navigation & Layout:** Standardized top-right navigation bar across all views containing `Home`, `Explore`, `Routing`, `Add Location`, and `About`.
* **Home View Added:** Added hero banner referencing `images/banner/banner-12.jpg`, an interactive image carousel sourcing from `images/carousel/`, and recent photo location cards.
* **Explore & Routing Split:** Moved the interactive Leaflet.js map from the Explore view to the Routing view, pairing it directly with start/destination route controls and off-route distance filtering. Explore view now focuses on a clean, searchable/filterable card grid.
* **About View Added:** Implemented full narrative About page layout with `about.jpg`, `aboutfooter.jpg`, mission list, community contribution prompt, `codesplat@gmail.com` contact link, and `Happy Tripod 2026` footer.

### Version 1.1.0-alpha (2026-11-12)
* Decoupled location seed data from `app.js` into a dedicated `location_data.json` file.
* Expanded the seed dataset from 3 to 25 curated photography locations across California and the American West.

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
   * Place `about.jpg` and `aboutfooter.jpg` in the root folder.

3. **Local Development Setup:**
   * Extract the project archive into a local workspace folder.
   * Open the folder in VS Code.
   * Right-click `index.html` and select **"Open with Live Server"**.
