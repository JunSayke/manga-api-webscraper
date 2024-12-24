const express = require("express")
const axios = require("axios")
const app = express()
const port = 3000

// A proxy to serve the scrape images to avoid CORS issues or being blocked
app.get("/image", async (req, res) => {
	const imageUrl =
		"https://v4.mkklcdnv6tempv2.com/img/tab_4/03/52/00/ja986557/chapter_12/1-o.jpg"

	try {
		const response = await axios.get(imageUrl, {
			responseType: "arraybuffer",
			headers: {
				Referer: "https://chapmanganato.to/",
			},
		})
		res.set("Content-Type", response.headers["content-type"])
		res.send(response.data)
	} catch (error) {
		res.status(500).send("Error fetching the image: " + error.message)
	}
})

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
