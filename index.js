const Koa = require("koa");

const app = new Koa();

try {
  const port = process.env.PORT || 8080;
  const host = process.env.IP || "0.0.0.0";

  app.listen(port, host);
  console.log("server started on port " + port);
} catch (error) {
  console.error("Error starting server:", error);
  process.exit(1);
}
