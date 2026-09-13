import { buildVCard, VCARD_FILENAME } from "../vcard";

export async function GET() {
  return new Response(await buildVCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${VCARD_FILENAME}"`,
      "Cache-Control": "private, max-age=0",
    },
  });
}
