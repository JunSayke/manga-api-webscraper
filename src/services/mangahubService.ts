// Encapsulate the business logic and data fetching/manipulation
import { ParsedQs } from "qs"
import IManga from "../interfaces/IManga"
import BrowserManager from "../manager/browserManager"
import { PageManager } from "../manager/browserPageManager"
import BaseMangaService from "./baseMangaService"
import PuppeteerWebscraper from "../design_pattern/bridge/scraper/implementor/PuppeteerWebscraper"
import MangaDto from "../dtos/mangaDto"
import { ElementHandle } from "puppeteer"

class MangahubService extends BaseMangaService {
	constructor() {
		super("https://mangahub.io", new PuppeteerWebscraper())

		this.rules["mangaList"] = this.webScraper.createExtractionRule(
			"mangaList",
			"div._1KYcM.col-sm-6.col-xs-12",
			async (el: ElementHandle) => {
				const manga = new MangaDto()
				manga.id = await el.$eval(
					`a[href*="/manga/"]`,
					(el) => el.getAttribute("href")?.split("/").pop() || ""
				)
				manga.title = await el.$eval(
					`a[href*="/manga/"]`,
					(el) => el.getAttribute("title") || ""
				)
				manga.link = await el.$eval(
					`a[href*="/manga/"]`,
					(el) => el.getAttribute("href") || ""
				)
				manga.thumbnailUrl = await el.$eval(
					`div.media-left > a > img`,
					(el) => el.getAttribute("src") || ""
				)
				manga.genres = await el.$$eval("a.label.genre-label", (els) =>
					els.map((el) => el.textContent || "")
				)
				manga.status = await el.$eval(
					"div.media-body span",
					(el) => el.textContent?.match(/\(([^)]+)\)/)?.[1] || ""
				)
				return manga
			}
		)
	}

	private constructQuery({
		q = "",
		order = "",
		genre = "",
		page = 1,
	}: {
		q?: string
		order?: string
		genre?: string
		page?: number
	}) {
		// Base URL
		let queryString = `https://mangahub.io/search/page/${page}`

		// Construct query parameters
		const queryParams = []
		if (q) {
			queryParams.push(`q=${q}`)
		}
		if (order) {
			queryParams.push(`order=${order}`)
		}
		if (genre) {
			queryParams.push(`genre=${genre}`)
		}

		if (queryParams.length > 0) {
			queryString += `?${queryParams.join("&")}`
		}

		return queryString
	}

	private extractPageNumber(url: string): number {
		const match = url.match(/page\/(\d+)/)
		return match ? parseInt(match[1], 10) : 1
	}

	private nextPageHandler(url: string): string {
		const pageNumber = this.extractPageNumber(url)
		const nextPageNumber = pageNumber + 1
		return url.replace(/page\/\d+/, `page/${nextPageNumber}`)
	}

	public async getLatestMangas(maxResults: number = 10): Promise<IManga[]> {
		const mangaList: IManga[] = []
		let page = 1

		let query = this.constructQuery({ order: "LATEST", page })

		while (mangaList.length < maxResults) {
			await this.webScraper.loadPage(query)
			const result = await this.webScraper.scrape([this.rules["mangaList"]])
			const mangas = result["mangaList"]
			mangaList.push(...mangas)

			this.webScraper.cleanup()
			if (mangas.length === 0) break
			page++
			query = this.nextPageHandler(query)
		}

		return mangaList.slice(0, maxResults)
	}

	public async searchMangas(query: ParsedQs): Promise<IManga[]> {
		const mangaList: IManga[] = []
		let { limit } = query
		if (!limit) {
			limit = "50"
		}
		let queryString = this.constructQuery(query)

		while (mangaList.length < Number(limit)) {
			await this.webScraper.loadPage(queryString)
			const result = await this.webScraper.scrape([this.rules["mangaList"]])
			const mangas = result["mangaList"]
			mangaList.push(...mangas)

			this.webScraper.cleanup()
			if (mangas.length === 0) break
			queryString = this.nextPageHandler(queryString)
		}

		return mangaList.slice(0, Number(limit))
	}

	public async getMangasByGenres(
		genres: string[],
		maxResults: number = 10
	): Promise<IManga[]> {
		throw new Error("Method not implemented.")
	}

	public getStatusFilters(): string[] {
		return ["all", "completed", "ongoing"]
	}

	// Genres are encoded as numbers in the query string instead of a label ex: action = 1
	public getGenreFilters(): string[] {
		throw new Error("Method not implemented.")
	}
}

export default MangahubService
