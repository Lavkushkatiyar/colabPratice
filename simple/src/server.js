const decoder = new TextDecoder();
const encoder = new TextEncoder();

const writeResponse = async (connection, formattedResponse) =>
  await connection.write(encoder.encode(formattedResponse));

const createResponseLine = ({ protocol, statusCode, desc }) =>
  `${protocol} ${statusCode} ${desc}`;

const createHeaders = (headers) =>
  Object.entries(headers)
    .map(([name, value]) => `${name}: ${value}`)
    .join("\r\n");

const formatResponse = ({ responseLine, headers, body }) => {
  return [createResponseLine(responseLine), createHeaders(headers), "", body]
    .join("\r\n");
};

const readRequest = async (connection) => {
  const buffer = new Uint8Array(1024);
  const bytesRead = await connection.read(buffer);

  if (bytesRead === null) {
    return { success: false, error: "No data read" };
  }

  const content = decoder.decode(buffer.slice(0, bytesRead));
  return { success: true, content };
};

const parseRequest = (request) => {
  const [requestLine] = request.split("\r\n");
  const [method, path, protocol] = requestLine.split(" ");
  console.log(`Method = ${method}, path = ${path}, protocol = ${protocol}`);
  return { method, path, protocol };
};

export const handleConnection = async (connection, requestHandler) => {
  const { success, content, error } = await readRequest(connection);

  if (!success) {
    console.error(error);
    connection.close();
    return;
  }

  const { path, protocol } = parseRequest(content);
  const response = requestHandler(protocol, path);
  const formattedResponse = formatResponse(response);

  await writeResponse(connection, formattedResponse);
};

export const serve = async (port, requestHandler) => {
  const listener = Deno.listen({ port });
  console.log("Server running on http://localhost:8000");
  for await (const connection of listener) {
    handleConnection(connection, requestHandler);
  }
};
