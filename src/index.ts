import path from "path";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { parseEnv } from "./dotenv-parser.js";
import { createType } from "./dts.util.js";
import { ArgumentParser } from "argparse";
import chalk from "chalk";
import _packageJson from "./package.cjs";
const packageJson = await _packageJson;
import parseDeclarationFile from "./ts-parser.cjs";

const description =
  chalk.bgBlue("TS") + " Autocomplete your environment variable!";

const argparser = new ArgumentParser({
  description,
  prog: "[npx] type-my-env",
});

argparser.add_argument("-r", "--reverse", {
  help: "parse type-my-env.d.ts back to .env file instead",
  action: "store_true",
});

argparser.add_argument("-s", "--string-index", {
  help: "add string indexing to the type declaration",
  action: "store_true",
});

argparser.add_argument("-c", "--create", {
  help: "create a new environment variable",
  type: "str",
  dest: "ENV",
});

argparser.add_argument("-v", "--version", {
  action: "version",
  version: `type-my-env v${
    packageJson.version
  } - https://github.com/ye-yu/ts-type-my-env${
    packageJson.buildhash ? ` (${packageJson.buildhash})` : ""
  }`,
});

const parsedArgs = argparser.parse_args();

let dotenvPath = path.resolve(process.cwd(), ".env");
let typesDirPath = path.resolve(process.cwd(), "types");
let typePath = path.resolve(process.cwd(), "types", "type-my-env.d.ts");
let encoding = "utf8" as const;

if (parsedArgs.reverse) {
  if (!existsSync(typePath))
    throw new Error("declaration file does not exist!");
  const declarations = await parseDeclarationFile(typePath);
  console.log(declarations);
  process.exit(0);
}

function getParsedDotEnv() {
  if (!existsSync(dotenvPath)) throw new Error(".env does not exist");
  const content = readFileSync(dotenvPath, { encoding });
  const parsedEnv = parseEnv(content);
  return parsedEnv;
}

const parsedEnv = getParsedDotEnv();

if (parsedArgs.ENV) {
  console.log("Creating environment variable:", parsedArgs.ENV);
  if (parsedEnv.find((e) => e.key === parsedArgs.ENV)) {
    console.warn(`Variable ${parsedArgs.ENV} already exists in .env file!`);
  } else {
    appendFileSync(dotenvPath, `\n${parsedArgs.ENV}=`, {
      encoding: "utf8",
    });
    parsedEnv.push({
      key: parsedArgs.ENV,
      type: "string",
    });
  }
  console.log("Updating declaration file");
}

if (!existsSync(typesDirPath)) mkdirSync(typesDirPath);
writeFileSync(typePath, createType(parsedEnv));
