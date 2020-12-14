module.exports = async (fastify) => {
  fastify.get("/", (request, reply) => {
    reply.send("ok");
  });
  fastify.register(require('./gejala'), { prefix: "gejala" });
  fastify.register(require('./penyakit'), { prefix: "penyakit" });
  fastify.register(require('./rekam_medik'), { prefix: "rm" });
  fastify.register(require('./auth'), { prefix: "auth" });
}