export interface ParseResult {
  document?: string[];
  inline?: string;
  key: string;
  value?: string;
  type: string;
}

/**
 * Regex to capture key value pair with inline comment
 */
const lineWithInlineComment = () =>
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*((?:#.*)?(?:$|$))/gim;

const booleanLike = new Set([
  "yes",
  "y",
  "1",
  "true",
  "on",
  "no",
  "n",
  "0",
  "false",
  "off",
]);

/**
 * parses env content
 *
 * inspired from: {@link https://github.com/motdotla/dotenv/blob/228c7b449dd9adfa93447ba74c8bf894db3068e5/lib/main.js#L8 source}
 * @param src env content
 *
 */
export function parseEnv(src: string | Buffer) {
  const result: Record<string, ParseResult> = {};

  // Convert buffer to string
  const linesString = src.toString().replace(/\r\n?/gm, "\n");

  const lines = linesString.split(/\n/gm);

  let reuseableDocument: string[] = [];

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed.length) continue;
    if (trimmed.match(/^\s*#/g)) {
      reuseableDocument.push(trimmed.replace(/^\s*#/g, "*"));
    } else {
      const regex = lineWithInlineComment();
      let m: RegExpExecArray | null;
      if ((m = regex.exec(trimmed)) !== null) {
        const [, key, value = "", inline = ""] = m;

        const trimmedValue = value.trim();

        let type = "string";
        if (isFinite(+trimmedValue)) {
          type = "number";
        } else if (booleanLike.has(trimmedValue.toLocaleLowerCase("en-gb"))) {
          type = "boolean";
        }

        result[key] = {
          document: reuseableDocument.length ? [...reuseableDocument] : void 0,
          inline: inline.replace(/#/g, "//") || void 0,
          key,
          value,
          type,
        };

        reuseableDocument.length = 0;
      }
    }
  }

  return Object.values(result);
}
