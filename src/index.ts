import path from "path";
import { parseEnv } from "./dotenv-parser.js";
import { createType } from "./dts.util.js";
import { ArgumentParser } from "argparse";
import chalk from "chalk";
import _packageJson from "./package.cjs";
const packageJson = await _packageJson;

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
  type: "string",
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
console.log({ parsedArgs });

let dotenvPath = path.resolve(process.cwd(), ".env");
let typesDirPath = path.resolve(process.cwd(), "types");
let typePath = path.resolve(process.cwd(), "types", "type-my-env.d.ts");
let encoding = "utf8" as const;

if (!existsSync(dotenvPath)) process.exit();

const content = readFileSync(dotenvPath, { encoding });

const parsedEnv = parseEnv(content);

if (!existsSync(typesDirPath)) mkdirSync(typesDirPath);

writeFileSync(typePath, createType(parsedEnv));
