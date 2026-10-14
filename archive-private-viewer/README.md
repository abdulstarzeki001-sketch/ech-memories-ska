# ECH Archive — Privacy-safe viewer

This branch stores source code for a client-side Arabic ZIP/JSON archive viewer. **No private conversation content or media is committed.**

Usage: open the deployed viewer and choose `ECH_ELHAM_EVERYTHING_COMPLETE_2026.zip` in the iPhone Files picker. JSZip extracts `data/conversations.json` and `data/NAFSAM_MEDIA_FULL_MANIFEST.json` in the browser. Nothing is uploaded to the server; the user can clear the in-memory session.

The media manifest links to externally hosted files that may be unavailable. A public static website is **not** a secure private archive. Do not upload personal chat logs, voice recordings, or images to public repositories.
