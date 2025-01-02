// Encapsulate the business logic and data fetching/manipulation
import { ElementHandle } from "puppeteer"
import { ParsedQs } from "qs"
import PuppeteerWebscraper from "../design_pattern/bridge/scraper/implementor/PuppeteerWebscraper"
import Manga from "../types/Manga"
import AbstractBaseMangaService from "./AbstractBaseMangaService"
import IElementHandler from "../design_pattern/adapter/IElementHandler"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"

class MangahubService extends AbstractBaseMangaService {
	constructor(
		url: string = "https://mangahub.io",
		webscraper: IWebscraper = new PuppeteerWebscraper()
	) {
		super(url, webscraper)

		this.mangaListRules["container"].selector = "div._1KYcM.col-sm-6.col-xs-12"
		this.mangaListRules["title"].selector = "a[href*='/manga/']"
		this.mangaListRules["title"].extract = async (el: IElementHandler) =>
			await el.attr("title")
		this.mangaListRules["link"].selector = "a[href*='/manga/']"
		this.mangaListRules["link"].extract = async (el: IElementHandler) =>
			await el.attr("href")
		this.mangaListRules["thumbnail"].selector = "div.media-left > a > img"
		this.mangaListRules["thumbnail"].extract = async (el: IElementHandler) =>
			await el.attr("src")
		this.mangaListRules["genres"].selector = "a.label.genre-label"
		this.mangaListRules["genres"].extract = async (el: IElementHandler) =>
			await el.text()
		this.mangaListRules["status"].selector = "div.media-body span"
		this.mangaListRules["status"].extract = async (el: IElementHandler) => {
			const text = await el.text()
			return text.match(/\(([^)]+)\)/)?.[1] || ""
		}
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

	protected nextPageHandler(url: string): string {
		const pageNumber = this.extractPageNumber(url)
		const nextPageNumber = pageNumber + 1
		return url.replace(/page\/\d+/, `page/${nextPageNumber}`)
	}

	protected getLatestMangasInitialQuery(): string {
		return this.constructQuery({ order: "LATEST", page: 1 })
	}

	// public async searchMangas(query: ParsedQs): Promise<Manga[]> {
	// 	const mangaList: Manga[] = []
	// 	let { limit } = query
	// 	if (!limit) {
	// 		limit = "50"
	// 	}
	// 	let queryString = this.constructQuery(query)

	// 	while (mangaList.length < Number(limit)) {
	// 		await this.webScraper.loadPage(queryString)
	// 		const result = await this.webScraper.scrape([this.rules["mangaList"]])
	// 		const mangas = result["mangaList"]
	// 		mangaList.push(...mangas)

	// 		this.webScraper.cleanup()
	// 		if (mangas.length === 0) break
	// 		queryString = this.nextPageHandler(queryString)
	// 	}

	// 	return mangaList.slice(0, Number(limit))
	// }

	public async getMangasByGenres(
		genres: string[],
		maxResults: number = 10
	): Promise<Manga[]> {
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
