import path from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { parseEnv } from "./dotenv";
import { createType } from "./dts.util";

let dotenvPath = path.resolve(process.cwd(), ".env");
let typesDirPath = path.resolve(process.cwd(), "types");
let typePath = path.resolve(process.cwd(), "types", "type-my-env.d.ts");
let encoding = "utf8" as const;

if (!existsSync(dotenvPath)) process.exit();

const content = readFileSync(dotenvPath, { encoding });

const parsedEnv = parseEnv(content);

if (!existsSync(typesDirPath)) mkdirSync(typesDirPath);

writeFileSync(typePath, createType(parsedEnv));
