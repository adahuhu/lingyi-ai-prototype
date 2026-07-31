#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "prototype-manifest", "workbench-pages.json");
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

function countOccurrences(source, needle) {
  let count = 0;
  let position = 0;

  while ((position = source.indexOf(needle, position)) !== -1) {
    count += 1;
    position += needle.length;
  }

  return count;
}

function requireSingleText(source, needle, label) {
  const count = countOccurrences(source, needle);

  if (count !== 1) {
    failures.push(`${label}: expected one "${needle}", found ${count}`);
  }
}

function getNavGroupBlock(source, groupTitle) {
  const groupMarker = `title: "${groupTitle}", items: [`;
  const start = source.indexOf(groupMarker);

  if (start === -1) {
    failures.push(`workbench menu group ${groupTitle}: missing group`);
    return "";
  }

  const nextGroupStart = source.indexOf("\n      { title:", start + groupMarker.length);
  return source.slice(start, nextGroupStart === -1 ? source.length : nextGroupStart);
}

const entryHtml = readProjectFile(manifest.entryFile);

for (const relativePath of manifest.requiredFiles) {
  readProjectFile(relativePath);
}

for (const page of manifest.pages) {
  const menuItem = `["${page.view}", "${page.label}", "${page.icon}"]`;

  requireSingleText(entryHtml, menuItem, `workbench menu item ${page.label}`);
  if (page.groupTitle) {
    requireText(
      getNavGroupBlock(entryHtml, page.groupTitle),
      menuItem,
      `workbench menu group ${page.groupTitle} / ${page.label}`
    );
  }

  requireText(entryHtml, `${page.view}: ${page.renderer}`, `workbench renderer map ${page.view}`);
  requireText(entryHtml, `function ${page.renderer}()`, `workbench renderer function ${page.renderer}`);
  requireText(entryHtml, `function ${page.fallbackRenderer}()`, `workbench fallback renderer ${page.fallbackRenderer}`);
  requireText(entryHtml, `return ${page.fallbackRenderer}();`, `workbench inline fallback ${page.label}`);

  const standaloneHtml = readProjectFile(page.standaloneFile);
  requireText(standaloneHtml, page.standaloneTitle, `standalone page title ${page.label}`);
  requireText(standaloneHtml, page.label, `standalone page content ${page.label}`);
}

if (failures.length > 0) {
  console.error("Workbench page guard failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Workbench page guard passed.");
