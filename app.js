// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('ServiceWorker registered successfully:', reg.scope))
            .catch(err => console.error('ServiceWorker registration failed:', err));
    });
}

const STORAGE_KEY = 'happy_tripod_locations_v1_3_1_alpha';

const CAROUSEL_IMAGES = [
    { src: 'images/carousel/carousel-1.jpg', caption: 'Golden Hour Landscapes' },
    { src: 'images/carousel/carousel-2.jpg', caption: 'Coastal & Seascape Vistas' },
    { src: 'images/carousel/carousel-3.jpg', caption: 'Mountain & Alpine Peaks' },
    { src: 'images/carousel/carousel-4.jpg', caption: 'Wildlife & Night Sky Spots' }
];

const state = {
    currentView: 'home',
    locations: [],
    searchQuery: '',
    carouselIndex: 0,
    focusedLocationId: null
};

async function loadLocations() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                state.locations = parsed;
                return;
            }
        } catch (e) {
            console.warn('Error parsing stored locations, falling back to JSON seed file.');
        }
    }

    try {
        const response = await fetch('location_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const seedLocations = await response.json();
        state.locations = seedLocations;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedLocations));
    } catch (error) {
        console.error('Failed to load location_data.json:', error);
        state.locations = [];
    }
}

function router() {
    const hash = window.location.hash.replace('#', '') || 'home';
    state.currentView = hash;

    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.target === hash) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderView();
}

window.addEventListener('hashchange', router);

function renderView() {
    const main = document.getElementById('appMain');
    const countDisplay = document.getElementById('locationCountDisplay');
    if (countDisplay) {
        countDisplay.innerHTML = `${state.locations.length} locations<br>worldwide`;
    }

    if (state.currentView === 'home') {
        renderHomeView(main);
    } else if (state.currentView === 'explore') {
        renderExploreView(main);
    } else if (state.currentView === 'routing') {
        renderRoutingView(main);
    } else if (state.currentView === 'add') {
        renderAddView(main);
    } else if (state.currentView === 'about') {
        renderAboutView(main);
    } else {
        window.location.hash = '#home';
    }
}

function renderHomeView(container) {
    const recentSpots = state.locations.slice(0, 4);

    container.innerHTML = `
        <section class="homeBanner">
            <img src="images/banner/banner-12.jpg" alt="Happy Tripod Banner" onerror="this.style.display='none'">
            <div class="homeBannerOverlay">
                <h1>Find your best photo today!</h1>
                <p>Explore curated photography locations and plan scenic routes anywhere on earth.</p>
            </div>
        </section>

        <section class="carouselSection">
            <h2 class="sectionHeading">Featured Photo Inspiration</h2>
            <div class="carouselWrapper" id="carouselContainer">
                <button class="carouselBtn prev" aria-label="Previous slide" onclick="stepCarousel(-1)">&#10094;</button>
                <div class="carouselSlide" id="carouselSlideContent"></div>
                <button class="carouselBtn next" aria-label="Next slide" onclick="stepCarousel(1)">&#10095;</button>
                <div class="carouselIndicators" id="carouselDots"></div>
            </div>
        </section>

        <section>
            <h2 class="sectionHeading">Most Recent Submissions</h2>
            <div class="exploreGrid">
                ${recentSpots.map(loc => `
                    <div class="locationCard">
                        <div>
                            <h3>${loc.title}</h3>
                            <p>${loc.description}</p>
                        </div>
                        <div class="locationCardMeta">
                            <span>${loc.county}</span>
                            <button class="viewOnMapLink" onclick="openLocationOnMap('${loc.id}')">View on Map</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    updateCarouselSlide();
}

function updateCarouselSlide() {
    const slideEl = document.getElementById('carouselSlideContent');
    const dotsEl = document.getElementById('carouselDots');
    if (!slideEl || !dotsEl) return;

    const current = CAROUSEL_IMAGES[state.carouselIndex];
    slideEl.innerHTML = `
        <img src="${current.src}" alt="${current.caption}"
             onerror="this.parentElement.innerHTML='<div class='carouselFallback'><strong>${current.caption}</strong><br><small>Add image file: ${current.src}</small></div>'">
    `;

    dotsEl.innerHTML = CAROUSEL_IMAGES.map((_, idx) => `
        <button class="carouselDot ${idx === state.carouselIndex ? 'active' : ''}"
                aria-label="Slide ${idx + 1}"
                onclick="setCarouselSlide(${idx})"></button>
    `).join('');
}

