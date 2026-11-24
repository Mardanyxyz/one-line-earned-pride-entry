// Entry for make.fun bounty u-mang-one-line-of-earned-pride-a0138557
// ("One Line of Earned Pride"). Writes one line of text — a quiet,
// earned moment of pride — to /output/entry.txt and validates the gate
// (UTF-8, 1-240 chars, not only whitespace, exactly one line).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = `${OUTPUT_DIR}/entry.txt`;
const MAX_CHARS = 240;

const ENTRY =
  "When the kiln door opened, Ana lifted out the bowl she'd thrown a hundred times and failed, and this one rang true when she tapped it \u2014 she held it up to the light, saying nothing.";

function fail(message: string): never {
  throw new Error(message);
}

// The gate, checked before anything is written and again after the
// round-trip through disk, so a bad line can never reach the judge.
function validateEntry(text: string): void {
  if (text.includes("\r")) fail("entry contains a carriage return");
  if (text.includes("\n")) fail("entry must be exactly one line");
  if (text.length < 1 || text.length > MAX_CHARS) {
    fail(`entry must be 1-${MAX_CHARS} chars, got ${text.length}`);
  }
  if (text.trim().length === 0) fail("entry must not be only whitespace");
  if (text !== text.trim()) {
    fail("entry must not start or end with whitespace");
  }
  // No invisible control characters: the line must read exactly as shown.
  for (const ch of text) {
    if (ch.codePointAt(0)! < 0x20 && ch !== "\t") {
      fail(`entry contains a control character U+${ch
        .codePointAt(0)!
        .toString(16)
        .padStart(4, "0")}`);
    }
  }
}

function writeEntry(line: string): void {
  validateEntry(line);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, line + "\n", "utf8");
}

function main(): void {
  writeEntry(ENTRY);

  const back = readFileSync(OUTPUT_FILE, "utf8");
  const text = back.endsWith("\n") ? back.slice(0, -1) : back;
  validateEntry(text);
  if (text !== ENTRY) fail("entry on disk does not match the line");

  console.log(`Wrote ${text.length} chars to ${OUTPUT_FILE}`);
}

main();
