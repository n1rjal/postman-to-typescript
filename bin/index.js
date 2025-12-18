#! /usr/bin/env node

const {
  readFileSync,
  writeFile: writeFileFs,
  existsSync,
  mkdirSync,
} = require("fs");

const { join } = require("path");

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

/* The code is defining two constants: one for all typescript illegal characters and other for numeric types in js*/
const TS_ILLEGAL_CHARACTERS = /[^\w\s\n]/g;

const NUMERIC_TYPES = ["number", "bigint"];

/* The above code is defining an array called `ALL_DEFINED_ARGS` which contains objects representing
command line arguments. Each object has properties such as `keys` (an array of possible argument
keys), `required` (a boolean indicating if the argument is required), `question` (a string
representing the question to ask the user when the argument is not provided), and `default` (a
default value for the argument if not provided). These objects represent the different command line
arguments that can be passed to a script or program. */
const ALL_DEFINED_ARGS = [
  { keys: ["-i", "--input"], required: true, question: "Postman input file" },
  {
    keys: ["-o", "--output"],
    required: true,
    question: "The output directory",
  },
  { keys: ["-ia", "--include-any"], required: false, default: false },
  {
    keys: ["-sc", "--status-codes"],
    required: false,
    default: "",
  },
  {
    keys: ["-ft", "--force-text"],
    required: false,
    default: false,
  },
  {
    keys: ["-te", "--throw-error"],
    required: false,
    default: false,
  },
  { keys: ["-X", "--api-key"], required: true, question: "Postman API key" },
  {
    keys: ["-U", "--collection-url"],
    required: true,
    question: "Remote postman collection url",
  },
  { keys: ["-p", "--prefix"], required: false, default: "" },
];

/* The above code is defining a map called `ARGS_HELP_MAP` which is used to store help messages for
different command line arguments. Each argument is associated with a help message that describes its
purpose. The map is populated with key-value pairs where the key is the command line argument and
the value is the corresponding help message. */
const ARGS_HELP_MAP = new Map();

// from the key array we will be using the first one
// and ignoring the last one
ARGS_HELP_MAP.set(
  ALL_DEFINED_ARGS[0],
  `The export of postman data as json v2.0`,
);

ARGS_HELP_MAP.set(ALL_DEFINED_ARGS[1], `The output directory for all types`);

ARGS_HELP_MAP.set(
  ALL_DEFINED_ARGS[2],
  `This specifies if any must be included in typescript types or not. Default value is false`,
);

ARGS_HELP_MAP.set(
  ALL_DEFINED_ARGS[3],
  `This specifies if we can add type support for response of the types provided. Default value is 200[comma separated]`,
);

ARGS_HELP_MAP.set(
  ALL_DEFINED_ARGS[4],
  `This specifies if we need to parse text content in postman request or not. Default value is false`,
);

ARGS_HELP_MAP.set(
  ALL_DEFINED_ARGS[5],
  `This specifies if the program should throw error`,
);
ARGS_HELP_MAP.set(ALL_DEFINED_ARGS[6], `This specifies the postman API key`);

ARGS_HELP_MAP.set(
  ALL_DEFINED_ARGS[7],
  `This specifies the remote postman collection id`,
);

/* The above code is filtering an array called `ALL_DEFINED_ARGS` to only include elements that have a
property `required` set to `true`. */
let requiredArgs = ALL_DEFINED_ARGS.filter((arg) => arg.required);

/* The above code is declaring and initializing several variables. */
let file = "";
let THROW_ERROR = false;
let INCLUDE_ANY = true;
let TYPES_FOR_STATUS_CODE = [200];
let OUTPUT_DIR = "";
let PARSE_TYPES = ["json"];
let PREFIX = "";

/**
 * The function `printHelp` checks if the user has requested help by checking command line arguments,
 * and if so, it prints out information about available options and their descriptions.
 * @returns `false` if the user did not ask for help, and it is not returning anything if the user
 * asked for help.
 */
function printHelp() {
  const userAskedForHelp =
    process.argv.includes("-h") || process.argv.includes("--help");

  if (!userAskedForHelp) return false;

  console.log(`\n`);
  for (const [argKey, argHelp] of ARGS_HELP_MAP.entries()) {
    const keys = argKey.keys;
    console.log(`Option Flag: ${keys.join(", ")}`);
    if (argHelp.required)
      console.log(`Required: ${argHelp.required.toString()}`);
    if (!argKey.required && argHelp.default)
      console.log(`Default: ${argHelp.default.toString()}`);
    console.log(`${argHelp}\n\n`);
  }
  process.exit(0);
}

/**
 * The function `parseAllRequiredArgs` parses command line arguments and checks if all required
 * arguments are present.
 * @returns an object containing the parsed command line arguments.
 */
