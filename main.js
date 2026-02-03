import { requestHandler } from "./src/handle_request.js";
import { serve } from "./src/server.js";

const main = async (port, requestHandler) => {
  await serve(port, requestHandler);
};

main(8000, requestHandler);
