require("dotenv").config();

const path = require("path");
const blipp = require("fastify-blipp");
const cors = require("fastify-cors");
// const static = require("fastify-static");
const fastify = require("fastify")({
  logger: false
});
const db_plugin = require("./plugins/db");

fastify
  .register(blipp)
  .register(cors)
  .register(db_plugin)
  .register(require("./api"), {
    prefix: "/v1/api"
  })
  .listen(process.env.PORT, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.blipp();
    fastify.log.info(`server listening on ${address}`);
  });
