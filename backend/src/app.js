import express from "express"
import cors from "cors"
import { errors } from "celebrate"
import routes from "./routes"

const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)
app.use(errors())

module.exports = app
