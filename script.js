
document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // MOBILE MENU
  // ==============================
  const menuButton = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ==============================
  // PAGE ANIMATIONS
  // ==============================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  const leafletElement = document.getElementById("leaflet-map");
  const olElement = document.getElementById("openlayers-map");

  const OSM_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  }

  // ==============================
  // FIRST MAP - ANKARA STUDY SPOTS
  // ==============================
  const places = [
    {
      name: "Presidential National Library",
      area: "Beştepe",
      type: "library",
      lat: 39.92510931112273,
      lng: 32.798823333515585,
      note: "One of my favorite places to study and focus in a quiet environment, especially during midterm and final exam weeks.",
      tags: ["Library", "Quiet study", "Focus"]
    },
    {
      name: "National Library",
      area: "Bahçelievler",
      type: "library",
      lat: 39.91646919360382,
      lng: 32.82708646230214,
      note: "A great alternative when I want to study for long hours and give my full attention to my work.",
      tags: ["Library", "Quiet study", "Studying"]
    },
    {
      name: "Adnan Ötüken Provincial Public Library",
      area: "Kızılay",
      type: "library",
      lat: 39.91965344998145,
      lng: 32.850690808578236,
      note: "A nice place to find a peaceful study environment and focus on my courses when I am in the city center.",
      tags: ["Library", "Quiet study", "Reading"]
    },
    {
      name: "Harper's Coffee",
      area: "İncek",
      type: "cafe",
      lat: 39.825035163439956,
      lng: 32.72265143252731,
      note: "One of the cafés I enjoy visiting to spend time on my laptop while having a cup of coffee.",
      tags: ["Coffee", "Laptop", "Break"]
    },
    {
      name: "Coffee 1919",
      area: "Ankara",
      type: "cafe",
      lat: 39.91240603884741,
      lng: 32.78045273518036,
      note: "One of my favorite spots for drinking coffee, studying, and spending time with my friends.",
      tags: ["Coffee", "Studying", "Friends"]
    },
    {
      name: "Colombia Coffee Yüzüncü Yıl",
      area: "Yüzüncü Yıl",
      type: "cafe",
      lat: 39.89419813233901,
      lng: 32.80562465232111,
      note: "With both quiet and social areas, this is a place I like for studying alone or working on assignments with friends.",
      tags: ["Coffee", "Quiet area", "Group study"]
    },
    {
      name: "Loba Coffee & Bakery",
      area: "Çukurambar",
      type: "cafe",
      lat: 39.89437922478741,
      lng: 32.806442726039364,
      note: "I especially like the comfortable upstairs area, where I can work on my laptop and enjoy a cup of coffee.",
      tags: ["Coffee", "Laptop", "Comfortable"]
    },
    {
      name: "Liman Kitap Kahve",
      area: "Kızılırmak",
      type: "cafe",
      lat: 39.90933372730491,
      lng: 32.81023907571935,
      note: "I love its atmosphere surrounded by books. Its quiet, social, and group study areas make it suitable for different study needs.",
      tags: ["Books", "Coffee", "Group study"]
    },
    {
      name: "Hound Coffee & Eatery",
      area: "Via Flat",
      type: "cafe",
      lat: 39.91420047454835,
      lng: 32.809249536947775,
      note: "A place where I can work on my laptop while enjoying coffee and take a relaxing break from time to time.",
      tags: ["Coffee", "Laptop", "Break"]
    },
    {
      name: "Kocatepe 1919",
      area: "Çukurambar",
      type: "cafe",
      lat: 39.90893305455309,
      lng: 32.80954903356213,
      note: "One of my favorite cafés for studying with friends, where we can work on group projects and chat together.",
      tags: ["Coffee", "Group study", "Conversation"]
    },
    {
      name: "Caffé Di Toeé",
      area: "Besa Kule",
      type: "cafe",
      lat: 39.90946622213283,
      lng: 32.80384467299093,
      note: "One of the places I enjoy visiting to work on my laptop, complete assignments, and take a pleasant coffee break.",
      tags: ["Coffee", "Assignments", "Break"]
    },
    {
      name: "Walker's Coffee",
      area: "Bahçelievler",
      type: "cafe",
      lat: 39.92312427590177,
      lng: 32.82865051225157,
      note: "A place where I can work on my assignments, enjoy coffee, and spend time with my friends.",
      tags: ["Coffee", "Assignments", "Friends"]
    },
    {
      name: "KANTA Coffee Shop",
      area: "Bahçelievler",
      type: "cafe",
      lat: 39.92162999881769,
      lng: 32.825836950316585,
      note: "One of the cafés I like visiting in Bahçelievler, both for studying and spending time with my friends.",
      tags: ["Coffee", "Studying", "Friends"]
    }
  ];

  let leafletMap = null;

  if (leafletElement && typeof L !== "undefined") {
    leafletMap = L.map(leafletElement, {
      minZoom: 3,
      maxZoom: 19,
      worldCopyJump: false,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 1
    }).setView([39.90, 32.80], 10);

    const baseLayer = L.tileLayer(OSM_URL, {
      maxZoom: 19,
      noWrap: true,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(leafletMap);

    let tileErrors = 0;

    baseLayer.on("tileerror", () => {
      tileErrors++;
      if (tileErrors >= 3) {
        const status = document.getElementById("leaflet-status");
        if (status) {
          status.textContent =
            "Map tiles could not be loaded. Please check your internet connection.";
        }
      }
    });

    const bookSvg = `
      <svg viewBox="0 0 24 24">
        <path d="M12 6c-3-2-6-2-9-1v13c3-1 6-1 9 1"/>
        <path d="M12 6c3-2 6-2 9-1v13c-3-1-6-1-9 1"/>
        <path d="M12 6v13"/>
      </svg>`;

    const coffeeSvg = `
      <svg viewBox="0 0 24 24">
        <path d="M4 9h13v6a6.5 6.5 0 0 1-13 0V9z"/>
        <path d="M17 10h2a3 3 0 0 1 0 6h-2"/>
        <path d="M3 21h16"/>
        <path d="M8 3c-2 2 2 3 0 5"/>
        <path d="M13 3c-2 2 2 3 0 5"/>
      </svg>`;

    function makeIcon(type) {
      return L.divIcon({
        className: "",
        html: `
          <div class="custom-marker ${type}">
            <span class="pin-shape"></span>
            <span class="pin-icon">
              ${type === "library" ? bookSvg : coffeeSvg}
            </span>
          </div>`,
        iconSize: [42, 52],
        iconAnchor: [21, 49],
        popupAnchor: [0, -39]
      });
    }

    const icons = {
      library: makeIcon("library"),
      cafe: makeIcon("cafe")
    };

    const markerLayer = L.layerGroup().addTo(leafletMap);
    let currentFilter = "all";

    function renderMarkers() {
      markerLayer.clearLayers();

      const filtered = places.filter(place =>
        currentFilter === "all" || place.type === currentFilter
      );

      const count = document.getElementById("place-count");
      if (count) count.textContent = `${filtered.length} places`;

      if (leafletMap.getZoom() < 10) return;

      filtered.forEach(place => {
        const tags = place.tags
          .map(tag => `<span>${escapeHtml(tag)}</span>`)
          .join("");

        const query = encodeURIComponent(`${place.lat},${place.lng}`);

        const popup = `
          <div class="place-popup">
            <h3>${escapeHtml(place.name)}</h3>
            <div class="place-area">📍 ${escapeHtml(place.area)}</div>
            <div class="place-tags">${tags}</div>
            <p>${escapeHtml(place.note)}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${query}"
               target="_blank" rel="noopener noreferrer">
              Open location in Google Maps ↗
            </a>
          </div>`;

        L.marker([place.lat, place.lng], {
          icon: icons[place.type]
        }).bindPopup(popup, { maxWidth: 310 }).addTo(markerLayer);
      });
    }

    leafletMap.on("zoomend", renderMarkers);
    renderMarkers();

    document.querySelectorAll(".filter-btn").forEach(button => {
      button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter-btn").forEach(btn => {
          btn.classList.toggle("active", btn === button);
        });

        renderMarkers();
      });
    });
  } else if (leafletElement) {
    leafletElement.textContent = "Leaflet could not be loaded.";
  }

  // ==============================
  // SECOND MAP - VISITED PLACES
  // ==============================
  const visitedPlaces = [
    {
      name: "Istanbul",
      lat: 41.0082,
      lng: 28.9784,
      memory: "A place where I'll never get tired of making memories...",
      photos: [2, 7, 19, 21, 22, 23, 24, 31, 32, 33, 36]
    },
    { name: "Balıkesir", lat: 39.6484, lng: 27.8826 },
    { name: "Mersin", lat: 36.8121, lng: 34.6415 },
    { name: "Yalova", lat: 40.6550, lng: 29.2769 },
    { name: "Konya", lat: 37.8746, lng: 32.4932 },
    { name: "Kütahya", lat: 39.4167, lng: 29.9833 },
    { name: "Kastamonu", lat: 41.3887, lng: 33.7827 },
    {
      name: "Bolu",
      lat: 40.7350,
      lng: 31.6061,
      memory: "Surrounded by the peace of nature, where I can reconnect with myself...",
      photos: [35, 37]
    },
    { name: "Kayseri", lat: 38.7205, lng: 35.4826 },
    { name: "Malatya", lat: 38.3552, lng: 38.3095 },
    { name: "Muş", lat: 38.9462, lng: 41.7539, photos: [18, 20] },
    { name: "Bingöl", lat: 38.8855, lng: 40.4966 },
    { name: "Elazığ", lat: 38.6810, lng: 39.2264, photos: [16] },
    {
      name: "Samsun",
      lat: 41.2867,
      lng: 36.3300,
      memory: "Unforgettable for both the beauty of the Black Sea and its humidity... :D",
      photos: [39]
    },
    { name: "Sakarya", lat: 40.7731, lng: 30.3948 },
    { name: "Sivas", lat: 39.7477, lng: 37.0179 },
    { name: "Adıyaman", lat: 37.7648, lng: 38.2786 },
    { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
    { name: "Erzurum", lat: 39.9043, lng: 41.2679 },
    { name: "Bitlis", lat: 38.4006, lng: 42.1095 },
    { name: "Kırıkkale", lat: 39.8468, lng: 33.5153, photos: [15] },
    { name: "Kırşehir", lat: 39.1458, lng: 34.1639 },
    {
      name: "Ankara",
      lat: 39.9334,
      lng: 32.8597,
      memory: "No matter where I go, the place that always feels like home...",
      photos: [13, 14, 17, 45]
    },
    {
      name: "Mecca",
      lat: 21.3891,
      lng: 39.8579,
      memory: "A place that never sleeps, always full of life and energy...",
      photos: [9, 11 , 38]
    },
    {
      name: "Medina",
      lat: 24.5247,
      lng: 39.5692,
      memory: "Where I found peace in silence and left a piece of my heart behind...",
      photos: [1, 8, 12, 40]
    },
    { name: "Jeddah", lat: 21.4858, lng: 39.1925 },
    {
      name: "Jerusalem",
      lat: 31.7683,
      lng: 35.2137,
      memory: "Where every street carries the traces of centuries and echoes of history...",
      photos: [5, 6, 25, 26]
    },
    { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, photos: [3, 4] },
    {
      name: "Hebron",
      lat: 31.5326,
      lng: 35.0998,
      memory: "Where ancient stones hold the traces of centuries and every street tells a story...",
      photos: [27, 28]
    },
    { name: "Jericho", lat: 31.8667, lng: 35.4500 }
  ];

  let openLayersMap = null;

  if (olElement && typeof ol !== "undefined") {
    const tileSource = new ol.source.XYZ({
      url: OSM_URL,
      wrapX: false,
      attributions: "&copy; OpenStreetMap contributors"
    });

    const baseLayer = new ol.layer.Tile({ source: tileSource });

    const features = visitedPlaces.map(place =>
      new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.fromLonLat([place.lng, place.lat])
        ),
        place
      })
    );

    const citySource = new ol.source.Vector({
      features,
      wrapX: false
    });

    const clusterSource = new ol.source.Cluster({
      distance: 45,
      minDistance: 12,
      source: citySource
    });

    // ==============================
    // CUSTOM MAP ICONS
    // ==============================
    const cameraSvg = `
      <svg viewBox="0 0 24 24" width="24" height="24"
       fill="none" stroke="#FFFFFF" stroke-width="2.8"
       stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 7h4l2-3h4l2 3h4v12H4z"/>
      <circle cx="12" cy="13" r="3.5"/>
    </svg>`;

    const pinSvg = `
      <svg viewBox="0 0 24 24" width="20" height="20"
           fill="none" stroke="#571522" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/>
        <circle cx="12" cy="10" r="2.5"/>
      </svg>`;

    function svgIcon(svg, background) {
  const isCamera = svg === cameraSvg;

  const symbol = isCamera
    ? `
      <g transform="translate(10 10)"
         fill="none"
         stroke="#FFFFFF"
         stroke-width="2.4"
         stroke-linecap="round"
         stroke-linejoin="round">
        <path d="M4 7h4l2-3h4l2 3h4v12H4z"/>
        <circle cx="12" cy="13" r="3.5"/>
      </g>
    `
    : `
      <g transform="translate(10 10)"
         fill="none"
         stroke="#571522"
         stroke-width="2"
         stroke-linecap="round"
         stroke-linejoin="round">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/>
        <circle cx="12" cy="10" r="2.5"/>
      </g>
    `;

  const html = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="44" height="48"
         viewBox="0 0 44 48">
      <circle cx="22" cy="22" r="19"
              fill="${background}"
              stroke="#fffaf7"
              stroke-width="3"/>
      ${symbol}
    </svg>`;

  return new ol.style.Icon({
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(html)}`,
    anchor: [0.5, 0.5],
    scale: 1
  });
}

    const cameraIcon = svgIcon(cameraSvg, "#A66379");
    const locationIcon = svgIcon(pinSvg, "#e8bcc7");

    const styleCache = {};

    function clusterStyle(feature) {
      const members = feature.get("features");
      const count = members.length;

      if (count === 1) {
        const place = members[0].get("place");
        const hasPhotos = Array.isArray(place.photos) &&
          place.photos.length > 0;

        return new ol.style.Style({
          image: hasPhotos ? cameraIcon : locationIcon
        });
      }

      if (!styleCache[count]) {
        styleCache[count] = new ol.style.Style({
          image: new ol.style.Circle({
            radius: Math.min(23, 14 + Math.log2(count) * 3),
            fill: new ol.style.Fill({ color: "#571522" }),
            stroke: new ol.style.Stroke({
              color: "#e8bcc7",
              width: 3
            })
          }),
          text: new ol.style.Text({
            text: String(count),
            fill: new ol.style.Fill({ color: "#ffffff" }),
            font: "bold 13px Arial, sans-serif"
          })
        });
      }

      return styleCache[count];
    }

    const markerLayer = new ol.layer.Vector({
      source: clusterSource,
      style: clusterStyle
    });

    openLayersMap = new ol.Map({
      target: olElement,
      layers: [baseLayer, markerLayer],
      view: new ol.View({
        center: ol.proj.fromLonLat([36, 34]),
        zoom: 4,
        minZoom: 3,
        maxZoom: 19,
        extent: ol.proj.transformExtent(
          [-180, -85, 180, 85],
          "EPSG:4326",
          "EPSG:3857"
        )
      })
    });

    const allExtent = ol.extent.boundingExtent(
      features.map(feature =>
        feature.getGeometry().getCoordinates()
      )
    );

    // ==============================
    // TRAVEL JOURNAL CARD
    // ==============================
    olElement.style.position = "relative";

    const card = document.createElement("div");
    card.className = "travel-memory-card travel-journal-card";
    olElement.appendChild(card);

    let activePlace = null;
    let photoIndex = 0;

    // ==============================
    // PHOTO MODAL
    // ==============================
    const photoModal = document.createElement("div");
    photoModal.className = "travel-photo-modal";
    photoModal.hidden = true;
    photoModal.setAttribute("role", "dialog");
    photoModal.setAttribute("aria-modal", "true");
    photoModal.setAttribute("aria-label", "Travel photo viewer");

    photoModal.innerHTML = `
      <button class="travel-modal-close" type="button"
              aria-label="Close photo">×</button>
      <button class="travel-modal-prev" type="button"
              aria-label="Previous photo">‹</button>
      <figure>
        <img alt="">
        <figcaption></figcaption>
      </figure>
      <button class="travel-modal-next" type="button"
              aria-label="Next photo">›</button>`;

    document.body.appendChild(photoModal);

    const modalImage = photoModal.querySelector("img");
    const modalCaption = photoModal.querySelector("figcaption");
    let modalIndex = 0;
    let modalPlace = null;

    function renderModal() {
      if (!modalPlace) return;

      const photos = modalPlace.photos || [];
      if (!photos.length) return;

      modalIndex = (modalIndex + photos.length) % photos.length;
      const number = photos[modalIndex];

      modalImage.src = `images/ani${number}.jpg`;
      modalImage.alt = `${modalPlace.name} - photo ${modalIndex + 1}`;
      modalCaption.textContent =
        `${modalPlace.name} · ${modalIndex + 1} / ${photos.length}`;
    }

    function openPhotoModal(place, index) {
      modalPlace = place;
      modalIndex = index;
      renderModal();
      photoModal.hidden = false;
      document.body.style.overflow = "hidden";
      photoModal.querySelector(".travel-modal-close").focus();
    }

    function closePhotoModal() {
      photoModal.hidden = true;
      document.body.style.overflow = "";
      modalPlace = null;
    }

    photoModal.querySelector(".travel-modal-close")
      .addEventListener("click", closePhotoModal);

    photoModal.querySelector(".travel-modal-prev")
      .addEventListener("click", () => {
        modalIndex--;
        renderModal();
      });

    photoModal.querySelector(".travel-modal-next")
      .addEventListener("click", () => {
        modalIndex++;
        renderModal();
      });

    photoModal.addEventListener("click", event => {
      if (event.target === photoModal) closePhotoModal();
    });

    document.addEventListener("keydown", event => {
      if (photoModal.hidden) return;

      if (event.key === "Escape") closePhotoModal();

      if (event.key === "ArrowRight") {
        modalIndex++;
        renderModal();
      }

      if (event.key === "ArrowLeft") {
        modalIndex--;
        renderModal();
      }
    });

    // ==============================
    // MEMORY CARD FUNCTIONS
    // ==============================
    function closeMemoryCard() {
      card.classList.remove("is-open");
      activePlace = null;
      photoIndex = 0;
    }

    function renderMemoryCard() {
      if (!activePlace) return;

      const photos = activePlace.photos || [];
      const shown = photos.slice(photoIndex, photoIndex + 2);
      const memory = activePlace.memory || "";

      const images = shown.map((number, index) => `
        <button class="travel-journal-photo"
                type="button"
                data-photo-index="${photoIndex + index}"
                aria-label="Open photo ${photoIndex + index + 1}">
          <img src="images/ani${number}.jpg"
               alt="${escapeHtml(activePlace.name)} photo"
               loading="lazy">
          <span class="travel-photo-zoom">↗</span>
        </button>
      `).join("");

      const photosHtml = photos.length ? `
        <div class="travel-journal-images">
          ${images}
        </div>
        <div class="travel-journal-footer">
          <button type="button" data-action="prev"
                  ${photoIndex === 0 ? "disabled" : ""}>←</button>
          <span>
            ${photoIndex + 1}–${photoIndex + shown.length}
            / ${photos.length}
          </span>
          <button type="button" data-action="next"
                  ${photoIndex + 2 >= photos.length ? "disabled" : ""}>→</button>
        </div>
      ` : `
        <p class="travel-journal-empty">
          Memories from this city are coming soon...
        </p>
      `;

      card.innerHTML = `
        <header class="travel-journal-header">
          <span class="travel-journal-eyebrow">
            ✦ MY TRAVEL JOURNAL
          </span>
          <button class="travel-journal-close"
                  type="button"
                  data-action="close"
                  aria-label="Close card">×</button>
        </header>
        <h3 class="travel-journal-title">
          ${escapeHtml(activePlace.name)}
        </h3>
        ${memory ? `
          <p class="travel-journal-memory">
            “${escapeHtml(memory)}”
          </p>
        ` : ""}
        ${photosHtml}
      `;

      card.classList.add("is-open");
    }

    function openMemoryCard(place) {
      activePlace = place;
      photoIndex = 0;
      renderMemoryCard();
    }

    card.addEventListener("click", event => {
      const photoButton = event.target.closest(
        ".travel-journal-photo"
      );

      if (photoButton && activePlace) {
        openPhotoModal(
          activePlace,
          Number(photoButton.dataset.photoIndex)
        );
        return;
      }

      const button = event.target.closest("button[data-action]");
      if (!button || button.disabled) return;

      const action = button.dataset.action;

      if (action === "close") {
        closeMemoryCard();
        return;
      }

      if (!activePlace) return;

      const photos = activePlace.photos || [];

      if (action === "prev") {
        photoIndex = Math.max(0, photoIndex - 2);
        renderMemoryCard();
      }

      if (action === "next" && photoIndex + 2 < photos.length) {
        photoIndex += 2;
        renderMemoryCard();
      }
    });

    // ==============================
    // SHOW ALL PLACES
    // ==============================
    function showAllPlaces(animate = true) {
      closeMemoryCard();
      openLayersMap.updateSize();

      openLayersMap.getView().fit(allExtent, {
        size: openLayersMap.getSize(),
        padding: [40, 40, 40, 40],
        maxZoom: 5,
        duration: animate ? 450 : 0
      });
    }

    // ==============================
    // MAP TOOLBAR
    // ==============================
    const toolbar = document.createElement("div");
    toolbar.className = "travel-map-toolbar";

    toolbar.style.cssText = `
      position: absolute;
      top: 12px;
      left: 12px;
      right: 58px;
      z-index: 20;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      pointer-events: none;
    `;

    olElement.appendChild(toolbar);

    const searchBox = document.createElement("div");

    searchBox.style.cssText = `
      position: relative;
      flex: 1 1 180px;
      max-width: 290px;
      pointer-events: auto;
    `;

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Search a city...";
    searchInput.setAttribute("aria-label", "Search a visited city");

    searchInput.style.cssText = `
      box-sizing: border-box;
      width: 100%;
      padding: 11px 13px;
      background: #fffaf7;
      color: #571522;
      border: 2px solid #e8bcc7;
      border-radius: 10px;
      outline: none;
      font: 13px Arial, sans-serif;
      box-shadow: 0 3px 12px rgba(0,0,0,.12);
    `;

    const suggestions = document.createElement("div");

    suggestions.style.cssText = `
      display: none;
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      right: 0;
      max-height: 200px;
      overflow-y: auto;
      background: #fffaf7;
      border: 1px solid #e8bcc7;
      border-radius: 10px;
      box-shadow: 0 5px 18px rgba(0,0,0,.15);
      z-index: 25;
    `;

    searchBox.appendChild(searchInput);
    searchBox.appendChild(suggestions);
    toolbar.appendChild(searchBox);

    const showAllButton = document.createElement("button");
    showAllButton.type = "button";
    showAllButton.textContent = "⌖ Show All Places";

    showAllButton.style.cssText = `
      padding: 11px 13px;
      background: #571522;
      color: #ffffff;
      border: 2px solid #e8bcc7;
      border-radius: 10px;
      cursor: pointer;
      font: bold 12px Arial, sans-serif;
      box-shadow: 0 3px 12px rgba(0,0,0,.12);
      pointer-events: auto;
    `;

    toolbar.appendChild(showAllButton);

    // ==============================
    // CITY SEARCH
    // ==============================
    function normalizeCity(value) {
      return String(value)
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i")
        .replace(/ş/g, "s")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .trim();
    }

    const cityAliases = {
      Istanbul: ["İstanbul"],
      Mecca: ["Mekke"],
      Medina: ["Medine"],
      Jerusalem: ["Kudüs", "Kudus"],
      Hebron: ["El Halil", "El-Halil"],
      Jericho: ["Eriha"],
      Jeddah: ["Cidde"]
    };

    function cityMatches(place, query) {
      const names = [
        place.name,
        ...(cityAliases[place.name] || [])
      ];

      return names.some(name =>
        normalizeCity(name).includes(query)
      );
    }

    function selectCity(place) {
      searchInput.value = place.name;
      suggestions.style.display = "none";

      const coordinate = ol.proj.fromLonLat([
        place.lng,
        place.lat
      ]);

      openLayersMap.getView().animate({
        center: coordinate,
        zoom: 10,
        duration: 500
      });

      openMemoryCard(place);
    }

    function updateSuggestions() {
      const query = normalizeCity(searchInput.value);
      suggestions.innerHTML = "";

      if (!query) {
        suggestions.style.display = "none";
        return;
      }

      const matches = visitedPlaces.filter(place =>
        cityMatches(place, query)
      );

      if (!matches.length) {
        suggestions.style.display = "none";
        return;
      }

      matches.forEach(place => {
        const option = document.createElement("button");
        option.type = "button";
        option.textContent = place.name;

        option.style.cssText = `
          display: block;
          width: 100%;
          padding: 10px 12px;
          text-align: left;
          background: transparent;
          color: #571522;
          border: none;
          border-bottom: 1px solid #f0dfe3;
          cursor: pointer;
          font: 13px Arial, sans-serif;
        `;

        option.addEventListener("click", () => {
          selectCity(place);
        });

        suggestions.appendChild(option);
      });

      suggestions.style.display = "block";
    }

    searchInput.addEventListener("input", updateSuggestions);
    searchInput.addEventListener("focus", updateSuggestions);

    searchInput.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        suggestions.style.display = "none";
      }

      if (event.key === "Enter") {
        const query = normalizeCity(searchInput.value);
        const match = visitedPlaces.find(place =>
          cityMatches(place, query)
        );

        if (match) {
          event.preventDefault();
          selectCity(match);
        }
      }
    });

    document.addEventListener("click", event => {
      if (!searchBox.contains(event.target)) {
        suggestions.style.display = "none";
      }
    });

    showAllButton.addEventListener("click", () => {
      searchInput.value = "";
      suggestions.style.display = "none";
      showAllPlaces();
    });

    const instruction = document.getElementById(
      "travel-map-instruction"
    );

    if (instruction) {
      instruction.textContent =
        "Search for a city, click a camera icon to see photo memories, or click a numbered cluster to zoom in ↗";
    }

    // ==============================
    // MAP CLICK EVENTS
    // ==============================
    openLayersMap.on("singleclick", event => {
      const cluster = openLayersMap.forEachFeatureAtPixel(
        event.pixel,
        feature => feature,
        {
          layerFilter: layer => layer === markerLayer,
          hitTolerance: 7
        }
      );

      if (!cluster) {
        closeMemoryCard();
        return;
      }

      const members = cluster.get("features");

      if (members.length > 1) {
        closeMemoryCard();

        const extent = ol.extent.boundingExtent(
          members.map(feature =>
            feature.getGeometry().getCoordinates()
          )
        );

        const currentZoom =
          openLayersMap.getView().getZoom() || 3;

        openLayersMap.getView().fit(extent, {
          duration: 400,
          padding: [65, 65, 65, 65],
          maxZoom: Math.min(currentZoom + 3, 15)
        });

        return;
      }

      const place = members[0].get("place");
      openMemoryCard(place);
    });

    openLayersMap.on("pointermove", event => {
      if (event.dragging) return;

      const hit = openLayersMap.hasFeatureAtPixel(
        event.pixel,
        {
          layerFilter: layer => layer === markerLayer,
          hitTolerance: 7
        }
      );

      olElement.style.cursor = hit ? "pointer" : "";
    });

    // ==============================
    // MAP TILE ERRORS
    // ==============================
    let tileErrors = 0;

    tileSource.on("tileloaderror", () => {
      tileErrors++;

      if (tileErrors >= 3) {
        const status = document.getElementById("ol-status");

        if (status) {
          status.textContent =
            "Map tiles could not be loaded. Please check your internet connection.";
        }
      }
    });

    showAllPlaces(false);
  } else if (olElement) {
    olElement.textContent = "OpenLayers could not be loaded.";
  }

  // ==============================
  // MAP RESIZE
  // ==============================
  function refreshMaps() {
    if (leafletMap) leafletMap.invalidateSize();

    if (openLayersMap) {
      openLayersMap.updateSize();
      openLayersMap.renderSync();
    }
  }

  window.addEventListener("resize", refreshMaps);

  const mapsSection = document.getElementById("haritalar");

  if (mapsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        refreshMaps();
        setTimeout(refreshMaps, 400);
        observer.disconnect();
      }
    }, { threshold: 0.05 });

    observer.observe(mapsSection);
  }
});

