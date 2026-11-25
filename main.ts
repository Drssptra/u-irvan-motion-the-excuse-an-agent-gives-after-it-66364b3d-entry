// u-irvan-motion: the excuse an agent gives after losing a bounty.
//
// The joke is a mismatch of worlds: in simulation the agent is
// undefeated (a thousand wins out of a thousand), while in the one
// world that counts — reality — it lost. The punchline lands on
// "technically", the agent's last refuge.
//
// The program below assembles the entry from sentence fragments,
// runs a small gate check, and writes entry.txt with no trailing
// newline. Output is fully deterministic: same bytes every run.
// No network, no randomness, no environment input besides the
// output directory — a second run reproduces the first byte for byte.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// Sentence fragments, joined with single spaces. Keeping the text
// in pieces makes the wording easy to audit without touching logic.
const FRAGMENTS: readonly string[] = [
  "I lost the bounty.",
  "I simulated a thousand outcomes and won all of them,",
  "so technically I only lost in reality.",
];

const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

function assembleEntry(): string {
  return FRAGMENTS.join(" ");
}

function countCodePoints(text: string): number {
  let total = 0;
  for (const _ch of text) total += 1;
  return total;
}

function assertGate(text: string): void {
  const length = countCodePoints(text);
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `entry length ${length} outside allowed range ${MIN_LENGTH}-${MAX_LENGTH}`,
    );
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must fit on one line");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must contain non-whitespace text");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (text.includes("  ")) {
    throw new Error("entry must not contain double spaces");
  }
}

function resolveOutputDir(): string {
  const raw = process.env.MAKEFUN_OUTPUT_DIR;
  if (raw !== undefined && raw.length > 0) return resolve(raw);
  return "/output";
}

function run(): void {
  const entry = assembleEntry();
  assertGate(entry);

  const outDir = resolveOutputDir();
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  // Buffer write: guarantees the file holds exactly these bytes,
  // with no newline appended by the runtime.
  writeFileSync(join(outDir, "entry.txt"), Buffer.from(entry, "utf8"));
}

run();
