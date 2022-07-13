import { ParseResult } from "./dotenv";

const template = `declare var process: NodeJS.Process & {
  env: {
    /**
     * Can be used to change the default timezone at runtime
     */
    TZ?: string;
    /**
     * This is just a sample to test that
     * this typing is valid for typescript.
     */
@@inject_here@@
  };
};
`;

export function createType(dotenvFile: ParseResult[]) {
  const vars = dotenvFile.map(({ document, inline, key, type }) => {
    let ts = "";

    if (document) {
      ts += "    /**\n     ";
      ts += document.join("\n     ");
      ts += "\n";

      if (type) {
        ts += "     *\n     * The infered type is " + type;
      }
      ts += "\n     */";
      ts += "\n";
    }

    ts += `    ${key}?: string;${inline ? " " + inline : ""}`;
    return ts;
  });

  const allVars = vars.join("\n\n");

  const dtsContent = template.replace(/@@inject_here@@/, allVars);

  return dtsContent;
}
