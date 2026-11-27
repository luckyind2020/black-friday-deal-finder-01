// Entry point for the Black Friday Deal Finder.
// Copies the static site (app/) and its screenshots into the output
// directory, then writes the dossier buildDossier computes from them.
// Runs on Node 22 with the standard library only; no network, no install.
import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cp, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

async function handIn() {
  await mkdir(outDir, { recursive: true });
  await cp(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
  await cp(join(repoRoot, "screenshots"), join(outDir, "screenshots"), {
    recursive: true,
  });
  const dossier = buildDossier(outDir, dossierCaps);
  await writeFile(join(outDir, "dossier.json"), dossier);
  console.log(
    `Handed in ${outDir}: app/ + screenshots/ + dossier.json (${dossier.length} bytes).`,
  );
}

await handIn();
