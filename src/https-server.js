import tls from "node:tls";
import fs from "node:fs";
import { makeResponse, ROUTES, parseRequest } from "./helpers.js";

const root = import.meta.dirname;

const options = {
  key: fs.readFileSync(path.join(root, "ca-key.pem")),
  cert: fs.readFileSync(path.join(root, "ca-cert.pem")),
};

const server = tls.createServer(options, (socket) => {
  let buffer = "";

  socket.on("data", (data) => {
    buffer += data.toString("latin1");
    try {
      const request = parseRequest(buffer);
      if (!request) {
        return;
      }
      console.log(request);
      const { method, path, headersList } = request;

      const route = ROUTES[path];
      if (route) {
        route(socket, headersList);
      } else {
        socket.write(makeResponse("404 Not Found", "404 Not Found"));
      }
      socket.end();
    } catch (error) {
      console.error("Error:", error);
      socket.write(
        makeResponse("500 Internal Server Error", "Internal Server Error"),
      );
      socket.end();
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(3443, () => {
  console.log("Server is running on port 3443");
});
