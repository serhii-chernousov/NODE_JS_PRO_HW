export const parseRequest = (request) => {
  const headersLastIndex = request.indexOf("\r\n\r\n");
  if (headersLastIndex === -1) {
    console.log("header not ready");
    return null;
  }
  const [requestLine, ...headers] = request
    .slice(0, headersLastIndex)
    .split("\r\n");
  const [method, path] = requestLine.split(" ");
  const headersList = headers.reduce((acc, header) => {
    const [key, value] = header.split(": ");
    acc.push(`${key}: ${value}`);
    return acc;
  }, []);

  return { method, path, headersList };
};

export const makeResponse = (status, body) => {
  return (
    `HTTP/1.1 ${status}\r\n` +
    `Content-Type: text/plain\r\n` +
    `Content-Length: ${Buffer.byteLength(body)}\r\n` +
    `Connection: close\r\n` +
    `\r\n` +
    body
  );
};

export const ROUTES = {
  "/": (socket) => {
    let body = "greetings from the server";
    socket.write(makeResponse("200 OK", body));
  },
  "/headers": (socket, headersList) => {
    let body = headersList.join("\n");
    console.log(body);
    socket.write(makeResponse("200 OK", body));
  },
};
