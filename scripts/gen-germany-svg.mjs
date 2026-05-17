import { writeFileSync } from "fs";

const GEO_URL = "https://raw.githubusercontent.com/mledoze/countries/master/data/deu.geo.json";
const res = await fetch(GEO_URL);
const fc = await res.json();

const geom = fc.features[0].geometry; // MultiPolygon

// Flatten all rings from all polygons
const rings = [];
for (const poly of geom.coordinates) rings.push(...poly);

// Pick the largest ring — mainland Germany
const mainland = rings.sort((a, b) => b.length - a.length)[0];

// Germany geographic bounds
const LON_MIN = 5.87, LON_MAX = 15.04;
const LAT_MIN = 47.27, LAT_MAX = 55.06;
const W = 400, H = 360;

const project = ([lon, lat]) => {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN) * W).toFixed(2);
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * H).toFixed(2);
  return `${x},${y}`;
};

const d = mainland.map((pt, i) => `${i === 0 ? "M" : "L"}${project(pt)}`).join(" ") + " Z";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <path d="${d}" fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;

writeFileSync("public/germany-outline.svg", svg);
console.log(`Written — ${mainland.length} points, ${svg.length} bytes`);
