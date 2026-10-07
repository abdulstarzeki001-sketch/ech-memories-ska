const fs = require("fs");
const path = require("path");

const root = process.cwd();
const out = path.join(root, "public");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const files = [
  "index.html", "home.html", "photos.html", "journey.html",
  "songs.html", "videos.html", "writings.html", "_headers"
];

for (const file of files) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(out, file));
}

console.log("Prepared clean Cloudflare assets:", fs.readdirSync(out).join(", "));
