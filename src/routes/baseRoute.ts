// Define the endpoints and map them to controller functions
import { Router, Request, Response } from "express"
import { getLatestMangas } from "../controllers/baseController"

const router = Router()

// Test endpoint
router.get("/", (req: Request, res: Response) => {
	res.send("Hello World!")
})

// Route for getting the latest mangas
// Sample URL: /mangakakalot/latest, throws an error if the service is not provided or if the service is not supported
router.get("/:service/latest", getLatestMangas)

export default router
