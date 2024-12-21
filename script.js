const cheerio = require("cheerio")
const axios = require("axios")

const url = "https://mangakakalot.com/"

async function getLatest() {
	try {
		const response = await axios.get(url)
		const $ = cheerio.load(response.data)
		const test = $(
			"body > div.container > div.main-wrapper > div.leftCol > div.daily-update > h2"
		).text()

		console.log(test)
	} catch (error) {
		console.error(error)
	}
}

getLatest()
