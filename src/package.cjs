/**
 *
 * @param  {...any} m possible module paths
 */
async function tryRequire(...m) {
  for (const p of m) {
    try {
      return require(p);
    } catch (_) {}
  }
  return { default: { version: "bugged" } };
}
module.exports = tryRequire("./package.json", "../package.json");