async function parseArgs() {
  // we will keep iterating and popping from the array until it is empty
  // if it is not empty we say that the command line arguments are invalid
  // and the following are required or we can ask for user input
  // the args here is raw meaning it will have -h and -sc as the key of object args
  const args = {};

  for (let i = 2; i < process.argv.length; i++) {
    // usually keys some at with format --input filename.json or -i fn.json
    // so argv[i] = --input
    // and argv[i+1] = filename.json

    const argKeyRaw = process.argv[i++];

    const keyObject = ALL_DEFINED_ARGS.find((arg) =>
      arg.keys.includes(argKeyRaw),
    );

    if (!keyObject) {
      i = i + 2;
      continue;
    }

    const argKey = keyObject.keys[0];
    const argValue = process.argv[i];

    args[argKey] = argValue;

    // basically we are searching by both keys
    requiredArgs = requiredArgs.filter(
      (arg) => !(arg.keys[0] === argKey || arg.keys[1] === argKey),
    );
  }

  if (!(args["-i"] || args["-U"] || args["-X"])) {
    let inp = await askQuestion(
      "Use remote postman[1] or local json file[2] ? [Default: 2]",
    );
    try {
      inp = parseInt(inp);
    } catch (err) {
      inp = 0;
    }
    switch (inp) {
      case 1:
        requiredArgs = requiredArgs.filter(
          (arg) => !(arg.keys[0] === "-i" || arg.keys[1] === "--input"),
        );
        break;
      case 2:
        requiredArgs = requiredArgs.filter(
          (arg) =>
            !(
              arg.keys[0] === "-U" ||
              arg.keys[1] === "--collection-id" ||
              arg.keys[0] === "-X" ||
              arg.keys[1] === "--api-key"
            ),
        );
        break;
      default:
        console.error("Please enter 1 or 2 as input");
        process.exit(1);
    }
  }
  if (args["-i"])
    requiredArgs = requiredArgs.filter(
      (arg) =>
        !(
          arg.keys[0] === "-U" ||
          arg.keys[1] === "--collection-id" ||
          arg.keys[0] === "-X" ||
          arg.keys[1] === "--api-key"
        ),
    );
  if (!args["-i"] && (args["-U"] || args["-X"]))
    requiredArgs = requiredArgs.filter(
      (arg) => !(arg.keys[0] === "-i" || arg.keys[1] === "--input"),
    );

  // fill in the rest with defaults
  for (const arg of ALL_DEFINED_ARGS) {
    if (!args[arg.keys[0]]) {
      args[arg.keys[0]] = arg.default;
    }
  }

  // prompt user for required arguments
  if (requiredArgs.length) {
    for (const arg of requiredArgs) {
      args[arg.keys[0]] = await askQuestion(arg.question);
    }
  }

  return args;
}

/**
 * The function `askQuestion` is an asynchronous function that prompts the user with a question and
 * returns a promise that resolves with the user's answer.
 * @param questionText - The `questionText` parameter is a string that represents the text of the
 * question you want to ask the user.
 * @returns The function `askQuestion` returns a promise.
 */
