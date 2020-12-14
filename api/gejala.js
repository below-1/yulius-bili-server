module.exports = async (fastify) => {

  const db = fastify.db;

  fastify.post("/", {
    schema: {
      body: {
        type: "object",
        properties: {
          nama: {
            type: "string"
          }
        }
      }
    },
    handler: async (request, reply) => {
      const payload = request.body;
      const result = await db("gejala").insert(payload);
      reply.send(result);
    }
  });

  fastify.put("/:id", async (request, reply) => {
    const payload = request.body;
    const id = request.params.id;
    const item = await db("gejala")
      .where('id', '=', id)
      .update({
        nama: payload.nama
      });
    reply.send({
      status: "OK"
    });
  });

  fastify.delete("/:id", async (request, reply) => {
    const id = request.params.id;
    await db("gejala")
      .where("id", "=", id)
      .del();
    reply.send({
      status: "OK"
    })
  });

  fastify.get("/", async (request, reply) => {
    const items = await db("gejala").select();
    reply.send(items);
  })

  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;
    const item = await db("gejala").where("id", "=", id)
      .first();
    reply.send(item);
  })
}