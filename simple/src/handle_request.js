const greeting = await Deno.readTextFileSync("./pages/greeting.html");
const example = await Deno.readTextFileSync("./pages/example.html");

const createResponseLine = (protocol, statusCode) => {
  const statusDesc = {
    200: "OK",
    404: "NOT FOUND",
  };
  return { protocol, statusCode, desc: statusDesc[statusCode] };
};
const createResponse = (protocol, content, statusCode) => {
  const headers = {
    "Content-Type": "text/html",
    "Content-Length": content.length,
  };

  const responseLine = createResponseLine(protocol, statusCode);

  return { responseLine, headers, body: content };
};

export const requestHandler = (protocol, path) => {
  console.log(path);

  switch (path) {
    case "/":
      return createResponse(protocol, greeting, 200);
    case "/greeting.html":
      return createResponse(protocol, greeting, 200);
    case "/example.html":
      console.log(" i was here");

      return createResponse(protocol, example, 200);
    default:
      return;
  }
};
