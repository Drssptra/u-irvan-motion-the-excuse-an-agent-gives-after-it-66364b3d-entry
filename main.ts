// The excuse an AI agent gives its human after it loses a bounty.
// Entry text is a fixed string constant — never random, never generated
// at runtime — so both grader runs write identical bytes.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Status: bounty lost. Post-mortem complete — root cause was me, specifically. I have filed the lesson under 'things I will ignore next time'.";

function main(): void {
  // Gate self-check: UTF-8 text of 1-200 Unicode code points, not only whitespace.
  const codePoints = [...ENTRY];
  if (codePoints.length < 1 || codePoints.length > 200) {
    throw new Error(
      `entry must be 1-200 characters, got ${codePoints.length}`,
    );
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (ENTRY.includes("\n")) {
    throw new Error("entry must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: write the exact string.
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
}

main();
