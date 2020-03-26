import connection from "../database/connection"

module.exports = {
  async index(req, res) {
    const { page = 1, limit = 5 } = req.query

    const [count] = await connection("incidents").count()

    const incidents = await connection("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(limit)
      .offset((page - 1) * limit)
      .select([
        "incidents.*",
        "ongs.name",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ])
      .orderBy("id", "desc")

    res.header("X-Total-Count", count["count(*)"])

    return res.json(incidents)
  },

  async create(req, res) {
    const { authorization: ong_id } = req.headers
    const { title, description, value } = req.body

    if (!title || !description || !value) {
      return res.status(400).json({ error: "Validation failed." })
    }

    const [id] = await connection("incidents").insert({
      ong_id,
      title,
      description,
      value
    })

    return res.json({ id })
  },

  async delete(req, res) {
    const { id } = req.params
    const { authorization: ong_id } = req.headers

    const incident = await connection("incidents")
      .where("id", id)
      .select("ong_id")
      .first()

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({ error: "Operation not allowed." })
    }

    await connection("incidents").where("id", id).delete()

    return res.status(204).send()
  }
}
