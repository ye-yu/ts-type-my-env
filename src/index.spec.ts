import { parseEnv, ParseResult } from "./dotenv-parser";
import { compileToTypeScript } from "./dts.util";

// fixtures
const plainEnv = `
KEY=value
KEY2=value
`;

const documentedEnv = `
# this is a string
STR_KEY=str

# this is a number
NUM_KEY=2

# this is a boolean

BOOL_KEY=off

#this has no space after #
HELLO=world
`;

const documentedWithInline = `
# this has document
KEY=value #inline
`;

describe("Dotenv Parser", () => {
  it("should be able to parse plain env", () => {
    const result = parseEnv(plainEnv);
    expect(result.length).toEqual(2);
    expect(result[0].key).toEqual("KEY");
    expect(result[1].key).toEqual("KEY2");
    expect(result[0].value).toEqual("value");
    expect(result[1].value).toEqual("value");
    expect(result[0].type).toEqual("string");
    expect(result[1].type).toEqual("string");

    expect(result[0].document).not.toBeDefined();
    expect(result[0].inline).not.toBeDefined();
    expect(result[1].document).not.toBeDefined();
    expect(result[1].inline).not.toBeDefined();
  });

  it("should be able to parse documented env", () => {
    const result = parseEnv(documentedEnv);
    expect(result).toBeDefined();

    let singleResult: ParseResult | undefined;
    expect(
      (singleResult = result.find((e) => e.key === "STR_KEY"))
    ).toBeDefined();
    expect(singleResult?.document).toBeDefined();
    expect(
      singleResult?.document?.some((e) => e.includes("this is a string"))
    ).toEqual(true);
    expect(singleResult?.type).toEqual("string");

    expect(
      (singleResult = result.find((e) => e.key === "NUM_KEY"))
    ).toBeDefined();
    expect(singleResult?.document).toBeDefined();
    expect(
      singleResult?.document?.some((e) => e.includes("this is a number"))
    ).toEqual(true);
    expect(singleResult?.type).toEqual("integer");

    expect(
      (singleResult = result.find((e) => e.key === "BOOL_KEY"))
    ).toBeDefined();
    expect(singleResult?.document).toBeDefined();
    expect(
      singleResult?.document?.some((e) => e.includes("this is a boolean"))
    ).toEqual(true);
    expect(singleResult?.type).toEqual("boolean");
  });

  it("should be able to parse inline documented env", () => {
    const result = parseEnv(documentedWithInline);
    expect(result).toBeDefined();

    let singleResult: ParseResult | undefined;
    expect((singleResult = result.find((e) => e.key === "KEY"))).toBeDefined();
    expect(singleResult?.document).toBeDefined();
    expect(
      singleResult?.document?.some((e) => e.includes("this has document"))
    ).toEqual(true);
    expect(singleResult?.type).toEqual("string");
    expect(singleResult?.inline).toBeDefined();
    expect(singleResult?.inline?.includes("inline")).toEqual(true);
  });
});

describe("DTS Generator", () => {
  it("should compile undocumented env", () => {
    const dts = compileToTypeScript(parseEnv(plainEnv));
    expect(dts[0]).not.toMatch(/\/\*/g);
    expect(dts[1]).not.toMatch(/\/\*/g);
  });

  it("should compile documented env", () => {
    const dts = compileToTypeScript(parseEnv(documentedEnv));
    expect(dts[0]).toMatch(/\/\*/g);
    expect(dts[1]).toMatch(/\/\*/g);
    expect(dts[2]).toMatch(/\/\*/g);
  });

  it("should compile inline documented env", () => {
    const dts = compileToTypeScript(parseEnv(documentedWithInline));
    expect(dts[0]).toMatch(/\/\//g);
  });
});
