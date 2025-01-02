import express from "express"
import router from "./routes/baseRoute"
const app = express()

// TODO: Setup middleware, routes, and other configurations here
// app.use(rotateUserAgent) // commentout because the request headers should be set not on the endpoint but to the cheerio request
app.use(router)

export default app
