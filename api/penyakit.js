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
      const result = await db("penyakit").insert(payload);
      reply.send(result);
    }
  });

  fastify.put("/:id", async (request, reply) => {
    const payload = request.body;
    const id = request.params.id;
    const item = await db("penyakit")
      .where('id', '=', id)
      .update({
        nama: payload.nama
      });
    reply.send({
      status: "OK"
    })
  });

  fastify.delete("/:id", async (request, reply) => {
    const id = request.params.id;
    await db("penyakit")
      .where("id", "=", id)
      .del();
    reply.send({
      status: "OK"
    })
  });

  fastify.get("/", async (request, reply) => {
    const items = await db("penyakit as p")
      .leftJoin("rekam_medik as rm", "rm.id_penyakit", "p.id")
      .select([
        "p.id",
        "p.nama",
        db.raw("count(rm.id) as total")
      ])
      .groupBy("p.id");
    reply.send(items);
  })

  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;
    const item = await db("penyakit").where("id", "=", id).first();
    reply.send(item);
  })
}