#!/usr/bin/env node

const { writeFileSync } = require("fs");

const packageJson = require("./dist/package.json");
if (packageJson.version.includes("alpha")) process.exit(0);
packageJson.version = packageJson.version + "-alpha";
writeFileSync("./dist/package.json", JSON.stringify(packageJson, null, 2));
