import net from "node:net";
import { json } from "node:stream/consumers";

const parseRequest = (request) => {
  const headersLastIndex = request.indexOf("\r\n\r\n");
  if (headersLastIndex === -1) {
    console.log("header not ready");
    return null;
  }
  const [requestLine, ...headers] = request
    .slice(0, headersLastIndex)
    .split("\r\n");
  const [method, path] = requestLine.split(" ");
  const headersMap = headers.reduce((acc, header) => {
    const [key, value] = header.split(": ");
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});

  return { method, path, headersMap };
};

const makeResponse = (status, body) => {
  return (
    `HTTP/1.1 ${status}\r\n` +
    `Content-Type: text/plain\r\n` +
    `Content-Length: ${Buffer.byteLength(body)}\r\n` +
    `Connection: close\r\n` +
    `\r\n` +
    body
  );
};

const ROUTES = {
  "/": (socket) => {
    let body = "greetings from the server";
    socket.write(makeResponse("200 OK", body));
  },
  "/headers": (socket, headersMap) => {
    let body = JSON.stringify(headersMap);
    console.log(body);
    socket.write(makeResponse("200 OK", body));
  },
};

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
      const { method, path, headersMap } = request;

      const route = ROUTES[path];
      if (route) {
        route(socket, headersMap);
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
