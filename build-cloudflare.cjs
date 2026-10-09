const fs = require("fs");
const path = require("path");

const root = process.cwd();
const out = path.join(root, "public");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const files = [
  "index.html", "home.html", "photos.html", "journey.html",
  "songs.html", "videos.html", "writings.html", "feelings.html", "nafsam-media.json", "i18n.js", "page-audio.js", "json-text-loader.js", "apple-touch-icon.png", "manifest.webmanifest", "_headers", "_redirects"
];

for (const file of files) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(out, file));
}

console.log("Prepared clean Cloudflare assets:", fs.readdirSync(out).join(", "));
