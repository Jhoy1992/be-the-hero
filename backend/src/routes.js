import express from "express"

import OngController from "./controllers/OngController"
import IncidentController from "./controllers/IncidentController"
import ProfileController from "./controllers/ProfileController"
import SessionController from "./controllers/SessionController"

const routes = express.Router()

routes.post("/sessions", SessionController.create)

routes.post("/ongs", OngController.create)
routes.get("/ongs", OngController.index)
routes.delete("/ongs/:id", OngController.delete)

routes.post("/incidents", IncidentController.create)
routes.get("/incidents", IncidentController.index)
routes.delete("/incidents/:id", IncidentController.delete)

routes.get("/profile", ProfileController.index)

export default routes
