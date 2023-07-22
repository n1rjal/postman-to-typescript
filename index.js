const {
  createReadStream,
  readFile,
  writeFile,
  existsSync,
  mkdirSync,
} = require("fs");
const { join } = require("path");

/* These lines of code are declaring and initializing variables that will be used in the program: */
let file = "";
let throwError = false;
let INCLUDE_ANY = true;
let TYPES_FOR_STATUS_CODE = [];
let OUTPUT_DIR = "";
let PARSE_TYPES = ["json"];

/* The code is defining two constants: one for all typescript illegal characters and other for numeric types in js*/
const TS_ILLEGAL_CHARACTERS = /[^\w\s\n]/g;
const NUMERIC_TYPES = ["number", "bigint"];

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

  console.log({ string, strfmt: string.replaceAll("\n", ""), legalString });

  return legalString.reduce((accumulator, word) => {
    return accumulator + word[0].toUpperCase() + word.slice(1);
  }, "");
}

/**
 * The function `getTypescriptEquivalentForVariable` returns the TypeScript equivalent type for a given
 * JavaScript variable.
 * @param value - The `value` parameter in the `getTypescriptEquivalentForVariable` function is the
 * variable for which we want to determine the TypeScript equivalent type.
 * @returns a TypeScript equivalent type for the given variable.
 */
function getTypescriptEquivalentForVariable(value) {
  const type = typeof value;

  if (type === "object") {
    if (Array.isArray(value)) {
      const type = getTypescriptEquivalentForVariable(value[0]);
      return type ? `${type}[]` : INCLUDE_ANY ? "any[]" : "unknown[]";
    }
    let nestedType = getTypeScriptTypeFromRawJson(null, JSON.stringify(value));
    return nestedType;
  }

  if (type === "boolean") return "boolean";
  if (NUMERIC_TYPES.includes(type)) return "number";
  if (type === "string") return "string";
  if (value === null) return "null";
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
function getTypeScriptTypeFromRawJson(name, rawJson) {
  let response =
    name.length > 0 ? `export interface I${toCamelCase(name)} { \n` : "{";
  try {
    let jsonData = JSON.parse(rawJson);
    if (Array.isArray(jsonData) && jsonData.length > 0) jsonData = jsonData[0];

    for (const key in jsonData) {
      response += `  ${key}: ${getTypescriptEquivalentForVariable(
        jsonData[key]
      )}; \n`;
    }
    response += "}";
    return response;
  } catch (e) {
    if (throwError) throw e;
  }
}

/**
 * The function `getData` processes JSON data and generates TypeScript type definitions based on the
 * data structure.
 * @param jsonData - The `jsonData` parameter is an object that contains information about a request
 * and its corresponding response. It is expected to have the following properties:
 */
function getData(jsonData) {
  if (jsonData.item) {
    for (const item of jsonData.item) {
      getData(item);
    }
  } else {
    const req = jsonData.request;

    if (
      PARSE_TYPES.includes("text") &&
      req?.body?.raw &&
      req?.body?.mode === "raw"
    ) {
      let rawJson = req.body.raw;
      try {
        rawJson = JSON.parse(rawJson);
        const name = jsonData.name;
        const raw = req.body.raw;
        const method = req.method;
        const url = req.url;

        const content = getTypeScriptTypeFromRawJson(name, raw);
        const path = join(
          `${OUTPUT_DIR}`,
          "request",
          `I${toCamelCase(name)}Request.ts`
        );
        const fileContent = `/*\n${name}\n${method}: ${url}\n*/\n` + content;
        writeFile(path, fileContent, { flag: "w+" }, (err) => {
          if (err) throw err;
        });
      } catch (e) {
        if (throwError)
          throw {
            message: e.message,
            url: req.url,
            method: req.method,
            e,
          };
      }
    }

    if (req?.body?.options?.raw?.language === "json" && req?.body?.raw) {
      const name = jsonData.name;
      const raw = req.body.raw;
      const method = req.method;
      const url = req.url;

      const content = getTypeScriptTypeFromRawJson(name, raw);
      const path = join(
        `${OUTPUT_DIR}`,
        "request",
        `I${toCamelCase(name)}Request.ts`
      );
      const fileContent = `/*\n${name}\n${method}: ${url}\n*/\n` + content;
      writeFile(path, fileContent, { flag: "w+" }, (err) => {
        if (err) throw err;
      });
    }

    if (req?.url?.query && req?.url?.query?.length > 0) {
      const name = jsonData.name;
      const method = req.method;
      const url = req.url.raw;

      if (req?.url?.query && req?.url?.query.length > 0) {
        const json = req.url.query.reduce(
          (accumulator, item) => ({
            ...accumulator,
            [TS_ILLEGAL_CHARACTERS.test(item.key) ? `"${item.key}"` : item.key]:
              item.value,
          }),
          {}
        );
        const content = getTypeScriptTypeFromRawJson(
          name,
          JSON.stringify(json)
        );
        const path = join(
          `${OUTPUT_DIR}`,
          "queries",
          `I${toCamelCase(name)}Query.ts`
        );
        const fileContent = `/*\n${name}\n${method}: ${url}\n*/\n` + content;
        writeFile(path, fileContent, { flag: "w+" }, (err) => {
          if (err) throw err;
        });
      }
    }
    for (const response of jsonData.response) {
      const name = `${response.name} ResponseBody`;
      const rawJson = response.body;

      if (
        PARSE_TYPES.includes(response._postman_previewlanguage) &&
        rawJson.length > 0 &&
        TYPES_FOR_STATUS_CODE.includes(200)
      ) {
        const content = getTypeScriptTypeFromRawJson(name, rawJson);
        const fileContent = `/*\n${name}\n*/\n` + content;
        const path = join(
          `${OUTPUT_DIR}`,
          "response",
          `I${toCamelCase(name)}.ts`
        );
        writeFile(path, fileContent, { flag: "w+" }, (err) => {
          if (err) throw err;
        });
      }
    }
  }
}

/* The code is reading the contents of a JSON file named "eater.json". It then parses the JSON data and
assigns the values of certain properties to variables (`file`, `throwError`, `INCLUDE_ANY`,
`OUTPUT_DIR`, `TYPES_FOR_STATUS_CODE`). */
readFile(join(__dirname, "eater.json"), (err, data) => {
  if (err) throw err;
  const jsonData = JSON.parse(data);
  file = jsonData.file;
  throwError = jsonData.throwError;
  INCLUDE_ANY = jsonData.includeAny;
  OUTPUT_DIR = jsonData.outputDir;
  TYPES_FOR_STATUS_CODE = jsonData.typesForStatusCode;

  if (jsonData.forceParsingTextContent) PARSE_TYPES.push("text");
  const inputFileExists = existsSync(file);
  const outputFolderExists = existsSync(OUTPUT_DIR);

  if (!outputFolderExists) {
    mkdirSync(OUTPUT_DIR);
  }

  if (!existsSync(join(OUTPUT_DIR, "queries"))) {
    mkdirSync(join(OUTPUT_DIR, "queries"));
  }

  if (!existsSync(join(OUTPUT_DIR, "request"))) {
    mkdirSync(join(OUTPUT_DIR, "request"));
  }

  if (!existsSync(join(OUTPUT_DIR, "response"))) {
    mkdirSync(join(OUTPUT_DIR, "response"));
  }

  if (!inputFileExists) throw new Error(`File ${file} does not exist`);

  readFile(file, "utf8", (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    getData(jsonData);
  });
});
