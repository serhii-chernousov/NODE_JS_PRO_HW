import net from "node:net";
import { json } from "node:stream/consumers";
import { createServerSocket } from "./helpers.js";

const server = net.createServer((socket) => {
  createServerSocket(socket);
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
