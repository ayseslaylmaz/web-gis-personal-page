# My Personal Website | Web GIS Project

## 1. About the Project

This website is a personal portfolio project developed as part of the Web GIS course in the Department of Geomatics Engineering at Hacettepe University.

The aim of this project is to create a personal website using HTML, CSS, JavaScript, and web-based mapping technologies. The website introduces my academic background, projects, interests, and personal experiences while including interactive maps.

**Live Website:** https://ayseslaylmaz.github.io/web-gis-personal-page/

## 2. Technologies Used

- **HTML:** Website structure and content.
- **CSS:** Page layouts, colors, typography, cards, animations, and responsive design.
- **JavaScript:** Interactive features, maps, and photo gallery.
- **Leaflet:** Interactive map of my favorite study spots in Ankara.
- **OpenLayers:** Interactive map of places I have visited.
- **OpenStreetMap:** Basemap data for the interactive maps.
- **Git and GitHub:** Version control and project management.
- **GitHub Pages:** Website hosting and deployment.

## 3. Website Pages

### Home

The homepage includes a short introduction about me, links to my projects, previews of the interactive maps, a moving photo gallery, and contact information.

### About Me

This page introduces my educational background, academic interests, and personal experiences.

### My Projects

This page presents some of the projects and topics I have worked on during my university education:

- Forest Fire and Vegetation Change Analysis
- Digital Image Processing with Python
- Web GIS and Interactive Systems
- Fieldwork and Construction Site Experience

### My Maps

This section includes two interactive maps developed using different JavaScript mapping libraries.

**Map 1: My Favorite Study Spots in Ankara (Leaflet)**

I created an interactive map showing libraries and cafés where I enjoy studying in Ankara.

The map contains 13 locations. Users can filter locations by category and click on markers to read information about each place.

**Map 2: Places I've Visited and Made Memories (OpenLayers)**

I developed a second interactive map showing cities I have visited in Türkiye and abroad.

The map contains 29 locations. Users can zoom in to explore different cities and click on markers to view location information.

### Through My Lens

I created a photo gallery containing 37 photographs taken during my travels.

The homepage includes an automatically moving horizontal photo strip, while a separate gallery page displays the photographs in a gallery layout.

### Contact

The contact section provides links to my email and GitHub profile.

## 4. Technical Problems and Solutions

### Issue 1: Overlapping Map Markers

When many locations are displayed close to each other, markers may overlap and reduce map readability.

**Leaflet solution:**

In the Ankara study spots map, I set the markers to appear only at zoom level 10 and above.

This reduces marker density when the map is zoomed out.

**OpenLayers solution:**

The second map covers a larger geographical area, including different cities in Türkiye and abroad.

For this reason, I used different zoom thresholds. Selected locations become visible from zoom level 3, while other locations appear from zoom level 6.

I also used zoom-dependent marker visibility and screen-distance checks to reduce overlapping markers.

These approaches allowed me to use different marker display strategies based on the purpose of each map.

### Issue 2: World Map Repeating When Zoomed Out

In web-based mapping applications, the world map may repeat horizontally when the user zooms out.

To address this problem, I used different settings in Leaflet and OpenLayers.

**Leaflet solution:**

I used the `noWrap: true` option to prevent map tiles from repeating horizontally.

**OpenLayers solution:**

I used `wrapX: false` for the map tile source and vector source.

I also configured `minZoom` and `extent` to limit zooming out and map movement.

These settings were used to prevent unwanted horizontal repetition and provide a more controlled map view.

## 5. CSS Design and Animations

I used a color palette consisting of burgundy, dusty pink, and light cream.

I designed the pages with consistent typography, buttons, cards, borders, and spacing.

I also used CSS to create responsive page layouts for different screen sizes.

On the homepage, I implemented an animation that automatically moves photographs horizontally.

## 6. AI Usage and What I Learned

During this project, I researched HTML, CSS, JavaScript, Leaflet, and OpenLayers. I also used ChatGPT to understand technical problems, explore possible solutions, and improve my code.

Topics I worked on with AI assistance include:

- Creating a multi-page HTML website
- Designing page layouts and animations with CSS
- Implementing interactive features with JavaScript
- Configuring Leaflet and OpenLayers maps
- Controlling marker visibility based on zoom levels
- Preventing horizontal world map repetition
- Using Git commands and GitHub
- Publishing a website with GitHub Pages

AI assistance helped me better understand how the code works and how to approach technical problems.

**Estimated total AI usage: Approximately 6–7 hours.**

## 7. Conclusion

This project allowed me to apply my knowledge of HTML, CSS, and JavaScript in practice.

I developed two interactive maps using Leaflet and OpenLayers and worked on CSS animations, photo galleries, and multi-page website design.

I also gained experience with version control using Git and GitHub and successfully published my website using GitHub Pages.