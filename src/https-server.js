import tls from "node:tls";
import fs from "node:fs";
import { createServerSocket } from "./helpers.js";

const options = {
  key: fs.readFileSync("ca-key.pem"),
  cert: fs.readFileSync("ca-cert.pem"),
};

const server = tls.createServer(options, (socket) => {
  createServerSocket(socket);
});

server.listen(3443, () => {
  console.log("Server is running on port 3443");
});
