import BrowserManager from "./manager/browserManager"
import app from "./app"

const port = process.env.PORT || 3000

// Initialize the browser
;(async () => {
	try {
		const browserManager = BrowserManager.getInstance()
		await browserManager.initializeBrowser()
		console.log("Browser initialized successfully")
	} catch (err) {
		console.error("Failed to initialize the browser:", err)
	}
})()

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})

// Gracefully close the browser when the process is terminated
process.on("SIGTERM", async () => {
	const browserManager = BrowserManager.getInstance()
	await browserManager.closeBrowser()
	process.exit(0)
})
