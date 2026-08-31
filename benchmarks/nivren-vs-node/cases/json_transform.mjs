import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(root, "json_transform", "data", "events.json"), "utf8");
const feed = JSON.parse(source);
let activeCount = 0;
let scoreTotal = 0;
for (const event of feed.events) {
  if (event.active) {
    activeCount += 1;
    scoreTotal += event.score;
  }
}
console.log(`${activeCount}:${scoreTotal}`);
