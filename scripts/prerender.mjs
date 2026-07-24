/**
 * Post-build prerender: writes per-route HTML with unique meta, JSON-LD,
 * and crawlable static content so city pages can rank before JS runs.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const siteUrl = (process.env.VITE_SITE_URL || 'https://bugetroamers.com').replace(
  /\/$/,
  '',
);

const destinations = require(path.join(root, 'src/data/destinations.json'));
const descriptions = await loadTsObjectExport(
  path.join(root, 'src/data/destinationDescriptions.ts'),
  'destinationDescriptions',
);
const explore = await loadTsObjectExport(
  path.join(root, 'src/data/destinationExplore.ts'),
  'destinationExplore',
);
const dishes = await loadTsObjectExport(
  path.join(root, 'src/data/destinationDishes.ts'),
  'destinationDishes',
);

const template = await readFile(path.join(distDir, 'index.html'), 'utf8');

const staticRoutes = [
  {
    routePath: '/',
    filePath: path.join(distDir, 'index.html'),
    title: 'Budget Roamers — Trip Cost Estimator',
    description:
      'Estimate your trip cost before you book. Compare destinations, dates, transport, and daily budgets with Budget Roamers.',
    body: homeBody(),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Budget Roamers',
      url: siteUrl,
    },
  },
  {
    routePath: '/destinations',
    filePath: path.join(distDir, 'destinations', 'index.html'),
    title: 'City Trip Cost Guides — Budget Roamers',
    description:
      'Browse destination guides with trip cost calculators, top attractions, must-try dishes, and currency conversion.',
    body: destinationsIndexBody(),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'City Trip Cost Guides',
      url: `${siteUrl}/destinations`,
    },
  },
  {
    routePath: '/about',
    filePath: path.join(distDir, 'about', 'index.html'),
    title: 'About — Budget Roamers',
    description:
      'Learn how Budget Roamers helps travelers estimate trip costs before booking.',
    body: `<main class="seo-static__panel"><h1>About Budget Roamers</h1><p>We help travelers estimate trip costs before they book.</p></main>`,
    jsonLd: null,
  },
  {
    routePath: '/contact',
    filePath: path.join(distDir, 'contact', 'index.html'),
    title: 'Contact — Budget Roamers',
    description:
      'Contact Budget Roamers with feedback, destination suggestions, or questions about trip estimates.',
    body: `<main class="seo-static__panel"><h1>Contact</h1><p>Partner and traveler inquiries are welcome.</p></main>`,
    jsonLd: null,
  },
  {
    routePath: '/partners',
    filePath: path.join(distDir, 'partners', 'index.html'),
    title: 'Partners — Budget Roamers',
    description:
      'Advertise and affiliate with Budget Roamers. Reach travelers who are actively estimating trip costs.',
    body: `<main class="seo-static__panel"><h1>Partners</h1><p>Affiliate, sponsorship, and newsletter inventory for travel brands.</p><p><a href="mailto:partners@bugetroamers.com">partners@bugetroamers.com</a></p></main>`,
    jsonLd: null,
  },
];

for (const destination of destinations) {
  const info = explore[destination.id] ?? {};
  const description =
    descriptions[destination.id] ??
    `Estimate trip costs for ${destination.name}, ${destination.country}.`;
  const topAttractions = (info.topAttractions ?? []).slice(0, 5);
  const mustTry = dishes[destination.id] ?? [];

  staticRoutes.push({
    routePath: `/destinations/${destination.id}`,
    filePath: path.join(distDir, 'destinations', destination.id, 'index.html'),
    title: `${destination.name} Trip Cost Estimate — Budget Roamers`,
    description: `Plan a trip to ${destination.name}: cost calculator, top attractions, must-try dishes, and currency conversion. ${description}`,
    body: destinationBody(destination, description, info, topAttractions, mustTry),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: destination.name,
      description,
      url: `${siteUrl}/destinations/${destination.id}`,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: destination.lat,
        longitude: destination.lng,
      },
    },
  });
}

for (const route of staticRoutes) {
  await mkdir(path.dirname(route.filePath), { recursive: true });
  await writeFile(route.filePath, renderHtml(route), 'utf8');
}

await writeFile(
  path.join(distDir, 'sitemap.xml'),
  buildSitemap(staticRoutes.map((route) => route.routePath)),
  'utf8',
);
await writeFile(
  path.join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
  'utf8',
);

console.log(`Prerendered ${staticRoutes.length} routes → dist/`);

function renderHtml(route) {
  const canonical = `${siteUrl}${route.routePath === '/' ? '/' : route.routePath}`;
  let html = template;
  html = replaceTag(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`,
  );
  html = upsertMeta(html, 'name', 'description', route.description);
  html = upsertMeta(html, 'property', 'og:title', route.title);
  html = upsertMeta(html, 'property', 'og:description', route.description);
  html = upsertMeta(html, 'property', 'og:type', 'website');
  html = upsertMeta(html, 'property', 'og:url', canonical);
  html = upsertLink(html, 'canonical', canonical);

  const jsonLd = route.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>`
    : '';
  const seoBlock = `
    <div id="seo-static" class="seo-static">
      ${route.body}
      <p class="seo-static__app-note">Loading the interactive trip planner…</p>
    </div>
    ${jsonLd}
  `;

  if (html.includes('<div id="root"></div>')) {
    html = html.replace(
      '<div id="root"></div>',
      `${seoBlock}<div id="root"></div>`,
    );
  } else {
    html = html.replace('</body>', `${seoBlock}</body>`);
  }
  return html;
}

function homeBody() {
  const cards = destinations
    .slice(0, 8)
    .map(
      (destination) =>
        `<li><a href="/destinations/${destination.id}">${escapeHtml(destination.name)}, ${escapeHtml(destination.country)}</a></li>`,
    )
    .join('');
  return `<main class="seo-static__panel"><h1>Estimate your trip cost before you book</h1><p>Use the general calculator or open a city guide with attractions, dishes, and a dedicated cost estimate.</p><h2>Popular destinations</h2><ul>${cards}</ul></main>`;
}

function destinationsIndexBody() {
  const cards = destinations
    .map(
      (destination) =>
        `<li><a href="/destinations/${destination.id}"><strong>${escapeHtml(destination.name)}</strong> — ${escapeHtml(destination.country)} (from $${destination.dailyBudget}/day)</a></li>`,
    )
    .join('');
  return `<main class="seo-static__panel"><h1>City trip cost guides</h1><ul>${cards}</ul></main>`;
}

function destinationBody(destination, description, info, topAttractions, mustTry) {
  const attractions = topAttractions
    .map(
      (item, index) =>
        `<li><strong>${index + 1}. ${escapeHtml(item.name)}</strong> — ${escapeHtml(item.blurb)}</li>`,
    )
    .join('');
  const food = mustTry
    .map(
      (dish) =>
        `<li><strong>${escapeHtml(dish.name)}</strong> — ${escapeHtml(dish.blurb)} (avg $${Number(dish.averagePriceUsd).toFixed(2)})</li>`,
    )
    .join('');
  return `<main class="seo-static__panel">
    <h1>${escapeHtml(destination.name)} trip cost estimate</h1>
    <p>${escapeHtml(description)}</p>
    <p>Daily budget baseline: $${destination.dailyBudget} USD. ${escapeHtml(info.bestFor ?? '')}</p>
    <h2>Top attractions</h2>
    <ol>${attractions || '<li>Coming soon</li>'}</ol>
    <h2>Must-try dishes</h2>
    <ul>${food || '<li>Coming soon</li>'}</ul>
    <p><a href="/">Open the general calculator</a></p>
  </main>`;
}

function buildSitemap(routes) {
  const urls = routes
    .map(
      (routePath) =>
        `  <url><loc>${siteUrl}${routePath === '/' ? '/' : routePath}</loc></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function upsertMeta(html, attr, key, content) {
  const pattern = new RegExp(
    `<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`,
    'i',
  );
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertLink(html, rel, href) {
  const pattern = new RegExp(`<link\\s+rel="${rel}"\\s+href="[^"]*"\\s*/?>`, 'i');
  const tag = `<link rel="${rel}" href="${escapeAttr(href)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function replaceTag(html, pattern, next) {
  return pattern.test(html)
    ? html.replace(pattern, next)
    : html.replace('</head>', `${next}</head>`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", '&#39;');
}

async function loadTsObjectExport(filePath, exportName) {
  const source = await readFile(filePath, 'utf8');
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start === -1) return {};
  const after = source.slice(start + marker.length);
  const eq = after.indexOf('=');
  const body = after.slice(eq + 1).trim();
  const end = findMatchingBrace(body);
  const objectLiteral = body.slice(0, end + 1);
  try {
    // Object literals in these data files are plain JS-compatible values.
    return Function(`"use strict"; return (${objectLiteral});`)();
  } catch (error) {
    console.warn(`Failed to parse ${exportName} from ${filePath}`, error);
    return {};
  }
}

function findMatchingBrace(text) {
  let depth = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    if (text[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return text.length - 1;
}
