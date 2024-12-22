// https://www.youtube.com/watch?v=-ZMwRnxIxZY
const axios = require("axios")
const cheerio = require("cheerio")

const domain = "https://mangakakalot.com/"
const latestMangas = []

const userAgents = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
]

// TODO: Handle 429 Too Many Requests error
// TODO: Should I limit page range?
async function getLatest(startPage = 1, endPage = 100) {
	const baseUrl = `${domain}manga_list?type=latest&category=all&state=all&page=`

	for (let page = startPage; page <= endPage; page++) {
		try {
			const userAgent =
				userAgents[Math.floor(Math.random() * userAgents.length)]
			const response = await axios.get(`${baseUrl}${page}`, {
				headers: { "User-Agent": userAgent },
			})
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

			// Determine available pages
			const availablePages = $(
				"div.panel_page_number div.group_page a.page_last"
			).attr("href")
			const maxPage = availablePages
				? parseInt(availablePages.match(/page=(\d+)/)[1])
				: endPage
			if (page >= maxPage) break
		} catch (error) {
			console.error(`Error fetching page ${page}:`, error.message)
			continue
		}
	}
	console.log(latestMangas)
}

getLatest(1, 50)
