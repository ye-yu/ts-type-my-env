declare module "*/ts-parser.cjs" {
  export default function parseDeclarationFile(
    filename: string
  ): Promise<ParsedDTS[]>;

  export interface ParsedDTS {
    jsDocJoined: string | undefined;
    inlineComments: string[] | null;
    env: string;
  }
}
