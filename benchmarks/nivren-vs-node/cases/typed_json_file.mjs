import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const input = JSON.parse(readFileSync(join(root, "typed_json_file/data/input.json"), "utf8"));

function hasExactKeys(value, expected) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

if (!hasExactKeys(input, ["events", "title"]) || typeof input.title !== "string" || !Array.isArray(input.events)) {
  throw new TypeError("invalid Dataset");
}
for (const event of input.events) {
  if (!hasExactKeys(event, ["active", "id", "kind"]) || !Number.isSafeInteger(event.id) || typeof event.kind !== "string" || typeof event.active !== "boolean") {
    throw new TypeError("invalid Event");
  }
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

console.log(JSON.stringify(canonical(input)));
