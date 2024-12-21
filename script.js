const cheerio = require("cheerio")
const axios = require("axios")

const domain = "https://mangakakalot.com/"
const mangaListUrl = `${domain}manga_list?type=latest&category=all&state=all&page=1`
const latestMangas = []

// https://www.youtube.com/watch?v=-ZMwRnxIxZY
// TODO: Handle pagination
// TODO: Prevent being blocked by the website
async function getLatest() {
	try {
		const response = await axios.get(mangaListUrl)
		const $ = cheerio.load(response.data)
		const mangas = $("div.list-truyen-item-wrap")

		mangas.each(function () {
			const title = $(this).find("h3 a").text()
			const thumbnail = $(this).find("a img").attr("src")
			const mangaLink = $(this).find("h3 a").attr("href")

			latestMangas.push({
				title: title,
				thumbnail: thumbnail,
				link: mangaLink,
			})
		})
		console.log(latestMangas)
	} catch (error) {
		console.error(error)
	}
}

getLatest()
