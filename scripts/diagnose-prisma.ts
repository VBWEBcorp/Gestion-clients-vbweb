import fs from "node:fs";
import path from "node:path";

const endpoint =
  "http://127.0.0.1:7243/ingest/c78e46ee-af90-42c8-86e9-6221d97f708b";
const sessionId = "debug-session";
const runId = process.env.DEBUG_RUN_ID ?? "post-fix";

const send = (payload: Record<string, unknown>) => {
  // #region agent log
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion
};

const main = async () => {
  // #region agent log
  send({
    sessionId,
    runId,
    hypothesisId: "A",
    location: "scripts/diagnose-prisma.ts:20",
    message: "diagnose start",
    data: {
      nodeVersion: process.version,
      cwd: process.cwd(),
      isNetlify: Boolean(process.env.NETLIFY),
      isCI: Boolean(process.env.CI),
    },
    timestamp: Date.now(),
  });
  // #endregion

  let resolved = "";
  let resolveError = "";
  try {
    resolved = require.resolve("@prisma/client");
  } catch (error) {
    resolveError = String(error);
  }

  // #region agent log
  send({
    sessionId,
    runId,
    hypothesisId: "A",
    location: "scripts/diagnose-prisma.ts:44",
    message: "resolve @prisma/client",
    data: { resolved, resolveError },
    timestamp: Date.now(),
  });
  // #endregion

  let prismaClientExport = false;
  let exportError = "";
  try {
    const mod = await import("@prisma/client");
    prismaClientExport = Boolean((mod as { PrismaClient?: unknown }).PrismaClient);
  } catch (error) {
    exportError = String(error);
  }

  // #region agent log
  send({
    sessionId,
    runId,
    hypothesisId: "B",
    location: "scripts/diagnose-prisma.ts:64",
    message: "import @prisma/client",
    data: { prismaClientExport, exportError },
    timestamp: Date.now(),
  });
  // #endregion

  const generatedClientPath = path.join(
    process.cwd(),
    "node_modules",
    ".prisma",
    "client",
    "index.d.ts",
  );
  const generatedExists = fs.existsSync(generatedClientPath);

  // #region agent log
  send({
    sessionId,
    runId,
    hypothesisId: "C",
    location: "scripts/diagnose-prisma.ts:85",
    message: "generated prisma client",
    data: { generatedClientPath, generatedExists },
    timestamp: Date.now(),
  });
  // #endregion

  const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
  let tsconfigRaw = "";
  let tsconfigReadError = "";
  try {
    tsconfigRaw = fs.readFileSync(tsconfigPath, "utf-8");
  } catch (error) {
    tsconfigReadError = String(error);
  }
  const excludeHasPrisma =
    tsconfigRaw.includes('"exclude"') &&
    (tsconfigRaw.includes('"prisma"') || tsconfigRaw.includes('"prisma/"'));

  // #region agent log
  send({
    sessionId,
    runId,
    hypothesisId: "D",
    location: "scripts/diagnose-prisma.ts:109",
    message: "tsconfig exclude prisma",
    data: { tsconfigReadError, excludeHasPrisma },
    timestamp: Date.now(),
  });
  // #endregion
};

main();
