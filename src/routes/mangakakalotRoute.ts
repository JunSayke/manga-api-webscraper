// Define the endpoints and map them to controller functions
import { Router, Request, Response } from "express"
import { getLatestMangas } from "../controllers/mangakakalotController"

const router = Router()

// Test endpoint
router.get("/", (req: Request, res: Response) => {
	res.send("Hello World!")
})

// Route for getting the latest mangas
router.get("/latest", getLatestMangas)

export default router
