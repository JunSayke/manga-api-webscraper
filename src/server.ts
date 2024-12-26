// main entry point
import app from "./app"
const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