function stepCarousel(direction) {
    state.carouselIndex = (state.carouselIndex + direction + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
    updateCarouselSlide();
}

function setCarouselSlide(index) {
    state.carouselIndex = index;
    updateCarouselSlide();
}

function openLocationOnMap(locId) {
    state.focusedLocationId = locId;
    window.location.hash = '#routing';
}

function renderExploreView(container) {
    const filtered = state.locations.filter(loc => {
        const q = state.searchQuery.toLowerCase();
        return (
            loc.title.toLowerCase().includes(q) ||
            loc.description.toLowerCase().includes(q) ||
            loc.county.toLowerCase().includes(q)
        );
    });

    container.innerHTML = `
        <div class="exploreHeaderBar">
            <h2 class="sectionHeading" style="margin-bottom: 0;">Explore Locations (${filtered.length})</h2>
            <input type="search" id="exploreSearchInput" class="searchInput"
                   placeholder="Search by title, description, or county..."
                   value="${state.searchQuery}">
        </div>
        <div class="exploreGrid" id="exploreCardsGrid">
            ${filtered.map(loc => `
                <div class="locationCard">
                    <div>
                        <h3>${loc.title}</h3>
                        <p>${loc.description}</p>
                    </div>
                    <div class="locationCardMeta">
                        <span>${loc.county}</span>
                        <button class="viewOnMapLink" onclick="openLocationOnMap('${loc.id}')">View on Map</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const searchInput = document.getElementById('exploreSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderExploreView(container);
            const restoredInput = document.getElementById('exploreSearchInput');
            if (restoredInput) {
                restoredInput.focus();
                restoredInput.setSelectionRange(restoredInput.value.length, restoredInput.value.length);
            }
        });
    }
}

function renderRoutingView(container) {
    container.innerHTML = `
        <div class="routingSplitLayout">
            <div class="routingSidebar">
                <h2 style="color: var(--electric-teal);">Route & Map Explorer</h2>
                <p style="color: var(--text-muted); font-size: 0.9rem;">
                    Plan your route waypoints and inspect photography locations on the map.
                </p>
                <div class="formGroup">
                    <label>Start Location</label>
                    <input type="text" id="routeStart" placeholder="Enter starting city or coordinates...">
                </div>
                <div class="formGroup">
                    <label>End Destination</label>
                    <input type="text" id="routeEnd" placeholder="Enter destination...">
                </div>
                <div class="formGroup">
                    <label id="distanceLabel">Off-route distance (miles): 5</label>
                    <input type="range" min="0" max="50" value="5" style="width:100%;"
                           oninput="document.getElementById('distanceLabel').textContent = 'Off-route distance (miles): ' + this.value">
                </div>
                <button class="submit-btn" onclick="alert('Route calculation simulated! Showing all available locations on map.')">
                    Find Spots Along Route
                </button>
            </div>
            <div class="mapContainer">
                <div id="map"></div>
            </div>
        </div>
    `;

    setTimeout(() => {
        if (window.mapInstance) {
            window.mapInstance.remove();
        }
        const map = L.map('map').setView([37.8, -119.5], 5);
        window.mapInstance = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const markersById = {};
        state.locations.forEach(loc => {
            if (loc.lat && loc.lng) {
                const marker = L.marker([loc.lat, loc.lng]).addTo(map)
                    .bindPopup(`<b>${loc.title}</b><br>${loc.description}<br><i>${loc.county}</i>`);
                markersById[loc.id] = marker;
            }
        });

        if (state.focusedLocationId && markersById[state.focusedLocationId]) {
            const targetLoc = state.locations.find(l => l.id === state.focusedLocationId);
            if (targetLoc) {
                map.setView([targetLoc.lat, targetLoc.lng], 12);
                markersById[state.focusedLocationId].openPopup();
            }
            state.focusedLocationId = null;
        }
    }, 50);
}

