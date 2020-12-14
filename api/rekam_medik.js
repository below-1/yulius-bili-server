module.exports = async (fastify) => {

  const db = fastify.db;

  fastify.post("/", {
    schema: {
      body: {
        type: "object",
        required: ["nama_pasien", "waktu", "solusi", "status", "gejala", "id_penyakit"],
        properties: {
          nama_pasien: { type: "string" },
          waktu: { type: "string", format: "date-time" },
          solusi: { type: "string" },
          status: { type: "string" },
          gejala: { type: "array" },
          id_penyakit: { type: "number" }
        }
      }
    },
    handler: async (request, reply) => {
      const payload = request.body;
      db.transaction(async tx => {
        const [ id ] = await tx("rekam_medik").insert({
          nama_pasien: payload.nama_pasien,
          waktu: new Date(payload.waktu),
          solusi: payload.solusi,
          id_penyakit: payload.id_penyakit,
          status: payload.status
        });
        const gejalas = payload.gejala.map(gid => ({
          id_gejala: gid,
          id_rekam_medik: id
        }));
        await tx("rekam_medik_gejala")
          .insert(gejalas);
      });
      reply.send({
        status: "OK"
      });
    }
  })

  fastify.get("/", {
    schema: {
      querystring: {
        status: { type: "string" }
      }
    },
    handler: async (request, reply) => {
      const query = request.query;
      let qb = db("rekam_medik as rm");
      if (query.status && query.status != "all") {
        qb = qb.where("rm.status", "=", query.status)
      }
      let items = await qb
        .leftJoin("penyakit as p", "p.id", "rm.id_penyakit")
        .leftJoin("rekam_medik_gejala as rmg", "rm.id", "rmg.id_rekam_medik")
        .leftJoin("gejala as g", "g.id", "rmg.id_gejala")
        .select([
          "rm.id",
          "rm.nama_pasien",
          "rm.waktu",
          "rm.solusi",
          "rm.status",
          "p.id as penyakit_id",
          "p.nama as penyakit_nama",
          db.raw("JSON_ARRAYAGG(rmg.id_gejala) as gejala")
        ])
        .groupBy("rm.id");
      items = items.map(it =>  ({
        ...it,
        gejala: JSON.parse(it.gejala)
      }));
      reply.send(items);
    }
  })

  fastify.get("/:id", {
    handler: async (request, reply) => {
      const { id } = request.params;
      const rm = await db("rekam_medik as rm")
        .where("rm.id", "=", id)
        .leftJoin("penyakit as p", "p.id", "rm.id_penyakit")
        .select([
          "rm.id",
          "rm.nama_pasien",
          "rm.waktu",
          "rm.solusi",
          "rm.status",
          "rm.id_penyakit",
          "p.nama as penyakit_nama"
        ])
        .first();
      const gejala = await db("rekam_medik_gejala as rm_gj")
        .where("rm_gj.id_rekam_medik", "=", id)
        .leftJoin("gejala as g", "g.id", "rm_gj.id_gejala")
        .select([
          "g.id",
          "g.nama",
          "g.bobot"
        ]);
      return {
        ...rm,
        gejala
      }
    }
  })

  fastify.put("/:id", {
    schema: {
      body: {
        type: "object",
        required: ["nama_pasien", "waktu", "solusi", "status", "gejala", "id_penyakit"],
        properties: {
          nama_pasien: { type: "string" },
          waktu: { type: "string", format: "date-time" },
          solusi: { type: "string" },
          status: { type: "string" },
          gejala: { type: "array" },
          id_penyakit: { type: "number" }
        }
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const payload = request.body;
      db.transaction(async tx => {
        await tx("rekam_medik")
          .where("id", "=", id)
          .update({
            nama_pasien: payload.nama_pasien,
            waktu: new Date(payload.waktu),
            solusi: payload.solusi,
            id_penyakit: payload.id_penyakit,
            status: payload.status
          });
        const gejalas = payload.gejala.map(gid => ({
          id_gejala: gid,
          id_rekam_medik: id
        }));
        await tx("rekam_medik_gejala")
          .where("id_rekam_medik", "=", id)
          .delete();
        await tx("rekam_medik_gejala")
          .insert(gejalas);
      });
      reply.send({
        status: "OK"
      });
    }
  })

  fastify.delete("/:id", {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "number" }
        }
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      await db("rekam_medik").where("id", "=", id);
      reply.send({
        status: "OK"
      })
    }
  })

}