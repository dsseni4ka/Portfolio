import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "diana-senik-cv.html");
const pdfPath = path.join(__dirname, "Diana-Senik-CV.pdf");

const chromePaths = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "google-chrome",
  "chromium",
];

const chrome =
  chromePaths.find((candidate) => {
    if (candidate.includes("/")) return fs.existsSync(candidate);
    return false;
  }) ?? chromePaths[0];

const fileUrl = `file://${htmlPath}`;

const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=5000",
  `--print-to-pdf=${pdfPath}`,
  "--print-to-pdf-no-header",
  fileUrl,
];

const child = spawn(chrome, args, { stdio: "inherit" });

child.on("close", (code) => {
  if (code !== 0) {
    console.error(`Chrome exited with code ${code}`);
    process.exit(code ?? 1);
  }
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF was not created.");
    process.exit(1);
  }
  const stats = fs.statSync(pdfPath);
  console.log(`Created ${pdfPath} (${Math.round(stats.size / 1024)} KB)`);
});
