#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const constantsPath = path.join(srcDir, 'common/constants/error-codes.constant.ts');
const localesDir = path.join(srcDir, 'locales');

function normalizePath(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join('/');
}

function walk(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dirPath, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function parseErrorCodeGroups(fileContent) {
  const groups = [];
  const objectRegex = /export const (\w+) = \{([\s\S]*?)\} as const;/g;
  const pairRegex = /\s*(\w+):\s*'([A-Z]+\.[A-Z0-9_]+)',?/g;

  let objectMatch;
  while ((objectMatch = objectRegex.exec(fileContent))) {
    const [, objectName, body] = objectMatch;
    const codes = [];

    let pairMatch;
    while ((pairMatch = pairRegex.exec(body))) {
      const [, key, value] = pairMatch;
      const [namespace, shortKey] = value.split('.');
      codes.push({ objectName, key, value, namespace, shortKey });
    }

    if (codes.length > 0) groups.push({ objectName, namespace: codes[0].namespace, codes });
  }

  return groups;
}

function collectLocaleLanguages() {
  if (!fs.existsSync(localesDir)) return [];

  return fs
    .readdirSync(localesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function collectUsageFiles() {
  const excludedSegments = ['/generated/', '/locales/', '/docs/'];
  const excludedFiles = new Set([
    normalizePath(constantsPath),
  ]);

  return walk(srcDir).filter((filePath) => {
    if (!filePath.endsWith('.ts')) return false;

    const relativePath = normalizePath(filePath);
    if (excludedFiles.has(relativePath)) return false;
    if (excludedSegments.some((segment) => relativePath.includes(segment))) return false;
    if (relativePath.endsWith('.doc.ts')) return false;

    return true;
  });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validateLocales(groups, languages) {
  const issues = [];

  for (const language of languages) {
    for (const group of groups) {
      const localeFile = path.join(localesDir, language, `${group.namespace.toLowerCase()}.json`);

      if (!fs.existsSync(localeFile)) {
        issues.push(`Missing locale file: ${normalizePath(localeFile)}`);
        continue;
      }

      const localeContent = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
      const expectedKeys = new Set(group.codes.map((code) => code.shortKey));
      const actualKeys = new Set(Object.keys(localeContent));

      const missingKeys = [...expectedKeys].filter((key) => !actualKeys.has(key));
      const extraKeys = [...actualKeys].filter((key) => !expectedKeys.has(key));

      for (const key of missingKeys) issues.push(`Missing locale key in ${normalizePath(localeFile)}: ${key}`);
      for (const key of extraKeys) issues.push(`Unused locale key in ${normalizePath(localeFile)}: ${key}`);
    }
  }

  return issues;
}

function validateUsages(groups, usageFiles) {
  const issues = [];
  const fileCache = new Map();

  const getFileContent = (filePath) => {
    const cached = fileCache.get(filePath);
    if (cached !== undefined) return cached;

    const content = fs.readFileSync(filePath, 'utf8');
    fileCache.set(filePath, content);
    return content;
  };

  for (const group of groups) {
    for (const code of group.codes) {
      const propertyUsageRegex = new RegExp(`\\b${escapeRegex(group.objectName)}\\s*\\.\\s*${escapeRegex(code.key)}\\b`);
      const literalUsageRegex = new RegExp(escapeRegex(code.value));

      const isUsed = usageFiles.some((filePath) => {
        const content = getFileContent(filePath);
        return propertyUsageRegex.test(content) || literalUsageRegex.test(content);
      });

      if (!isUsed) issues.push(`Unused error code: ${code.value}`);
    }
  }

  return issues;
}

function main() {
  if (!fs.existsSync(constantsPath)) {
    console.error(`Missing constants file: ${normalizePath(constantsPath)}`);
    process.exit(1);
  }

  const groups = parseErrorCodeGroups(fs.readFileSync(constantsPath, 'utf8'));
  const languages = collectLocaleLanguages();
  const usageFiles = collectUsageFiles();

  const localeIssues = validateLocales(groups, languages);
  const usageIssues = validateUsages(groups, usageFiles);
  const issues = [...localeIssues, ...usageIssues];

  if (issues.length === 0) {
    const totalCodes = groups.reduce((count, group) => count + group.codes.length, 0);
    console.log(`Error code validation passed: ${totalCodes} codes checked across ${languages.length} locale(s).`);
    process.exit(0);
  }

  console.error('Error code validation failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }

  process.exit(1);
}

main();