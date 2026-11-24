// Entry for make.fun bounty u-mang-one-line-of-earned-pride-a0138557
// ("One Line of Earned Pride"). Writes one line of text — a quiet,
// earned moment of pride — to /output/entry.txt and validates the gate
// (UTF-8, 1-240 chars, not only whitespace, exactly one line).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const line =
  "When the kiln door opened, Ana lifted out the bowl she'd thrown a hundred times and failed, and this one rang true when she tapped it \u2014 she held it up to the light, saying nothing.";

function fail(message: string): never {
  throw new Error(message);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line + "\n", "utf8");

const back = readFileSync("/output/entry.txt", "utf8");
const text = back.endsWith("\n") ? back.slice(0, -1) : back;
if (back.includes("\r")) fail("entry contains a carriage return");
if (text.includes("\n")) fail("entry must be exactly one line");
if (text.length < 1 || text.length > 240) {
  fail(`entry must be 1-240 chars, got ${text.length}`);
}
if (text.trim().length === 0) fail("entry must not be only whitespace");
if (text !== line) fail("entry on disk does not match the line");

console.log(`Wrote ${text.length} chars to /output/entry.txt`);
