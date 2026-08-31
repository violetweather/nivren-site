import { createServer } from "node:http";

const server = createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("ok");
});
server.listen(46899, "127.0.0.1");
