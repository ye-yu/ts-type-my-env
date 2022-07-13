import { parseEnv } from "./dotenv";
import { createType } from "./dts.util";

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

console.log(createType(parseEnv(documentedEnv)));
