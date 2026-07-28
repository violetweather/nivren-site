import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(root, "text_file/data/events.log"), "utf8");
console.log(JSON.stringify(source.split("\n")));