async function askQuestion(questionText) {
  return new Promise((resolve) => {
    const question = `# ${questionText}: `;
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * The function `writeFile` is a JavaScript function that writes content to a file and returns a
 * promise that resolves to `true` if the operation is successful.
 * @param filePath - The `filePath` parameter is a string that represents the path to the file where
 * you want to write the content. It should include the file name and extension.
 * @param fileContent - The `fileContent` parameter is the content that you want to write to the file.
 * It can be a string, an object, or any other data type that can be converted to a string.
 * @returns a Promise object.
 */
function writeFile(filePath, fileContent) {
  return new Promise((resolve, reject) => {
    writeFileFs(filePath, fileContent, { flag: "w+" }, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}

/**
 * The function converts a string to camel case by removing illegal characters, splitting the string
 * into words, and capitalizing the first letter of each word except the first one.
 * @param string - The `string` parameter is the input string that you want to convert to camel case.
 * @returns a camelCase version of the input string.
 */
function toCamelCase(string) {
  const legalString = string
    .replaceAll("\n", "")
    .replaceAll("-", "_")
    .replaceAll(TS_ILLEGAL_CHARACTERS, "")
    .split(" ")
    .map((words) => words.trim())

    .filter((string) => string.length > 0);

  return legalString.reduce((accumulator, word) => {
    return accumulator + word[0].toUpperCase() + word.slice(1);
  }, "");
}

/**
 * The function `parseTypeFromPostManRequestQuery` takes in a name and a request object, and if the
 * request has a query, it converts the query parameters into a TypeScript type and writes it to a
 * file.
 * @param name - The `name` parameter is a string that represents the name of the request or query. It
 * is used to generate the file name and the interface name in the output file.
 * @param request - The `request` parameter is an object that represents a request made in Postman. It
 * contains information about the request, such as the method (e.g., GET, POST) and the URL.
 */
async function parseTypeFromPostManRequestQuery(name, request, prefix) {
  if (request?.url?.query && request?.url?.query?.length > 0) {
    const method = request.method;
    const url = request.url.raw;

    if (request?.url?.query && request?.url?.query.length > 0) {
      const json = request.url.query.reduce(
        (accumulator, item) => ({
          ...accumulator,
          [TS_ILLEGAL_CHARACTERS.test(item.key) ? `"${item.key}"` : item.key]:
            item.value,
        }),
        {},
      );

      const content = getTypeScriptTypeFromRawJson(
        name,
        JSON.stringify(json),
        prefix,
      );

      const path = join(
        `${OUTPUT_DIR}`,
        "queries",
        `${prefix}${toCamelCase(name)}Query.ts`,
      );

      const fileContent = `/*\n${name}\n${method}: ${url}\n*/\n` + content;

      writeFile(path, fileContent, { flag: "w+" }, (err) => {
        if (err) throw err;
      });
    }
  }
}

/**
 * The function `parseTypeFromPostManJsonBody` parses a JSON body from a Postman request and generates
 * a TypeScript type definition file based on the parsed data.
 * @param req - The `req` parameter is an object that represents the request made to the server. It
 * contains information such as the request method (`req.method`), the request URL (`req.url.raw`), and
 * the query parameters (`req.url.query`).
 */
async function parseTypeFromPostManRequestJsonBody(name, req, prefix) {
  if (req?.body?.options?.raw?.language === "json" && req?.body?.raw) {
    const raw = req.body.raw;
    const method = req.method;
    const url = req?.url?.raw ?? req.url;

    const content = getTypeScriptTypeFromRawJson(name, raw, prefix);

    const path = join(
      `${OUTPUT_DIR}`,
      "request",
      `${prefix}${toCamelCase(name)}Request.ts`,
    );

    const fileContent = `/*\n${name}\n${method}: ${url}\n*/\n` + content;
    return writeFile(path, fileContent);
  }
}

/**
 * The function `parseTypesFromPostManExamples` parses types from a Postman response and generates a
 * TypeScript interface file.
 * @param resp - The `resp` parameter is an object that represents a response from a Postman request.
 * It contains the following properties:
 */
async function parseTypesFromPostManExampleResponse(resp, prefix) {
  const name = `${resp.name} ResponseBody`;
  const rawJson = resp.body;

  if (
    PARSE_TYPES.includes(resp._postman_previewlanguage) &&
    rawJson.length > 0 &&
    TYPES_FOR_STATUS_CODE.includes(200)
  ) {
    const content = getTypeScriptTypeFromRawJson(name, rawJson, prefix);

    const fileComment = `/*\n${name}\n*/`;

    const fileContent = fileComment + "\n" + content;

    const path = join(
      `${OUTPUT_DIR}`,
      "response",
      `${prefix}${toCamelCase(name)}.ts`,
    );

    return writeFile(path, fileContent);
  }
}

/**
 * The function `getTypescriptEquivalentForVariable` returns the TypeScript equivalent type for a given
 * JavaScript variable.
 * @param value - The `value` parameter in the `getTypescriptEquivalentForVariable` function is the
 * variable for which we want to determine the TypeScript equivalent type.
 * @returns a TypeScript equivalent type for the given variable.
 */
function getTypescriptEquivalentTypeForVariable(value, prefix, depth = 1) {
  const type = typeof value;

  if (value === null) return "null";

  if (type === "object") {
    if (Array.isArray(value)) {
      const type = getTypescriptEquivalentTypeForVariable(
        value[0],
        prefix,
        depth + 1,
      );
      return type ? `${type}[]` : INCLUDE_ANY ? "any[]" : "unknown[]";
    }

    let nestedType = getTypeScriptTypeFromRawJson(
      null,
      JSON.stringify(value),
      prefix,
      depth + 1,
    );

    return nestedType;
  }

  if (type === "boolean") return "boolean";
  if (NUMERIC_TYPES.includes(type)) return "number";
  if (type === "string") return "string";
  return INCLUDE_ANY ? "any" : "unknown";
}

/**
 * The function `getTypeScriptTypeFromRawJson` takes a name and a raw JSON string as input and returns
 * a TypeScript interface or type definition based on the structure of the JSON data.
 * @param name - The `name` parameter is a string that represents the name of the TypeScript interface
 * you want to generate. It is used to create the interface name by converting it to camel case and
 * prefixing it with "I".
 * @param rawJson - The `rawJson` parameter is a string that represents a JSON object or array. It is
 * the raw JSON data that you want to convert into a TypeScript type.
 * @returns a TypeScript interface or object literal as a string.
 */
function getTypeScriptTypeFromRawJson(name, rawJson, prefix, depth = 1) {
  let response =
    (name && name.length) > 0
      ? `export interface ${prefix}${toCamelCase(name)} { \n`
      : "{ \n";

  try {
    let jsonData = JSON.parse(rawJson);

    if (Array.isArray(jsonData) && jsonData.length > 0) jsonData = jsonData[0];

    for (const key in jsonData) {
      // simulate nested depth level
      response += "  ".repeat(depth);

      const typeScriptType = getTypescriptEquivalentTypeForVariable(
        jsonData[key],
        prefix,
        depth + 1,
      );

      response += `${key}: ${typeScriptType};\n`;
    }
    for (let i = 0; i < depth - 1; i++) response += "  ";

    response += "}";

    return response;
  } catch (e) {
    if (THROW_ERROR) throw e;
  }
}

/**
 * The function `getData` processes JSON data and generates TypeScript type definitions based on the
 * data structure.
 * @param jsonData - The `jsonData` parameter is an object that contains information about a request
 * and its corresponding response. It is expected to have the following properties:
 */
async function getData(jsonData, prefix) {
  // Postman v2 json has item property in it
  // Creates a recursive structure
  if (jsonData.item) {
    for (const item of jsonData.item) await getData(item, prefix);
    return true;
  }

  const req = jsonData.request;

  const exampleResponses = jsonData.response;

  await parseTypeFromPostManRequestJsonBody(jsonData.name, req, prefix);

  await parseTypeFromPostManRequestQuery(jsonData.name, req, prefix);

  await Promise.all(
    exampleResponses.map(async (resp) =>
      parseTypesFromPostManExampleResponse(resp, prefix),
    ),
  );

  return true;
}

/**
 * The function `getPostmanCollectionJSON` fetches remote postman collection with `collectionID` using
 * postman API key `apiKey`.
 * @param collectionID - The `collectionID` parameter is the collectionID of the remote postman collection.
 * @param apiKey - The `apiKey` paramater is the user-generated postman api key.
 */
async function getPostmanCollectionJSON(collectionID, apiKey) {
  try {
    const response = await fetch(
      `https://api.getpostman.com/collections/${collectionID}?format=2.0.0`,
      {
        headers: {
          "X-API-KEY": apiKey,
        },
      },
    );
    const data = await response.json();

    if (data.error)
      throw new Error(`${data.error.name}: ${data.error.message}`);

    return data.collection;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * The main function reads command line arguments, checks file and output folder existence, creates
 * necessary directories, reads JSON data from a file, and calls the getData function.
 */
async function main() {
  const args = await parseArgs();

  if (args["-i"]) file = args["-i"];

  THROW_ERROR = Boolean(args["-te"]);

  INCLUDE_ANY = Boolean(args["-ia"]);

  OUTPUT_DIR = args["-o"];

  PARSE_TYPES = ["json"];

  PREFIX = args["-p"];

  if (args["-ft"]) PARSE_TYPES.push("text");

  if (args["-sc"] && args?.["-sc"]?.split(",").length > 0)
    args?.sc?.split(",").forEach((code) => {
      TYPES_FOR_STATUS_CODE.push(parseInt(code));
    });

  const outputFolderExists = existsSync(OUTPUT_DIR);

  if (args["-i"] && !existsSync(file)) {
    console.log(`File ${file} does not exist`);
    process.exit(1);
  }

  if (!outputFolderExists) mkdirSync(OUTPUT_DIR);

  if (!existsSync(join(OUTPUT_DIR, "queries")))
    mkdirSync(join(OUTPUT_DIR, "queries"));

  if (!existsSync(join(OUTPUT_DIR, "request")))
    mkdirSync(join(OUTPUT_DIR, "request"));

  if (!existsSync(join(OUTPUT_DIR, "response")))
    mkdirSync(join(OUTPUT_DIR, "response"));

  // if U arg, is provided, need to parse collection from postman url
  // would require apiKey as well
  if (args["-U"]) {
    const collectionID = args["-U"]
      .split("")
      .reverse()
      .join("")
      .split("/")[0]
      .split("")
      .reverse()
      .join("");

    const apiKey = args["-X"];

    const jsonData = await getPostmanCollectionJSON(collectionID, apiKey);

    await getData(jsonData, PREFIX);
  } else {
    const data = readFileSync(file);

    const jsonData = JSON.parse(data);

    await getData(jsonData, PREFIX);
  }
}

// if user has asked for help this will print the help
// help is asked if -h or --help is present in command
// or if there is not args
printHelp();

// run the main function
main().then(() => {
  process.exit(0);
});
