import crypto from "crypto"
import connection from "../database/connection"

module.exports = {
  async index(req, res) {
    const ongs = await connection("ongs").select("*")

    return res.json(ongs)
  },

  async create(req, res) {
    const { name, email, whatsapp, city, uf } = req.body
    const id = crypto.randomBytes(4).toString("HEX")

    if (!name || !email || !whatsapp || !city || !uf) {
      return res.status(400).json({ error: "Validation failed." })
    }

    await connection("ongs").insert({ id, name, email, whatsapp, city, uf })

    return res.json({ id })
  },

  async delete(req, res) {
    const { id } = req.params
    await connection("ongs").where("id", id).del()

    return res.json()
  }
}