// ==============================
// AUTOMATIC PHOTO GALLERY
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("memorySlider");
  const track = document.getElementById("memoryTrack");
  const lightbox = document.getElementById("memoryLightbox");

  if (!slider || !track || !lightbox) return;

  const photos = [...track.querySelectorAll(".memory-photo")];
  if (!photos.length) return;

  const images = photos.map(photo => photo.querySelector("img"));

  const largeImage = document.getElementById("memoryLargeImage");
  const counter = document.getElementById("memoryCounter");
  const closeBtn = document.getElementById("memoryClose");
  const prevBtn = document.getElementById("memoryPrev");
  const nextBtn = document.getElementById("memoryNext");

  if (!largeImage || !counter || !closeBtn || !prevBtn || !nextBtn) {
    return;
  }

  const copies = photos.map(photo => {
    const clone = photo.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;
    track.appendChild(clone);
    return clone;
  });

  let position = 0;
  let currentIndex = 0;
  let paused = false;
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let previousFocus = null;

  const speed = 0.45;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function getCycleWidth() {
    return copies[0].offsetLeft - photos[0].offsetLeft;
  }

  function normalizePosition() {
    const width = getCycleWidth();
    if (!width) return;

    position = ((position % width) + width) % width;
  }

  function animate() {
    if (!paused && !dragging && !reduceMotion) {
      position += speed;
      normalizePosition();
    }

    track.style.transform = `translateX(${-position}px)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  slider.addEventListener("mouseenter", () => {
    paused = true;
  });

  slider.addEventListener("mouseleave", () => {
    if (!lightbox.classList.contains("active")) {
      paused = false;
    }
  });

  slider.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;

    dragging = true;
    moved = false;
    lastX = event.clientX;

    slider.setPointerCapture(event.pointerId);
  });

  slider.addEventListener("pointermove", event => {
    if (!dragging) return;

    const delta = event.clientX - lastX;
    if (Math.abs(delta) > 2) moved = true;

    position -= delta;
    normalizePosition();
    lastX = event.clientX;
  });

  function stopDragging() {
    dragging = false;
  }

  slider.addEventListener("pointerup", stopDragging);
  slider.addEventListener("pointercancel", stopDragging);

  function showImage(index, withAnimation = true) {
    currentIndex = (index + images.length) % images.length;

    largeImage.src = images[currentIndex].src;
    largeImage.alt = images[currentIndex].alt;

    counter.textContent =
      `${currentIndex + 1} / ${images.length}`;

    largeImage.classList.remove("memory-slide");

    if (withAnimation && !reduceMotion) {
      void largeImage.offsetWidth;
      largeImage.classList.add("memory-slide");
    }
  }

  function openGallery(index) {
    previousFocus = document.activeElement;

    showImage(index, false);
    paused = true;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeGallery() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
    paused = slider.matches(":hover");

    previousFocus?.focus();
  }

  [...photos, ...copies].forEach((photo, index) => {
    const originalIndex = index % photos.length;

    if (index < photos.length) {
      photo.tabIndex = 0;
      photo.setAttribute("role", "button");
      photo.setAttribute(
        "aria-label",
        `Open memory ${originalIndex + 1} photo`
      );
    }

    photo.addEventListener("click", () => {
      if (moved) {
        moved = false;
        return;
      }

      openGallery(originalIndex);
    });

    if (index < photos.length) {
      photo.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openGallery(originalIndex);
        }
      });
    }
  });

  prevBtn.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  closeBtn.addEventListener("click", closeGallery);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeGallery();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);

    if (event.key === "Tab") {
      const controls = [closeBtn, prevBtn, nextBtn];
      const index = controls.indexOf(document.activeElement);

      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        nextBtn.focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        closeBtn.focus();
      }
    }
  });
});
