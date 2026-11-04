/** Offline location references and original thematic prompts.
 * Geographic calculation, historical interpretation and editorial scoring are separate.
 * GeoNames city subset: CC BY 4.0; Natural Earth land: public domain. */
export const ASTROCARTOGRAPHY_SOURCES = [
  {
    "id": "acg-frame",
    "title": "Astronomy Engine: JavaScript API documentation",
    "url": "https://raw.githubusercontent.com/cosinekitty/astronomy/master/source/js/README.md",
    "locator": "GeoVector, Rotation_EQJ_EQD, Equator, Horizon and SiderealTime",
    "readingDepth": "Selected API definitions and coordinate frames read; bundled GeoVector Moon branch inspected",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "maintainer technical documentation",
    "claims": [
      "GeoVector returns geocentric J2000 coordinates. Its non-lunar path backdates position and optionally corrects aberration; the bundled Moon branch returns GeoMoon directly. Rotation to true equator of date must match the sidereal-time frame.",
      "Equator is topocentric and applies observer parallax; it is not interchangeable with a geocentric vector.",
      "SiderealTime supplies Greenwich apparent sidereal time in hours."
    ],
    "limitations": [
      "API descriptions do not validate this app’s implementation or any astrological interpretation."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-method",
    "title": "NOAA: General Solar Position Calculations",
    "url": "https://gml.noaa.gov/grad/solcalc/solareqns.PDF",
    "locator": "Solar zenith equation and Sunrise/Sunset Calculations",
    "readingDepth": "Selected altitude/hour-angle equations and sunrise correction read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "government technical reference",
    "claims": [
      "sin(altitude)=sin(latitude)sin(declination)+cos(latitude)cos(declination)cos(hour angle).",
      "NOAA’s sunrise calculation uses zenith 90.833° for atmospheric refraction and solar-disc size; this differs from a geometric centre at altitude 0°."
    ],
    "limitations": [
      "NOAA’s approximate solar model is not used as a general planetary ephemeris here.",
      "Its solar-time hour-angle sign convention must not be copied into a different longitude/rotation convention without checking."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-horizons",
    "title": "NASA/JPL Horizons: system manual",
    "url": "https://ssd.jpl.nasa.gov/horizons/manual.html",
    "locator": "Observer ephemeris quantities2 and4: apparent RA/Dec and azimuth/elevation",
    "readingDepth": "Selected apparent-coordinate and airless/refraction descriptions read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "government astronomical documentation",
    "claims": [
      "Earth apparent coordinates use the true equator and equinox of date.",
      "Airless apparent directions and refraction-adjusted directions are different products."
    ],
    "limitations": [
      "No live Horizons ephemeris is required by the offline page; this is a definitions reference."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-radius",
    "title": "GeoPy: calculating distance",
    "url": "https://geopy.readthedocs.io/en/stable/#calculating-distance",
    "locator": "Great-circle versus geodesic distance section",
    "readingDepth": "Mean-radius definition and spherical/ellipsoidal distinction read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "maintained geospatial library documentation",
    "claims": [
      "The IUGG mean-radius convention (2a+b)/3 for WGS84 is 6371.0087714150598 km.",
      "A spherical great-circle model differs from an ellipsoidal geodesic model."
    ],
    "limitations": [
      "The app’s 6371.0088 km rounded radius is WGS84-derived, not an IAU nominal radius.",
      "A display or scoring radius is not an empirically established range of planetary influence."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-wgs84",
    "title": "GeographicLib: WGS84 constants",
    "url": "https://geographiclib.sourceforge.io/C++/doc/classGeographicLib_1_1Constants.html",
    "locator": "Constants::WGS84_a() and Constants::WGS84_f()",
    "readingDepth": "The two WGS84 constants and units read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "maintainer geodesy reference",
    "claims": [
      "WGS84 equatorial radius is 6378137 m; flattening is 1/298.257223563.",
      "Using b=a(1−f), the arithmetic mean radius rounds to 6371.0088 km."
    ],
    "limitations": [
      "This does not make spherical line distances ellipsoidal geodesics."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-lewis",
    "title": "Jim Lewis: Fifteen Techniques for Reading Astro*Carto*Graphy Maps (1994)",
    "url": "https://continuumacg.net/techniques.html",
    "locator": "Meanings of Each Angle; Places of No Influence; Orb; Look at the Entire Natal Complex",
    "readingDepth": "Selected principles and four angle meanings read",
    "rights": "Copyright 1994 Jim Lewis; original brief paraphrases only, no branded map or prose reproduction.",
    "evidenceQuality": "primary modern practitioner statement, not empirical validation",
    "claims": [
      "Lewis associates MC with public/career expression, ASC with outward presentation, DSC with relationships and IC with personal roots.",
      "The source says absent nearby lines do not imply an insignificant life and asks readers to consider the larger natal context."
    ],
    "limitations": [
      "Its approximate 700-mile/8-degree and 450-mile/5-degree orb statements are not treated as geometric identities or validated physical influence limits.",
      "Gender stereotypes, paranormal claims and consequential predictions are not adopted."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-angles",
    "title": "Maya White: Jupiter on Four Types of Astro*Carto*Graphy Lines (2006)",
    "url": "https://continuumacg.net/4acglines.html",
    "locator": "ASC, DSC, IC and MH sections",
    "readingDepth": "Selected angle-topic paragraphs and author attribution read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "modern practitioner interpretation, not empirical validation",
    "claims": [
      "The four angles are interpreted through presentation, relationships, private/home life and public visibility.",
      "The article distinguishes Jupiter themes by angle."
    ],
    "limitations": [
      "Health claims, political anecdotes and guarantees of accuracy are not adopted.",
      "The article’s loose use of directly overhead is not the geometric definition of every meridian line."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-relocation",
    "title": "Erin Sullivan: What the Relocated Chart Adds (2000)",
    "url": "https://continuumacg.net/erin-relocchart.html",
    "locator": "Opening distinction between angular map and relocated chart",
    "readingDepth": "Opening map-versus-relocated-chart explanation and practical-move discussion read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "modern practitioner book excerpt",
    "claims": [
      "An angular world map and a local relocated horoscope answer different questions.",
      "Relocated houses add location-specific chart context."
    ],
    "limitations": [
      "The excerpt’s causal and anecdotal claims are not validated here.",
      "Only a selected excerpt was read, not the complete book."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-uranus",
    "title": "Cafe Astrology: Uranus",
    "url": "https://cafeastrology.com/uranus.html",
    "locator": "Opening symbolic-association paragraphs",
    "readingDepth": "Selected originality, change and innovation vocabulary read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "modern astrology reference; symbolic vocabulary",
    "claims": [
      "The modern reference associates Uranus with novelty, independence and change."
    ],
    "limitations": [
      "These are cultural interpretive themes, not demonstrated location effects or a traditional Lilly rule."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-neptune",
    "title": "Cafe Astrology: Neptune",
    "url": "https://cafeastrology.com/neptune.html",
    "locator": "Opening symbolic-association paragraphs",
    "readingDepth": "Selected inspiration, idealization and ambiguity vocabulary read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "modern astrology reference; symbolic vocabulary",
    "claims": [
      "The modern reference associates Neptune with inspiration and ideals alongside uncertainty or confusion."
    ],
    "limitations": [
      "Medical, psychic and causal claims are not adopted."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-pluto",
    "title": "Cafe Astrology: Pluto",
    "url": "https://cafeastrology.com/pluto.html",
    "locator": "Opening symbolic-association paragraphs",
    "readingDepth": "Selected renewal, power and control vocabulary read",
    "rights": "Selected source passages inform original project paraphrases; no full text or source artwork redistributed.",
    "evidenceQuality": "modern astrology reference; symbolic vocabulary",
    "claims": [
      "The modern reference associates Pluto with renewal and questions of power or control."
    ],
    "limitations": [
      "This does not establish personal fate, danger or a literal supernatural mechanism."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-geonames",
    "title": "GeoNames: cities15000 daily gazetteer",
    "url": "https://download.geonames.org/export/dump/cities15000.zip",
    "locator": "Selected 40 rows by geonameId; fields 4/5 latitude/longitude and 17 IANA time-zone ID (zero-based)",
    "readingDepth": "Selected rows checked against the published schema and IANA zone availability",
    "rights": "GeoNames CC BY 4.0: attribution required; selected rows redistributed with source ID, URL and licence credit.",
    "evidenceQuality": "licensed gazetteer dataset",
    "claims": [
      "City coordinates and time zones are transcribed from the pinned daily export.",
      "Coordinates describe gazetteer points, not precise personal addresses."
    ],
    "limitations": [
      "This curated list is not exhaustive; country labels are dataset groupings.",
      "The browser time-zone database supplies historical offsets; a city label alone is not a birth-time record."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-geonames-schema",
    "title": "GeoNames: export schema",
    "url": "https://download.geonames.org/export/dump/readme.txt",
    "locator": "Main geoname table field definitions",
    "readingDepth": "Coordinate, country-code, time-zone and modification-date fields read",
    "rights": "GeoNames CC BY 4.0; source-linked schema summary.",
    "evidenceQuality": "dataset publisher documentation",
    "claims": [
      "Coordinates use WGS84 decimal degrees and each row includes a time-zone identifier."
    ],
    "limitations": [
      "The number of decimal places is not a guarantee of positional accuracy."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-geonames-license",
    "title": "GeoNames: About and licence",
    "url": "https://www.geonames.org/about.html",
    "locator": "Licence statement in the page footer",
    "readingDepth": "Creative Commons Attribution 4.0 statement read",
    "rights": "CC BY 4.0; https://creativecommons.org/licenses/by/4.0/",
    "evidenceQuality": "dataset publisher licence statement",
    "claims": [
      "GeoNames publishes its database under Creative Commons Attribution 4.0."
    ],
    "limitations": [
      "No separate map-tile service is bundled or needed."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-naturalearth",
    "title": "Natural Earth: 110m land, v5.1.2",
    "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/f1890d9f152c896d250a77557a5751a93d494776/geojson/ne_110m_land.geojson",
    "locator": "geojson/ne_110m_land.geojson at commit f1890d9f152c896d250a77557a5751a93d494776",
    "readingDepth": "Full geometry structurally checked; version and file hash pinned",
    "rights": "Natural Earth public domain. Attribution supplied: Made with Natural Earth.",
    "evidenceQuality": "public-domain cartographic dataset",
    "claims": [
      "127 low-resolution land polygons provide an offline geographic background.",
      "No country-boundary interpretation is required for the land-only map."
    ],
    "limitations": [
      "The 1:110 million geometry is generalized for small-scale display, not navigation or coastline measurement."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-naturalearth-license",
    "title": "Natural Earth: LICENSE.md, v5.1.2",
    "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/LICENSE.md",
    "locator": "Public-domain declaration and permission to modify/disseminate",
    "readingDepth": "Full public-domain and credit paragraphs read",
    "rights": "Public domain; https://github.com/nvkelso/natural-earth-vector/blob/f1890d9f152c896d250a77557a5751a93d494776/LICENSE.md",
    "evidenceQuality": "dataset maintainer licence statement",
    "claims": [
      "Natural Earth vector/raster datasets are public domain and may be modified and redistributed."
    ],
    "limitations": [
      "This licence applies to the map data, not to unrelated astrology text or proprietary branded charts."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-lilly",
    "title": "William Lilly: Christian Astrology, Book I (1647), modern transcription",
    "url": "https://www.worldastrology.net/wp-content/uploads/2008/12/CA-I.pdf",
    "locator": "Printed pp.57–83, selected planetary manners/significations in chapters VIII–XIV",
    "readingDepth": "Selected paragraphs for the seven traditional bodies read; full book not read",
    "rights": "Historical public-domain text through a modern transcription; original neutral paraphrases only",
    "evidenceQuality": "primary historical symbolism, not modern astrocartography or empirical evidence",
    "claims": [
      "The seven traditional bodies have distinct historical thematic associations."
    ],
    "limitations": [
      "Lilly did not supply this modern geographic ranking or the outer-planet notes.",
      "Historical medical, gendered and deterministic claims are not adopted."
    ],
    "retrievedAt": "2026-11-04"
  },
  {
    "id": "acg-editorial",
    "title": "Astrocartography Workbench: authored thematic rubric",
    "url": "docs/2026-11-astrocartography-methods.md",
    "locator": "Interpretive notes, purpose weights and scoring limitations",
    "readingDepth": "Original project-authored thematic prompts and numerical weights; not an external validation dataset",
    "rights": "Original project material; upstream references retain their own rights",
    "evidenceQuality": "explicit editorial design choice",
    "claims": [
      "The purpose weights and reflection prompts are authored for exploration and are not historical tables or trained probabilities."
    ],
    "limitations": [
      "Thematic score is not a forecast, safety rating, place quality, compatibility test or relocation recommendation.",
      "The chosen distance radius is a user-selected comparison parameter, not a proven physical influence range."
    ]
  }
];

export const ASTROCARTOGRAPHY_CITIES = [
  {
    "id": "binghamton",
    "name": "Binghamton",
    "country": "United States",
    "countryCode": "US",
    "lat": 42.09869,
    "lon": -75.91797,
    "timeZone": "America/New_York",
    "geonameId": 5109177,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/5109177/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2017-05-23"
  },
  {
    "id": "indore",
    "name": "Indore",
    "country": "India",
    "countryCode": "IN",
    "lat": 22.71792,
    "lon": 75.8333,
    "timeZone": "Asia/Kolkata",
    "geonameId": 1269743,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1269743/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-06-20"
  },
  {
    "id": "mumbai",
    "name": "Mumbai",
    "country": "India",
    "countryCode": "IN",
    "lat": 19.07283,
    "lon": 72.88261,
    "timeZone": "Asia/Kolkata",
    "geonameId": 1275339,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1275339/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2024-09-05"
  },
  {
    "id": "greenwich",
    "name": "Greenwich",
    "country": "United Kingdom",
    "countryCode": "GB",
    "lat": 51.47785,
    "lon": -0.01176,
    "timeZone": "Europe/London",
    "geonameId": 2647937,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/2647937/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-11-26"
  },
  {
    "id": "new-york",
    "name": "New York City",
    "country": "United States",
    "countryCode": "US",
    "lat": 40.71427,
    "lon": -74.00597,
    "timeZone": "America/New_York",
    "geonameId": 5128581,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/5128581/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-03-07"
  },
  {
    "id": "los-angeles",
    "name": "Los Angeles",
    "country": "United States",
    "countryCode": "US",
    "lat": 34.05223,
    "lon": -118.24368,
    "timeZone": "America/Los_Angeles",
    "geonameId": 5368361,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/5368361/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-07-22"
  },
  {
    "id": "chicago",
    "name": "Chicago",
    "country": "United States",
    "countryCode": "US",
    "lat": 41.85003,
    "lon": -87.65005,
    "timeZone": "America/Chicago",
    "geonameId": 4887398,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/4887398/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-06-21"
  },
  {
    "id": "toronto",
    "name": "Toronto",
    "country": "Canada",
    "countryCode": "CA",
    "lat": 43.65333,
    "lon": -79.38389,
    "timeZone": "America/Toronto",
    "geonameId": 6167865,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/6167865/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-11-02"
  },
  {
    "id": "vancouver",
    "name": "Vancouver",
    "country": "Canada",
    "countryCode": "CA",
    "lat": 49.24966,
    "lon": -123.11934,
    "timeZone": "America/Vancouver",
    "geonameId": 6173331,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/6173331/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-08-04"
  },
  {
    "id": "mexico-city",
    "name": "Mexico City",
    "country": "Mexico",
    "countryCode": "MX",
    "lat": 19.42847,
    "lon": -99.12766,
    "timeZone": "America/Mexico_City",
    "geonameId": 3530597,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3530597/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2024-03-26"
  },
  {
    "id": "havana",
    "name": "Havana",
    "country": "Cuba",
    "countryCode": "CU",
    "lat": 23.13302,
    "lon": -82.38304,
    "timeZone": "America/Havana",
    "geonameId": 3553478,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3553478/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-10-31"
  },
  {
    "id": "san-jose-cr",
    "name": "San José",
    "country": "Costa Rica",
    "countryCode": "CR",
    "lat": 9.93388,
    "lon": -84.08489,
    "timeZone": "America/Costa_Rica",
    "geonameId": 3621849,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3621849/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-05-15"
  },
  {
    "id": "sao-paulo",
    "name": "São Paulo",
    "country": "Brazil",
    "countryCode": "BR",
    "lat": -23.5475,
    "lon": -46.63611,
    "timeZone": "America/Sao_Paulo",
    "geonameId": 3448439,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3448439/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-04-13"
  },
  {
    "id": "buenos-aires",
    "name": "Buenos Aires",
    "country": "Argentina",
    "countryCode": "AR",
    "lat": -34.61315,
    "lon": -58.37723,
    "timeZone": "America/Argentina/Buenos_Aires",
    "geonameId": 3435910,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3435910/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2024-06-19"
  },
  {
    "id": "lima",
    "name": "Lima",
    "country": "Peru",
    "countryCode": "PE",
    "lat": -12.04318,
    "lon": -77.02824,
    "timeZone": "America/Lima",
    "geonameId": 3936456,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3936456/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2023-10-25"
  },
  {
    "id": "bogota",
    "name": "Bogotá",
    "country": "Colombia",
    "countryCode": "CO",
    "lat": 4.60971,
    "lon": -74.08175,
    "timeZone": "America/Bogota",
    "geonameId": 3688689,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3688689/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2024-03-26"
  },
  {
    "id": "london",
    "name": "London",
    "country": "United Kingdom",
    "countryCode": "GB",
    "lat": 51.50853,
    "lon": -0.12574,
    "timeZone": "Europe/London",
    "geonameId": 2643743,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/2643743/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-08-17"
  },
  {
    "id": "paris",
    "name": "Paris",
    "country": "France",
    "countryCode": "FR",
    "lat": 48.85341,
    "lon": 2.3488,
    "timeZone": "Europe/Paris",
    "geonameId": 2988507,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/2988507/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-02-23"
  },
  {
    "id": "berlin",
    "name": "Berlin",
    "country": "Germany",
    "countryCode": "DE",
    "lat": 52.52437,
    "lon": 13.41053,
    "timeZone": "Europe/Berlin",
    "geonameId": 2950159,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/2950159/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-07-22"
  },
  {
    "id": "madrid",
    "name": "Madrid",
    "country": "Spain",
    "countryCode": "ES",
    "lat": 40.4165,
    "lon": -3.70256,
    "timeZone": "Europe/Madrid",
    "geonameId": 3117735,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3117735/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-02-23"
  },
  {
    "id": "rome",
    "name": "Rome",
    "country": "Italy",
    "countryCode": "IT",
    "lat": 41.89193,
    "lon": 12.51133,
    "timeZone": "Europe/Rome",
    "geonameId": 3169070,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3169070/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-07-22"
  },
  {
    "id": "moscow",
    "name": "Moscow",
    "country": "Russia",
    "countryCode": "RU",
    "lat": 55.75204,
    "lon": 37.61781,
    "timeZone": "Europe/Moscow",
    "geonameId": 524901,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/524901/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-09-09"
  },
  {
    "id": "istanbul",
    "name": "Istanbul",
    "country": "Türkiye",
    "countryCode": "TR",
    "lat": 41.01384,
    "lon": 28.94966,
    "timeZone": "Europe/Istanbul",
    "geonameId": 745044,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/745044/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-08-25"
  },
  {
    "id": "cairo",
    "name": "Cairo",
    "country": "Egypt",
    "countryCode": "EG",
    "lat": 30.06263,
    "lon": 31.24967,
    "timeZone": "Africa/Cairo",
    "geonameId": 360630,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/360630/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-08-29"
  },
  {
    "id": "nairobi",
    "name": "Nairobi",
    "country": "Kenya",
    "countryCode": "KE",
    "lat": -1.28333,
    "lon": 36.81667,
    "timeZone": "Africa/Nairobi",
    "geonameId": 184745,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/184745/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2023-12-21"
  },
  {
    "id": "cape-town",
    "name": "Cape Town",
    "country": "South Africa",
    "countryCode": "ZA",
    "lat": -33.92584,
    "lon": 18.42322,
    "timeZone": "Africa/Johannesburg",
    "geonameId": 3369157,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/3369157/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-04-14"
  },
  {
    "id": "lagos",
    "name": "Lagos",
    "country": "Nigeria",
    "countryCode": "NG",
    "lat": 6.45407,
    "lon": 3.39467,
    "timeZone": "Africa/Lagos",
    "geonameId": 2332459,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/2332459/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2023-10-25"
  },
  {
    "id": "johannesburg",
    "name": "Johannesburg",
    "country": "South Africa",
    "countryCode": "ZA",
    "lat": -26.20227,
    "lon": 28.04363,
    "timeZone": "Africa/Johannesburg",
    "geonameId": 993800,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/993800/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-04-14"
  },
  {
    "id": "jerusalem",
    "name": "Jerusalem",
    "country": "Israel",
    "countryCode": "IL",
    "lat": 31.76904,
    "lon": 35.21633,
    "timeZone": "Asia/Jerusalem",
    "geonameId": 281184,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/281184/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-09-23"
  },
  {
    "id": "dubai",
    "name": "Dubai",
    "country": "United Arab Emirates",
    "countryCode": "AE",
    "lat": 25.07725,
    "lon": 55.30927,
    "timeZone": "Asia/Dubai",
    "geonameId": 292223,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/292223/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-04-13"
  },
  {
    "id": "delhi",
    "name": "Delhi",
    "country": "India",
    "countryCode": "IN",
    "lat": 28.65195,
    "lon": 77.23149,
    "timeZone": "Asia/Kolkata",
    "geonameId": 1273294,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1273294/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2024-12-31"
  },
  {
    "id": "singapore",
    "name": "Singapore",
    "country": "Singapore",
    "countryCode": "SG",
    "lat": 1.28967,
    "lon": 103.85007,
    "timeZone": "Asia/Singapore",
    "geonameId": 1880252,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1880252/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-07-23"
  },
  {
    "id": "bangkok",
    "name": "Bangkok",
    "country": "Thailand",
    "countryCode": "TH",
    "lat": 13.75398,
    "lon": 100.50144,
    "timeZone": "Asia/Bangkok",
    "geonameId": 1609350,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1609350/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2024-03-26"
  },
  {
    "id": "hong-kong",
    "name": "Hong Kong",
    "country": "Hong Kong",
    "countryCode": "HK",
    "lat": 22.27832,
    "lon": 114.17469,
    "timeZone": "Asia/Hong_Kong",
    "geonameId": 1819729,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1819729/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-08-25"
  },
  {
    "id": "beijing",
    "name": "Beijing",
    "country": "China",
    "countryCode": "CN",
    "lat": 39.9075,
    "lon": 116.39723,
    "timeZone": "Asia/Shanghai",
    "geonameId": 1816670,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1816670/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-12-15"
  },
  {
    "id": "tokyo",
    "name": "Tokyo",
    "country": "Japan",
    "countryCode": "JP",
    "lat": 35.6895,
    "lon": 139.69171,
    "timeZone": "Asia/Tokyo",
    "geonameId": 1850147,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1850147/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2025-07-22"
  },
  {
    "id": "seoul",
    "name": "Seoul",
    "country": "South Korea",
    "countryCode": "KR",
    "lat": 37.566,
    "lon": 126.9784,
    "timeZone": "Asia/Seoul",
    "geonameId": 1835848,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/1835848/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2024-12-01"
  },
  {
    "id": "sydney",
    "name": "Sydney",
    "country": "Australia",
    "countryCode": "AU",
    "lat": -33.86785,
    "lon": 151.20732,
    "timeZone": "Australia/Sydney",
    "geonameId": 2147714,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/2147714/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-06-24"
  },
  {
    "id": "auckland",
    "name": "Auckland",
    "country": "New Zealand",
    "countryCode": "NZ",
    "lat": -36.84853,
    "lon": 174.76349,
    "timeZone": "Pacific/Auckland",
    "geonameId": 2193733,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/2193733/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-05-02"
  },
  {
    "id": "honolulu",
    "name": "Honolulu",
    "country": "United States",
    "countryCode": "US",
    "lat": 21.30694,
    "lon": -157.85833,
    "timeZone": "Pacific/Honolulu",
    "geonameId": 5856195,
    "sourceIds": [
      "acg-geonames",
      "acg-geonames-schema",
      "acg-geonames-license"
    ],
    "sourceURL": "https://www.geonames.org/5856195/",
    "coordinateNote": "GeoNames gazetteer point, not a precise personal address.",
    "datasetModifiedAt": "2026-04-14"
  }
];

export const ASTROCARTOGRAPHY_PLANET_NOTES = {
  "Sun": {
    "label": "Sun",
    "glyph": "☉",
    "color": "#fbbf24",
    "themes": [
      "visibility",
      "purpose",
      "self-expression"
    ],
    "cautions": [
      "Seeking approval can crowd out other priorities."
    ],
    "questions": [
      "What work would you want to be known for?"
    ],
    "actions": [
      "Try a small presentation and assess the actual response."
    ],
    "sourceIds": [
      "acg-lilly",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Moon": {
    "label": "Moon",
    "glyph": "☽",
    "color": "#c4d8ff",
    "themes": [
      "belonging",
      "care",
      "daily rhythm"
    ],
    "cautions": [
      "A familiar feeling is not evidence that a place will meet practical needs."
    ],
    "questions": [
      "Which routines and relationships make daily life workable?"
    ],
    "actions": [
      "Compare sleep routines, support and practical home needs."
    ],
    "sourceIds": [
      "acg-lilly",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Mercury": {
    "label": "Mercury",
    "glyph": "☿",
    "color": "#67e8f9",
    "themes": [
      "learning",
      "communication",
      "exchange"
    ],
    "cautions": [
      "Too many commitments can fragment attention."
    ],
    "questions": [
      "Which learning or communication opportunity can you verify?"
    ],
    "actions": [
      "Look up a real course, library or professional group."
    ],
    "sourceIds": [
      "acg-lilly",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Venus": {
    "label": "Venus",
    "glyph": "♀",
    "color": "#f9a8d4",
    "themes": [
      "cooperation",
      "art",
      "enjoyment"
    ],
    "cautions": [
      "Social ease does not remove the need for boundaries or a budget."
    ],
    "questions": [
      "Which shared interests would help you connect?"
    ],
    "actions": [
      "Try one affordable social or creative activity."
    ],
    "sourceIds": [
      "acg-lilly",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Mars": {
    "label": "Mars",
    "glyph": "♂",
    "color": "#fb7185",
    "themes": [
      "initiative",
      "effort",
      "assertiveness"
    ],
    "cautions": [
      "Urgency can outpace planning; this is not a prediction of violence."
    ],
    "questions": [
      "Where would deliberate effort be useful?"
    ],
    "actions": [
      "Set one bounded goal and a realistic recovery period."
    ],
    "sourceIds": [
      "acg-lilly",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Jupiter": {
    "label": "Jupiter",
    "glyph": "♃",
    "color": "#c4b5fd",
    "themes": [
      "learning",
      "perspective",
      "generosity"
    ],
    "cautions": [
      "Optimism can overstate resources or opportunity."
    ],
    "questions": [
      "Which opportunity is supported by concrete information?"
    ],
    "actions": [
      "Compare eligibility, cost and likely workload before committing."
    ],
    "sourceIds": [
      "acg-lilly",
      "acg-angles",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Saturn": {
    "label": "Saturn",
    "glyph": "♄",
    "color": "#cbd5e1",
    "themes": [
      "structure",
      "patience",
      "responsibility"
    ],
    "cautions": [
      "Excessive demands can crowd out rest and support."
    ],
    "questions": [
      "Which commitment is worth maintaining over time?"
    ],
    "actions": [
      "Choose a sustainable schedule and define a clear limit."
    ],
    "sourceIds": [
      "acg-lilly",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Uranus": {
    "label": "Uranus",
    "glyph": "♅",
    "color": "#5eead4",
    "themes": [
      "novelty",
      "independence",
      "experimentation"
    ],
    "cautions": [
      "Novelty does not make an option automatically useful."
    ],
    "questions": [
      "What can you test without abandoning a necessary support?"
    ],
    "actions": [
      "Run a reversible experiment before making a large change."
    ],
    "sourceIds": [
      "acg-uranus",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Neptune": {
    "label": "Neptune",
    "glyph": "♆",
    "color": "#93c5fd",
    "themes": [
      "imagination",
      "ideals",
      "compassion"
    ],
    "cautions": [
      "An appealing story may conceal missing practical information."
    ],
    "questions": [
      "Which hope can be translated into an observable action?"
    ],
    "actions": [
      "Keep a creative practice while verifying promises and costs."
    ],
    "sourceIds": [
      "acg-neptune",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "Pluto": {
    "label": "Pluto",
    "glyph": "♇",
    "color": "#d8b4fe",
    "themes": [
      "renewal",
      "depth",
      "power and boundaries"
    ],
    "cautions": [
      "Intensity is not proof that a place is destined or dangerous."
    ],
    "questions": [
      "Which boundary or outdated commitment needs a careful review?"
    ],
    "actions": [
      "Review one commitment without treating a symbol as an instruction."
    ],
    "sourceIds": [
      "acg-pluto",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  }
};

export const ASTROCARTOGRAPHY_ANGLE_NOTES = {
  "ASC": {
    "label": "Ascendant / rising",
    "geometry": "Body centre on the eastern geometric horizon; not automatically the ecliptic Ascendant longitude.",
    "themes": [
      "presentation",
      "initiative",
      "meeting a new setting"
    ],
    "cautions": [
      "A map line does not determine personality."
    ],
    "questions": [
      "How would you like to introduce yourself here?"
    ],
    "actions": [
      "Test one new routine or introduction."
    ],
    "sourceIds": [
      "acg-method",
      "acg-lewis",
      "acg-angles",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "DSC": {
    "label": "Descendant / setting",
    "geometry": "Body centre on the western geometric horizon.",
    "themes": [
      "relationships",
      "collaboration",
      "encounter"
    ],
    "cautions": [
      "A line does not describe the character or intentions of other people."
    ],
    "questions": [
      "Which relationships could be developed through real shared activity?"
    ],
    "actions": [
      "Look for an actual community or collaboration."
    ],
    "sourceIds": [
      "acg-method",
      "acg-lewis",
      "acg-angles",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "MC": {
    "label": "Midheaven / upper meridian",
    "geometry": "Body crosses the local upper meridian; directly overhead only at the matching declination and latitude.",
    "themes": [
      "public role",
      "career",
      "visibility"
    ],
    "cautions": [
      "Meridian proximity does not guarantee work or recognition."
    ],
    "questions": [
      "What opportunities and requirements exist in practice?"
    ],
    "actions": [
      "Check a concrete role, programme or professional contact."
    ],
    "sourceIds": [
      "acg-method",
      "acg-lewis",
      "acg-angles",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  },
  "IC": {
    "label": "Imum Coeli / lower meridian",
    "geometry": "Body crosses the opposite lower meridian; not necessarily beneath the local horizon for every latitude.",
    "themes": [
      "home",
      "roots",
      "private life"
    ],
    "cautions": [
      "A symbolic feeling of home does not establish housing or support."
    ],
    "questions": [
      "What would make everyday private life sustainable?"
    ],
    "actions": [
      "Compare housing, access and trusted support."
    ],
    "sourceIds": [
      "acg-method",
      "acg-lewis",
      "acg-angles",
      "acg-editorial"
    ],
    "basis": "Original conditional reflection prompts informed by the named Western sources. They are not quotations, diagnoses or validated predictions of what a location will cause."
  }
};

export const ASTROCARTOGRAPHY_PURPOSES = [
  {
    "id": "overview",
    "label": "Angular emphasis",
    "description": "Show proximity to the selected angular themes without assigning a life goal.",
    "planetWeights": {
      "Sun": 1,
      "Moon": 1,
      "Mercury": 1,
      "Venus": 1,
      "Mars": 1,
      "Jupiter": 1,
      "Saturn": 1,
      "Uranus": 1,
      "Neptune": 1,
      "Pluto": 1
    },
    "angleWeights": {
      "ASC": 1,
      "DSC": 1,
      "MC": 1,
      "IC": 1
    },
    "sourceIds": [
      "acg-editorial",
      "acg-lewis"
    ],
    "limits": [
      "Weights are visible project-authored choices, not an ancient table or statistical estimate.",
      "Positive/negative means fit/friction within the selected symbolic rubric, not beneficial/harmful events.",
      "Check ordinary practical evidence before any consequential location decision."
    ]
  },
  {
    "id": "career",
    "label": "Career themes",
    "description": "Explore visibility, communication, initiative and durable work structures.",
    "planetWeights": {
      "Sun": 2,
      "Moon": 0.25,
      "Mercury": 1.5,
      "Venus": 0.5,
      "Mars": 1,
      "Jupiter": 1.5,
      "Saturn": 1.5,
      "Uranus": 0.5,
      "Neptune": -0.5,
      "Pluto": 0.5
    },
    "angleWeights": {
      "ASC": 0.6,
      "DSC": 0.5,
      "MC": 1,
      "IC": 0.2
    },
    "sourceIds": [
      "acg-editorial",
      "acg-lewis"
    ],
    "limits": [
      "Weights are visible project-authored choices, not an ancient table or statistical estimate.",
      "Positive/negative means fit/friction within the selected symbolic rubric, not beneficial/harmful events.",
      "Check ordinary practical evidence before any consequential location decision."
    ]
  },
  {
    "id": "relationships",
    "label": "Relationship themes",
    "description": "Explore cooperation, belonging and communication; tension labels are reflective prompts.",
    "planetWeights": {
      "Sun": 0.5,
      "Moon": 1.5,
      "Mercury": 1,
      "Venus": 2,
      "Mars": -0.5,
      "Jupiter": 1,
      "Saturn": 0.5,
      "Uranus": -0.5,
      "Neptune": 0.25,
      "Pluto": -0.5
    },
    "angleWeights": {
      "ASC": 0.5,
      "DSC": 1,
      "MC": 0.25,
      "IC": 0.75
    },
    "sourceIds": [
      "acg-editorial",
      "acg-lewis"
    ],
    "limits": [
      "Weights are visible project-authored choices, not an ancient table or statistical estimate.",
      "Positive/negative means fit/friction within the selected symbolic rubric, not beneficial/harmful events.",
      "Check ordinary practical evidence before any consequential location decision."
    ]
  },
  {
    "id": "home",
    "label": "Home themes",
    "description": "Explore care, supportive routines and private-life stability.",
    "planetWeights": {
      "Sun": 0.5,
      "Moon": 2,
      "Mercury": 0.5,
      "Venus": 1,
      "Mars": -0.5,
      "Jupiter": 0.75,
      "Saturn": 1,
      "Uranus": -0.75,
      "Neptune": 0.25,
      "Pluto": -0.25
    },
    "angleWeights": {
      "ASC": 0.4,
      "DSC": 0.5,
      "MC": 0.2,
      "IC": 1
    },
    "sourceIds": [
      "acg-editorial",
      "acg-lewis"
    ],
    "limits": [
      "Weights are visible project-authored choices, not an ancient table or statistical estimate.",
      "Positive/negative means fit/friction within the selected symbolic rubric, not beneficial/harmful events.",
      "Check ordinary practical evidence before any consequential location decision."
    ]
  },
  {
    "id": "study",
    "label": "Study themes",
    "description": "Explore inquiry, concentration, perspective and experimentation.",
    "planetWeights": {
      "Sun": 0.5,
      "Moon": 0.25,
      "Mercury": 2,
      "Venus": 0.25,
      "Mars": 0.5,
      "Jupiter": 1.5,
      "Saturn": 1.5,
      "Uranus": 1,
      "Neptune": -0.25,
      "Pluto": 0.5
    },
    "angleWeights": {
      "ASC": 0.75,
      "DSC": 0.4,
      "MC": 0.75,
      "IC": 0.5
    },
    "sourceIds": [
      "acg-editorial",
      "acg-lewis"
    ],
    "limits": [
      "Weights are visible project-authored choices, not an ancient table or statistical estimate.",
      "Positive/negative means fit/friction within the selected symbolic rubric, not beneficial/harmful events.",
      "Check ordinary practical evidence before any consequential location decision."
    ]
  },
  {
    "id": "structure",
    "label": "Structure themes",
    "description": "Explore sustained effort, defined responsibilities and manageable routines.",
    "planetWeights": {
      "Sun": 1,
      "Moon": 0.75,
      "Mercury": 1,
      "Venus": 0.25,
      "Mars": 1,
      "Jupiter": 0.5,
      "Saturn": 2,
      "Uranus": -0.75,
      "Neptune": -0.75,
      "Pluto": 0.5
    },
    "angleWeights": {
      "ASC": 0.5,
      "DSC": 0.3,
      "MC": 0.8,
      "IC": 1
    },
    "sourceIds": [
      "acg-editorial",
      "acg-lewis"
    ],
    "limits": [
      "Weights are visible project-authored choices, not an ancient table or statistical estimate.",
      "Positive/negative means fit/friction within the selected symbolic rubric, not beneficial/harmful events.",
      "Check ordinary practical evidence before any consequential location decision."
    ]
  }
];

