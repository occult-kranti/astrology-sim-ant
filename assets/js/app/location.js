// ============================================================================
//  location.js — a small, reusable LOCATION service for the tools. Lets a user
//  find the place nearest to a pair of coordinates (offline, from the curated
//  CITIES list) and, in a browser, fill lat/lon inputs from device geolocation.
//
//  Privacy & requirements:
//    • No external geocoding is used. The only place-name lookup is offline:
//      the nearest known city by great-circle (haversine) distance to the given
//      coordinates. Nothing about the user's position leaves the page.
//    • navigator.geolocation requires a secure context — it only works over
//      HTTPS or on localhost. Off a secure origin the browser will refuse it,
//      and useMyLocation() rejects with a clear Error.
// ============================================================================

import { CITIES } from './shared.js';

const EARTH_R_KM = 6371; // mean Earth radius

// Great-circle distance between two lat/lon points, in kilometres.
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_R_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

// Closest entry in CITIES to (lat, lon) by great-circle distance. Pure.
// Returns { name, lat, lon, offset, distanceKm }.
export function nearestCity(lat, lon) {
  let best = null;
  let bestKm = Infinity;
  for (const [name, cLat, cLon, offset] of CITIES) {
    const km = haversineKm(lat, lon, cLat, cLon);
    if (km < bestKm) {
      bestKm = km;
      best = { name, lat: cLat, lon: cLon, offset, distanceKm: km };
    }
  }
  return best;
}

// Resolve to {lat, lon, accuracy} from the device. Browser only.
// Rejects with a clear Error if geolocation is unavailable or denied.
export function useMyLocation() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not available in this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        resolve({ lat: latitude, lon: longitude, accuracy });
      },
      err => {
        const msg =
          err && err.code === 1
            ? 'Location permission was denied.'
            : 'Could not determine your location (requires HTTPS or localhost).';
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

// Wire a click handler on `button` that fills the lat/lon inputs from the
// device's location, reports the nearest known city in `statusEl`, and calls
// onDone({lat,lon}). Everything is guarded; this never throws.
export function attachGeolocate(button, latInput, lonInput, statusEl, onDone) {
  if (!button || typeof button.addEventListener !== 'function') return;
  const setStatus = msg => {
    try { if (statusEl) statusEl.textContent = msg; } catch (e) { /* non-fatal */ }
  };
  button.addEventListener('click', async () => {
    setStatus('Locating…');
    try {
      const { lat, lon } = await useMyLocation();
      const r4 = n => Math.round(n * 1e4) / 1e4;
      try {
        if (latInput) latInput.value = r4(lat);
        if (lonInput) lonInput.value = r4(lon);
      } catch (e) { /* non-fatal */ }
      const near = nearestCity(lat, lon);
      setStatus(near ? `Near ${near.name}` : 'Location set.');
      if (typeof onDone === 'function') {
        try { onDone({ lat, lon }); } catch (e) { /* non-fatal */ }
      }
    } catch (err) {
      setStatus((err && err.message) || 'Could not determine your location.');
    }
  });
}
