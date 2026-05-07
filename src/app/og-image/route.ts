import { site } from "@/lib/site";

export function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="72" y="72" width="1056" height="486" fill="#ffffff" stroke="#b91c1c" stroke-width="6"/>
  <text x="128" y="150" fill="#b91c1c" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" letter-spacing="4">KD GLOBAL</text>
  <text x="128" y="302" fill="#111111" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="900">${escapeXml(site.name)}</text>
  <text x="128" y="374" fill="#404040" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="500">Christian books, eBooks, publishing services,</text>
  <text x="128" y="420" fill="#404040" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="500">and sermon-to-book production.</text>
  <text x="128" y="510" fill="#111111" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800">Publish truth-filled books that teach, transform, and endure.</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/svg+xml",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
