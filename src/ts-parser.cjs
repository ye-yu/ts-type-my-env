const { readFile } = require("fs/promises");
const ts = require("typescript");

module.exports = async function parseDeclarationFile(filename) {
  const tsCode = await readFile(filename, { encoding: "utf8" });
  return new Promise((res) => {
    const sf = ts.createSourceFile("x.ts", tsCode, ts.ScriptTarget.ES2022);

    const forParentChild = (child) => {
      if (
        ts.SyntaxKind[child.kind] !==
        ts.SyntaxKind[ts.SyntaxKind.ModuleDeclaration]
      )
        return;
      if (child.name.escapedText !== "NodeJS") return;
      child.forEachChild(forNodeJSModuleChild);
    };

    const forNodeJSModuleChild = (child) => {
      if (
        ts.SyntaxKind[child.kind] !== ts.SyntaxKind[ts.SyntaxKind.ModuleBlock]
      )
        return;
      child.forEachChild(forModuleBlockChild);
    };

    const forModuleBlockChild = (child) => {
      if (
        ts.SyntaxKind[child.kind] !==
        ts.SyntaxKind[ts.SyntaxKind.InterfaceDeclaration]
      )
        return;
      if (child.name.escapedText !== "ProcessEnv") return;
      const parsedEnv = [];
      child.forEachChild((child) => {
        if (
          ts.SyntaxKind[child.kind] !==
          ts.SyntaxKind[ts.SyntaxKind.PropertySignature]
        )
          return;
        const {
          jsDoc,
          name: { escapedText: env },
          pos,
          end,
        } = child;
        const jsDocJoined = jsDoc?.map((e) => e.comment).join("\n\n");
        const inlineComments = tsCode.substring(pos, end).match(/\/\/[^\n]*/gm);

        parsedEnv.push({
          jsDocJoined,
          inlineComments,
          env,
        });
      });

      res(parsedEnv);
    };

    sf.forEachChild(forParentChild);
  });
};
