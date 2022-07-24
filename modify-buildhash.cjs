#!/usr/bin/env node

const { writeFileSync } = require("fs");
const distPackageJson = require("./dist/package.json");
const [, , buildhash = ""] = process.argv;
distPackageJson.buildhash = buildhash;
writeFileSync("./dist/package.json", JSON.stringify(distPackageJson, null, 2));
