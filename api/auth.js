module.exports = async (fastify) => {
  const db = fastify.db;

  fastify.post("/login", {
    schema: {
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" }
        }
      }
    },
    handler: async (request, reply) => {
      const { username, password } = request.body;
      if (username != "admin") {
        reply.status(401).send({
          error: "username salah"
        });
      } else if (password != "admin") {
        reply.status(401).send({
          error: "password salah"
        });
      } else {
        reply.send({
          message: "OK"
        })
      }
    }
  })
}