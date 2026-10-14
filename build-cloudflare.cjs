const fs = require("fs");
const path = require("path");

const root = process.cwd();
const out = path.join(root, "public");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const files = [
  "index.html", "home.html", "photos.html", "journey.html",
  "songs.html", "videos.html", "writings.html", "feelings.html", "nafsam-media.json", "i18n.js", "page-audio.js", "json-text-loader.js", "apple-touch-icon.png", "manifest.webmanifest", "_headers", "_redirects", "mobile-responsive.css", "mobile-touch.js", "site-nav.js", "sw.js", "cosmic-system.css", "cosmic-system.js"
];

for (const file of files) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(out, file));
}

// Publish the viewer shell only. Do not include personal conversations or media.
const archiveDir = path.join(root, "archive-private-viewer");
if (fs.existsSync(archiveDir)) {
  fs.cpSync(archiveDir, path.join(out, "archive-private-viewer"), { recursive: true });
}

console.log("Prepared clean Cloudflare assets:", fs.readdirSync(out).join(", "));
