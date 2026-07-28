#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "prototype-manifest", "billing-pages.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const failures = [];

function readProjectFile(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function requireText(source, needle, label) {
  if (!source.includes(needle)) {
    failures.push(`${label}: missing "${needle}"`);
  }
}

function requirePattern(source, pattern, label) {
  if (!pattern.test(source)) {
    failures.push(`${label}: pattern not found (${pattern})`);
  }
}

const entryHtml = readProjectFile(manifest.entryFile);
const prototypeHtml = readProjectFile(manifest.prototypeFile);

requireText(entryHtml, manifest.iframeBase, "workbench billing iframe source");

for (const capability of manifest.entryCapabilities) {
  requireText(entryHtml, capability, `workbench capability ${capability}`);
}

for (const group of manifest.groups) {
  requireText(entryHtml, `title: "${group.title}"`, `workbench menu group ${group.title}`);

  for (const item of group.items) {
    requireText(
      entryHtml,
      `["${item.view}", "${item.label}", "${item.icon}"]`,
      `workbench menu item ${group.title} / ${item.label}`
    );
    requireText(entryHtml, `${item.view}: ${item.renderer}`, `workbench renderer map ${item.view}`);
    requireText(entryHtml, `function ${item.renderer}()`, `workbench renderer function ${item.renderer}`);
    requireText(
      entryHtml,
      `return renderCreditPrototypeEmbed("${item.pageId}", "${item.label}");`,
      `workbench iframe target ${item.view}`
    );
    requirePattern(
      prototypeHtml,
      new RegExp(`<section\\s+class="page"\\s+id="${item.pageId}"\\s+data-title="${escapeRegExp(item.pageTitle)}"`),
      `billing prototype page ${item.pageId}`
    );
    requireText(
      prototypeHtml,
      `data-page-target="${item.pageId}"`,
      `billing prototype nav target ${item.pageId}`
    );
  }
}

if (failures.length > 0) {
  console.error("Billing prototype guard failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Billing prototype guard passed.");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