function renderAddView(container) {
    container.innerHTML = `
        <div class="formContainer">
            <h2 style="color: var(--hot-pink); margin-bottom: 16px;">Share a Photo Location</h2>
            <form id="addLocationForm" onsubmit="handleLocationSubmit(event)">
                <div class="formGroup">
                    <label>Location Title</label>
                    <input type="text" id="locTitle" required placeholder="e.g., Sunset Ridge">
                </div>
                <div class="formGroup">
                    <label>Description & Tips</label>
                    <textarea id="locDesc" rows="3" required placeholder="Best time to shoot, parking info..."></textarea>
                </div>
                <div class="formGroup">
                    <label>Region / County</label>
                    <input type="text" id="locCounty" required placeholder="e.g., Alameda County, CA">
                </div>
                <div class="formGroup">
                    <label>Latitude</label>
                    <input type="number" step="any" id="locLat" required placeholder="37.5483">
                </div>
                <div class="formGroup">
                    <label>Longitude</label>
                    <input type="number" step="any" id="locLng" required placeholder="-121.9886">
                </div>
                <button type="submit" class="submit-btn">Save Location</button>
            </form>
        </div>
    `;
}

function handleLocationSubmit(e) {
    e.preventDefault();
    const newLoc = {
        id: 'loc-' + Date.now().toString(),
        title: document.getElementById('locTitle').value,
        description: document.getElementById('locDesc').value,
        county: document.getElementById('locCounty').value,
        lat: parseFloat(document.getElementById('locLat').value),
        lng: parseFloat(document.getElementById('locLng').value)
    };

    state.locations.unshift(newLoc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.locations));
    alert('Location successfully added!');
    window.location.hash = '#explore';
}

function renderAboutView(container) {
    container.innerHTML = `
        <article class="aboutContainer">
            <h1 class="aboutHeading">Why HappyTripod?</h1>
            <figure class="aboutFigure">
                <img src="about.jpg" alt="Curious Mike fighting for the image">
                <figcaption>Curious Mike fighting for the image</figcaption>
            </figure>

            <p class="aboutParagraph">
                When my friend Bruce asked why there wasn't a good, free website to find cool places to take photos at I had to pause. Was this true? Certainly in this day and age there must be dozens and dozens of websites that do exactly that. But the more I looked, the more I discovered that a simple application to show you photo locations nearby didn't exist.
            </p>
            <p class="aboutParagraph">
                So, HappyTripod was born.
            </p>
            <p class="aboutParagraph">
                It has two main purposes.
            </p>
            <ol class="aboutList">
                <li>Allow you to explore anywhere on earth and find interesting subjects to photograph</li>
                <li>Allow you to plan a route; you should then be able to pick locations along that route to photograph</li>
            </ol>

            <h2 class="aboutSubHeading">We need your help.</h2>
            <figure class="aboutFigure">
                <img src="aboutfooter.jpg" alt="I'm going to build a new website honey!">
                <figcaption>I'm going to build a new website honey!</figcaption>
            </figure>

            <p class="aboutParagraph">
                HappyTripod needs your help to succeed. The primary method you can help is to
                <a href="#add" class="aboutLink">share photo locations with others.</a>
            </p>
            <p class="aboutParagraph">
                When adding your location, take the time to add a good description of the location and add as accurate of a GPS location as possible.
            </p>
            <p class="aboutParagraph">
                Other ways to help include reviewing locations and ranking any you visit; taking the time to flag any content that the community might find offensive.
            </p>
            <p class="aboutParagraph">
                Feedback? I want to hear it. Concerns? I want to hear that too.
            </p>
            <p class="aboutParagraph">
                <a href="mailto:codesplat@gmail.com?subject=Happy%20Tripod%20Feedback" class="aboutLink">Email me</a>
            </p>
            <p class="aboutParagraph" style="margin-top: 20px; font-weight: 600; color: var(--text-muted);">
                Happy Tripod 2026
            </p>
        </article>
    `;
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadLocations();
    if (!window.location.hash) {
        window.location.hash = '#home';
    } else {
        router();
    }
});
