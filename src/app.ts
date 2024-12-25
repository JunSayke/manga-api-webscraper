import express from "express"
import router from "./routes/mainRoute"
const app = express()

app.use("/api", router)
// TODO: Setup middleware, routes, and other configurations here

export default app
