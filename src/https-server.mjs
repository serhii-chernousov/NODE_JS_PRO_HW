import tls from "node:tls";
import fs from "node:fs";

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

const options = {
  key: fs.readFileSync("ca-key.pem"),
  cert: fs.readFileSync("ca-cert.pem"),
};

const server = tls.createServer(options, (socket) => {
  console.log("Client connected");
  socket.write(makeResponse("200 OK", "Hello from the server"));
  socket.end();
});

server.listen(3443, () => {
  console.log("Server is running on port 3443");
});
