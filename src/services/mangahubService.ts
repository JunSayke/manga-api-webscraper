// Encapsulate the business logic and data fetching/manipulation
import { ElementHandle } from "puppeteer"
import { ParsedQs } from "qs"
import PuppeteerWebscraper from "../utils/design_pattern/bridge/scraper/implementor/PuppeteerWebscraper"
import Manga from "../types/Manga"
import AbstractBaseMangaService from "./AbstractBaseMangaService"
import INodeElement from "../utils/design_pattern/adapter/INodeElement"
import IWebscraper from "../utils/design_pattern/bridge/scraper/IWebscraper"

class MangahubService extends AbstractBaseMangaService {
	constructor(
		url: string = "https://mangahub.io",
		webscraper: IWebscraper = new PuppeteerWebscraper()
	) {
		super(url, webscraper)

		this.initMangaListRules()
		this.initMangaDetailRules()
	}

	private initMangaListRules(): void {
		this.mlRulesConfig.container.selector = "div._1KYcM"
		this.mlRulesConfig.title.selector = "h4.media-heading > a[href*='/manga/']"
		this.mlRulesConfig.link.selector = "h4.media-heading > a[href*='/manga/']"
		this.mlRulesConfig.thumbnail.selector = "div.media-left > a > img"
		this.mlRulesConfig.genres.selector = "a.label.genre-label"
		this.mlRulesConfig.status.selector = "div.media-body span:has(a)"

		this.mlRulesConfig.title.extract = async (el: INodeElement) =>
			await el.text()
		this.mlRulesConfig.link.extract = async (el: INodeElement) =>
			await el.attr("href")
		this.mlRulesConfig.thumbnail.extract = async (el: INodeElement) =>
			await el.attr("src")
		this.mlRulesConfig.genres.extract = async (el: INodeElement) =>
			await el.text()
		this.mlRulesConfig.status.extract = async (el: INodeElement) => {
			const text = await el.text()
			return text.match(/\(([^)]+)\)/)?.[1] || ""
		}
	}

	private initMangaDetailRules(): void {}

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
		// https://mangahub.io/updates
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
