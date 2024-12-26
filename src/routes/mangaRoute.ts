// Define the endpoints and map them to controller functions
import { Router, Request, Response } from "express"

const router = Router()

// Test endpoint
router.get("/", (req: Request, res: Response) => {
	res.send("Hello World!")
})

export default router
