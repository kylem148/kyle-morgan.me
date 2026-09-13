import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LINKS, PROFILE } from "./profile";

const PHOTO_PATH = join(process.cwd(), "src/app/(connect)/connect/_assets/profile.jpg");

export const VCARD_FILENAME = `${PROFILE.name}.vcf`;

// vCard 3.0 (RFC 2426): backslash-escape text values, fold lines at 75 octets.
const esc = (value: string) => value.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

const fold = (line: string) =>
  [line.slice(0, 75), ...(line.slice(75).match(/.{1,74}/g) ?? [])].join("\r\n ");

export async function buildVCard(connectedOn = new Date()) {
  const photo = await readFile(PHOTO_PATH);
  // en-CA formats as YYYY-MM-DD, which is what Apple Contacts expects for X-ABDATE.
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(
    connectedOn,
  );

  const linkLines = LINKS.flatMap((link, i) => {
    const item = `item${i + 2}`;
    const value =
      link.service === "email"
        ? `EMAIL;type=INTERNET;type=pref:${PROFILE.email}`
        : `URL;type=pref:${link.href}`;
    return [`${item}.${value}`, `${item}.X-ABLabel:${esc(link.title)}`];
  });
  const dateItem = `item${LINKS.length + 2}`;
  const profileItem = `item${LINKS.length + 3}`;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//kyle-morgan.me//connect//EN",
    `N:${esc(PROFILE.lastName)};${esc(PROFILE.firstName)};;;`,
    `FN:${esc(PROFILE.name)}`,
    `ORG:${esc(`${PROFILE.work} | ${PROFILE.company}`)}`,
    `TITLE:${esc(PROFILE.headline)}`,
    `ROLE:${esc(PROFILE.education)}`,
    `CATEGORIES:${PROFILE.skills.map(esc).join(",")}`,
    `item1.ADR;type=pref:;;;${esc(PROFILE.location)};;;`,
    "item1.X-ABLabel:My Location",
    ...linkLines,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo.toString("base64")}`,
    `${dateItem}.X-ABDATE;type=pref:${date}`,
    `${dateItem}.X-ABLabel:Date Connected`,
    `${profileItem}.URL;type=pref:${PROFILE.url}`,
    `${profileItem}.X-ABLabel:${esc(`${PROFILE.name}'s Profile`)}`,
    "END:VCARD",
  ];

  return `${lines.map(fold).join("\r\n")}\r\n`;
}
