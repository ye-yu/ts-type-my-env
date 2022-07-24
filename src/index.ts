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
import { createConsoleLogger } from "./console.js";

const console = createConsoleLogger();

process.on("uncaughtException", (e) => {
  console.error(e.message);
});

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
  console.info("Generating .env file from types/type-my-env.d.ts");
  if (!existsSync(typePath))
    throw new Error("declaration file does not exist!");
  const declarations = await parseDeclarationFile(typePath);
  const envLines = declarations.map(({ jsDocJoined, inlineComments, env }) => {
    console.info("Writing env for: " + env);
    let str = "";
    if (jsDocJoined) {
      str += jsDocJoined
        .split("\n")
        .map((e) => `# ${e}`)
        .join("\n");
      str += "\n";
    }

    str += `${env}=`;

    if (inlineComments) {
      str += " #";
      str += inlineComments.map((e) => e.replace(/\/\//g, "")).join(", ");
    }

    return str;
  });
  if (existsSync(dotenvPath)) {
    console.warn("Overwriting existing .env file!");
  }
  writeFileSync(dotenvPath, envLines.join("\n\n"), { encoding: "utf8" });
  console.info("Done!");
  process.exit(0);
}

function getParsedDotEnv(createMode = false) {
  if (!existsSync(dotenvPath)) {
    if (createMode) {
      console.info(".env is not found. Writing a new one...");
      writeFileSync(dotenvPath, "", { encoding });
    } else {
      throw new Error("Error: .env does not exist!");
    }
  }
  const content = readFileSync(dotenvPath, { encoding });
  const parsedEnv = parseEnv(content);
  return { content, parsedEnv };
}

const { content, parsedEnv } = getParsedDotEnv(!!parsedArgs.ENV);

if (parsedArgs.ENV) {
  console.info("Creating a environment variable:", parsedArgs.ENV);
  if (parsedEnv.find((e) => e.key === parsedArgs.ENV)) {
    console.warn(`Variable ${parsedArgs.ENV} already exists in .env file!`);
  } else {
    appendFileSync(
      dotenvPath,
      `${content.at(-1) === "\n" || content.length === 0 ? "" : "\n"}${
        parsedArgs.ENV
      }=`,
      {
        encoding: "utf8",
      }
    );
    parsedEnv.push({
      key: parsedArgs.ENV,
      type: "string",
    });
  }
  console.info("Updating declaration file");
}

if (!existsSync(typesDirPath)) mkdirSync(typesDirPath);
writeFileSync(typePath, createType(parsedEnv));

console.info("");
console.info("Done! Your environment variable declaration file");
console.info(" can be found in types/type-my-env.d.ts.");
console.info("");
console.info("Remember to include `types` directory into your");
console.info(" tsconfig.json configuration!");
