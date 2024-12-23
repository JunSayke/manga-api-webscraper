// https://www.youtube.com/watch?v=-ZMwRnxIxZY
// TODO: Cloudflare protection bypass (although I haven't encountered it yet)
// TODO: Refactor urls parameter to be more dynamic instead of using the actual url
const axios = require("axios")
const cheerio = require("cheerio")

const domain = "https://mangakakalot.com/"
const urls = {
	latest: `${domain}manga_list?type=latest&category=all&state=all&page=`,
	search: `${domain}search/story/`,
}

// Imitate different browsers
const userAgents = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
]

// TODO: Handle 429 Too Many Requests error
// TODO: Should I limit page range?
async function getLatest(startPage = 1, endPage = 1) {
	const latestMangas = []
	for (let page = startPage; page <= endPage; page++) {
		try {
			const userAgent =
				userAgents[Math.floor(Math.random() * userAgents.length)]
			const response = await axios.get(`${urls.latest}${page}`, {
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
			continue // If error, try next page
		}
	}
	return latestMangas
}

async function searchMangas(mangaTitle, startPage = 1, endPage = 1) {
	const searchResults = []
	for (let page = startPage; page <= endPage; page++) {
		try {
			const userAgent =
				userAgents[Math.floor(Math.random() * userAgents.length)]
			const response = await axios.get(
				`${urls.search}${mangaTitle}?page=${page}`,
				{
					headers: { "User-Agent": userAgent },
				}
			)
			const $ = cheerio.load(response.data)
			const mangas = $("div.story_item")

			mangas.each(function () {
				const title = $(this).find("h3.story_name a").text()
				const thumbnail = $(this).find("a img").attr("src")
				const mangaLink = $(this).find("h3.story_name a").attr("href")
				const author = $(this)
					.find("span:contains('Author(s)')")
					.text()
					.replace("Author(s) : ", "")
				const updated = $(this)
					.find("span:contains('Updated')")
					.text()
					.replace("Updated : ", "")

				searchResults.push({
					title: title,
					thumbnail: thumbnail,
					link: mangaLink,
					author: author,
					updated: updated,
				})
			})

			// Determine available pages
			if (page === startPage) {
				const availablePages = $(
					"div.panel_page_number div.group_page a.page_last"
				).attr("href")
				const maxPage = availablePages
					? parseInt(availablePages.match(/page=(\d+)/)[1])
					: endPage
				endPage = Math.min(endPage, maxPage)
			}
		} catch (error) {
			console.error(
				`Error fetching search results for page ${page}:`,
				error.message
			)
			continue // If error, try next page
		}
	}
	return searchResults
}

// NOTE: Manga details in mangakakalot seems to have a different domain chapmanganato.to
async function getMangaChapters(mangaUrl) {
	try {
		const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)]
		const response = await axios.get(mangaUrl, {
			headers: { "User-Agent": userAgent },
		})
		const $ = cheerio.load(response.data)
		const chapters = []

		$("ul.row-content-chapter li.a-h").each(function () {
			const chapterTitle = $(this).find("a.chapter-name").text()
			const chapterLink = $(this).find("a.chapter-name").attr("href")
			const chapterDate = $(this).find("span.chapter-time").attr("title")

			chapters.push({
				title: chapterTitle,
				link: chapterLink,
				date: chapterDate,
			})
		})

		return chapters
	} catch (error) {
		console.error(`Error fetching manga chapters:`, error.message)
	}
}

// NOTE: Manga content in mangakakalot seems to have a different domain chapmanganato.to
// TODO: When trying to access the image url directly, it seems to be blocked? altho it works fine when the referer is the manga page. Maybe get it somehow through the developer tools source? Or find a way to serve it with the correct referer?
// TODO: How to handle image server switching? Puppeteer dependency?
async function getChapterContent(chapterUrl) {
	try {
		const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)]
		const response = await axios.get(chapterUrl, {
			headers: { "User-Agent": userAgent },
		})
		const $ = cheerio.load(response.data)
		const images = []

		$("div.container-chapter-reader img").each(function () {
			const imageUrl = $(this).attr("src")
			images.push(imageUrl)
		})

		return images
	} catch (error) {
		console.error(`Error fetching chapter content:`, error.message)
	}
}

// Example usage
// getLatest(1, 1).then(results => console.log(results))
// searchMangas("isekai", 1, 1).then((results) => console.log(results))
// getMangaChapters("https://chapmanganato.to/manga-ja986557").then((chapters) =>
// 	console.log(chapters)
// )
getChapterContent("https://chapmanganato.to/manga-ja986557/chapter-12").then(
	(images) => console.log(images)
)
