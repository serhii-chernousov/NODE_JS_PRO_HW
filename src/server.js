import net from "node:net";
import { json } from "node:stream/consumers";
import { parseRequest, makeResponse, ROUTES } from "./helpers.js";

const server = net.createServer((socket) => {
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

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
