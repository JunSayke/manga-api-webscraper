// Encapsulate the business logic and data fetching/manipulation
import IElementHandler from "../design_pattern/adapter/IElementHandler"
import CheerioWebscraper from "../design_pattern/bridge/scraper/implementor/CheerioWebscraper"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import AbstractBaseMangaService from "./AbstractBaseMangaService"

class MangakakalotService extends AbstractBaseMangaService {
	constructor(
		url: string = "https://mangakakalot.com",
		webscraper: IWebscraper = new CheerioWebscraper()
	) {
		super(url, webscraper)

		this.mangaListRules["container"].selector = "div.list-truyen-item-wrap"
		this.mangaListRules["id"].selector = "a.list-story-item"
		this.mangaListRules["id"].extract = async (el: IElementHandler) =>
			this.extractMangaId((await el.attr("href")) ?? "")
		this.mangaListRules["title"].selector = "a.list-story-item"
		this.mangaListRules["title"].extract =
			async (el: IElementHandler) => async (el: IElementHandler) =>
				await el.attr("title")
		this.mangaListRules["link"].selector = "a.list-story-item"
		this.mangaListRules["link"].extract = async (el: IElementHandler) =>
			await el.attr("href")
		this.mangaListRules["thumbnail"].selector = "a.list-story-item > img"
		this.mangaListRules["thumbnail"].extract = async (el: IElementHandler) =>
			await el.attr("src")
		this.mangaListRules["views"].selector = "span.aye_icon"
		this.mangaListRules["views"].extract = async (el: IElementHandler) => {
			const text = await el.text()
			return parseInt(text.trim().replace(/[^0-9]/g, ""))
		}
	}

	private constructQuery(
		type = "latest",
		category = "all",
		state = "all",
		page: number = 1
	) {
		const query = `${this.baseUrl}/manga_list?type=${type}&category=${category}&state=${state}&page=${page}`
		return query
	}

	// TODO: What's the best way to extract the manga ID from the URL? or does it even matter?
	// https://mangahub.io/manga/tales-of-demons-and-gods
	private extractMangaId(url: string): string {
		const match = url.match(/manga\/([a-zA-Z0-9-]+)/)
		return match ? match[1] : ""
	}

	private extractPageNumber(url: string): number {
		const match = url.match(/page=(\d+)/)
		return match ? parseInt(match[1], 10) : 1
	}

	protected nextPageHandler(query: string): string {
		const pageNumber = this.extractPageNumber(query)
		const nextPageNumber = pageNumber + 1
		return query.replace(/page=\d+/, `page=${nextPageNumber}`)
	}

	protected getLatestMangasInitialQuery(): string {
		return this.constructQuery("latest", "all", "all", 1)
	}

	public getStatusFilters(): string[] {
		return ["all", "completed", "ongoing"]
	}

	// Genres are encoded as numbers in the query string instead of a label ex: action = 1
	public getGenreFilters(): string[] {
		throw new Error("Method not implemented.")
	}
}

export default MangakakalotService
