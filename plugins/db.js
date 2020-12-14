const fp = require("fastify-plugin");
const knex = require("knex");

module.exports = fp(async function (fastify) {
  const db = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'bili_db',
      password : 'bili_db',
      database : 'bili_db'
    }
  });

  fastify.decorate("db", db);
});
