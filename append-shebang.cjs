#!/usr/bin/env node

const { readFileSync, writeFileSync } = require("fs");
var glob = require("glob");

glob("dist/**/*.js", (err, matches) => {
  if (err) throw err;
  matches.forEach((fileName) => {
    const content =
      "#!/usr/bin/env node\n" +
      readFileSync(fileName, { encoding: "utf8" }).toString();
    writeFileSync(fileName, content);
  });
});
