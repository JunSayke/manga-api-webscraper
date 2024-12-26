import express from "express"
import router from "./routes/mangaRoute"
import rotateUserAgent from "./middlewares/rotateUserAgent"
const app = express()

// TODO: Setup middleware, routes, and other configurations here
app.use(rotateUserAgent)
app.use(router)

export default app
