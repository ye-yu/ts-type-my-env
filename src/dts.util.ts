import { ParseResult } from "./dotenv-parser.js";

const template = `// generated using \`npx type-my-env\`
// Autocomplete your environment variables!

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Can be used to change the default timezone at runtime
     */
    TZ?: string;@@inject_here@@
  }
}
`;

const indentation = "    ";

export function createType(dotenvFile: ParseResult[]) {
  const vars = compileToTypeScript(dotenvFile);

  const allVars = vars.length ? "\n\n" + vars.join("\n\n") : "";

  const dtsContent = template.replace(/@@inject_here@@/, allVars);

  return dtsContent;
}

export function compileToTypeScript(dotenvFile: ParseResult[]) {
  return dotenvFile.map(({ document, inline, key, type }) => {
    let ts = "";

    if (document) {
      ts += indentation + "/**\n";
      ts += indentation + " ";
      ts += document.join("\n" + indentation + " ");
      ts += "\n";
      ts += indentation + " */";
      ts += "\n";
    }

    if (inline) {
      ts += indentation + inline;
      ts += "\n";
    }

    ts += `${indentation}${key}?: string;`;
    return ts;
  });
}
