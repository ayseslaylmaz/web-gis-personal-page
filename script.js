
document.addEventListener("DOMContentLoaded", () => {

  // MOBILE MENU
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

  // PAGE REVEAL ANIMATIONS
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

  // 13 FAVORITE STUDY SPOTS IN ANKARA
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

  // LEAFLET MAP
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

      if (count) {
        count.textContent = `${filtered.length} places`;
      }

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

  // 29 PLACES I HAVE VISITED
  const visitedPlaces = [
    { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
    { name: "Balıkesir", lat: 39.6484, lng: 27.8826 },
    { name: "Mersin", lat: 36.8121, lng: 34.6415 },
    { name: "Yalova", lat: 40.6550, lng: 29.2769 },
    { name: "Konya", lat: 37.8746, lng: 32.4932 },
    { name: "Kütahya", lat: 39.4167, lng: 29.9833 },
    { name: "Kastamonu", lat: 41.3887, lng: 33.7827 },
    { name: "Bolu", lat: 40.7350, lng: 31.6061 },
    { name: "Kayseri", lat: 38.7205, lng: 35.4826 },
    { name: "Malatya", lat: 38.3552, lng: 38.3095 },
    { name: "Muş", lat: 38.9462, lng: 41.7539 },
    { name: "Bingöl", lat: 38.8855, lng: 40.4966 },
    { name: "Elazığ", lat: 38.6810, lng: 39.2264 },
    { name: "Samsun", lat: 41.2867, lng: 36.3300 },
    { name: "Sakarya", lat: 40.7731, lng: 30.3948 },
    { name: "Sivas", lat: 39.7477, lng: 37.0179 },
    { name: "Adıyaman", lat: 37.7648, lng: 38.2786 },
    { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
    { name: "Erzurum", lat: 39.9043, lng: 41.2679 },
    { name: "Bitlis", lat: 38.4006, lng: 42.1095 },
    { name: "Kırıkkale", lat: 39.8468, lng: 33.5153 },
    { name: "Kırşehir", lat: 39.1458, lng: 34.1639 },
    { name: "Mecca", lat: 21.3891, lng: 39.8579 },
    { name: "Medina", lat: 24.5247, lng: 39.5692 },
    { name: "Jeddah", lat: 21.4858, lng: 39.1925 },
    { name: "Jerusalem", lat: 31.7683, lng: 35.2137 },
    { name: "Tel Aviv", lat: 32.0853, lng: 34.7818 },
    { name: "Hebron", lat: 31.5326, lng: 35.0998 },
    { name: "Jericho", lat: 31.8667, lng: 35.4500 }
  ];

  let openLayersMap = null;

  // OPENLAYERS MAP
  if (olElement && typeof ol !== "undefined") {

    const tileSource = new ol.source.XYZ({
      url: OSM_URL,
      wrapX: false,
      attributions: "&copy; OpenStreetMap contributors"
    });

    const baseLayer = new ol.layer.Tile({
      source: tileSource
    });

    const features = visitedPlaces.map(place =>
      new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.fromLonLat([place.lng, place.lat])
        ),
        name: place.name
      })
    );

    const markerStyle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 8,
        fill: new ol.style.Fill({ color: "#571522" }),
        stroke: new ol.style.Stroke({
          color: "#e8bcc7",
          width: 2.5
        })
      })
    });

    const markerLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features,
        wrapX: false
      }),
      style: markerStyle
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

    const coordinates = visitedPlaces.map(place =>
      ol.proj.fromLonLat([place.lng, place.lat])
    );

    openLayersMap.getView().fit(
      ol.extent.boundingExtent(coordinates),
      {
        size: openLayersMap.getSize(),
        padding: [35, 35, 35, 35],
        maxZoom: 5,
        duration: 0
      }
    );

    const instruction =
      document.getElementById("travel-map-instruction");

    const popupElement = document.createElement("div");

    popupElement.style.cssText = `
      background: #571522;
      color: white;
      padding: 10px 15px;
      border: 2px solid #e8bcc7;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      font-size: 13px;
      font-weight: bold;
      white-space: nowrap;
      box-shadow: 0 5px 18px rgba(0,0,0,.18);
    `;

    const popupOverlay = new ol.Overlay({
      element: popupElement,
      positioning: "bottom-center",
      offset: [0, -14],
      stopEvent: false
    });

    openLayersMap.addOverlay(popupOverlay);

    function updateTravelMarkers() {
      const zoom = openLayersMap.getView().getZoom() || 3;
      const resolution = openLayersMap.getView().getResolution();

      if (zoom < 3) {
        markerLayer.setStyle(() => null);
        popupOverlay.setPosition(undefined);
        return;
      }

      let minPixelDistance;

      if (zoom < 4) minPixelDistance = 90;
      else if (zoom < 5) minPixelDistance = 65;
      else if (zoom < 6) minPixelDistance = 35;
      else minPixelDistance = 0;

      const selected = [];

      markerLayer.setStyle(feature => {
        if (minPixelDistance === 0) return markerStyle;

        const point = feature.getGeometry().getCoordinates();
        const x = point[0] / resolution;
        const y = point[1] / resolution;

        const overlaps = selected.some(other =>
          Math.hypot(x - other.x, y - other.y) < minPixelDistance
        );

        if (overlaps) return null;

        selected.push({ x, y });
        return markerStyle;
      });

      markerLayer.changed();

      if (instruction) {
        instruction.textContent = zoom < 6
          ? "Zoom in to discover more cities ↗"
          : "Click on the burgundy markers to explore the cities ↗";
      }

      popupOverlay.setPosition(undefined);
    }

    openLayersMap.on("moveend", updateTravelMarkers);
    updateTravelMarkers();

    openLayersMap.on("singleclick", event => {
      const feature = openLayersMap.forEachFeatureAtPixel(
        event.pixel,
        found => found,
        {
          layerFilter: layer => layer === markerLayer,
          hitTolerance: 5
        }
      );

      if (feature) {
        popupElement.textContent = feature.get("name");
        popupOverlay.setPosition(
          feature.getGeometry().getCoordinates()
        );
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    openLayersMap.on("pointermove", event => {
      if (event.dragging) return;

      const feature = openLayersMap.forEachFeatureAtPixel(
        event.pixel,
        found => found,
        {
          layerFilter: layer => layer === markerLayer,
          hitTolerance: 5
        }
      );

      olElement.style.cursor = feature ? "pointer" : "";
    });

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

  } else if (olElement) {
    olElement.textContent = "OpenLayers could not be loaded.";
  }

  // UPDATE MAP SIZES
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


// AUTOMATICALLY SCROLLING PHOTO STRIP
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

  slider.addEventListener("mouseenter", () => paused = true);

  slider.addEventListener("mouseleave", () => {
    if (!lightbox.classList.contains("active")) paused = false;
  });

  slider.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;

    dragging = true;
    moved = false;
    lastX = e.clientX;

    slider.setPointerCapture(e.pointerId);
  });

  slider.addEventListener("pointermove", e => {
    if (!dragging) return;

    const delta = e.clientX - lastX;
    if (Math.abs(delta) > 2) moved = true;

    position -= delta;
    normalizePosition();
    lastX = e.clientX;
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

    counter.textContent = `${currentIndex + 1} / ${images.length}`;

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
      photo.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openGallery(originalIndex);
        }
      });
    }
  });

  prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
  nextBtn.addEventListener("click", () => showImage(currentIndex + 1));
  closeBtn.addEventListener("click", closeGallery);

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeGallery();
  });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);

    if (e.key === "Tab") {
      const controls = [closeBtn, prevBtn, nextBtn];
      const index = controls.indexOf(document.activeElement);

      if (e.shiftKey && index <= 0) {
        e.preventDefault();
        nextBtn.focus();
      } else if (!e.shiftKey && index === controls.length - 1) {
        e.preventDefault();
        closeBtn.focus();
      }
    }
  });

});
