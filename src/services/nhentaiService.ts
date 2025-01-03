// Encapsulate the business logic and data fetching/manipulation
import INodeElement from "../design_pattern/adapter/INodeElement"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import PuppeteerWebscraper from "../design_pattern/bridge/scraper/implementor/PuppeteerWebscraper"
import AbstractBaseMangaService from "./AbstractBaseMangaService"

class NHentaiService extends AbstractBaseMangaService {
	constructor(
		url: string = "https://nhentai.net",
		webscraper: IWebscraper = new PuppeteerWebscraper()
	) {
		super(url, webscraper)
		this.mangaListRules["container"].selector =
			".container.index-container:not(.index-popular) > div.gallery"
		this.mangaListRules["title"].selector = `div.gallery > a > div.caption`
		this.mangaListRules["title"].extract = async (el: INodeElement) =>
			await el.text()
		this.mangaListRules["link"].selector = `a[href*="/g/"]`
		this.mangaListRules["link"].extract = async (el: INodeElement) => {
			const href = await el.attr("href")
			return this.baseUrl + href
		}
		this.mangaListRules["thumbnail"].selector = `div.gallery > a > img`
		this.mangaListRules["thumbnail"].extract = async (el: INodeElement) =>
			await el.attr("src")
	}

	private searchQuery(
		searchQuery: string,
		sort: string = "all-time" // sort by popularity: default to all-time
	) {
		const query = `${this.baseUrl}/search/?q=${searchQuery}&sort=${sort}`
		return query
	}

	// https://nhentai.net/?page=2
	private latestQuery(page: number) {
		const query = `${this.baseUrl}/?page=${page}`
		return query
	}

	private extractPageNumber(url: string): number {
		const match = url.match(/page\/(\d+)/)
		return match ? parseInt(match[1], 10) : 1
	}

	protected nextPageHandler(url: string): string {
		const pageNumber = this.extractPageNumber(url)
		const nextPageNumber = pageNumber + 1
		return url.replace(/page=\d+/, `page=${nextPageNumber}`)
	}

	protected getLatestMangasInitialQuery(): string {
		return this.latestQuery(1)
	}

	// TODO: What's the best way to extract the manga ID from the URL? or does it even matter?
	// https://mangahub.io/manga/tales-of-demons-and-gods
	private extractMangaId(url: string): string {
		const match = url.match(/manga\/([a-zA-Z0-9-]+)/)
		return match ? match[1] : ""
	}

	public getStatusFilters(): string[] {
		return ["all", "completed", "ongoing"]
	}

	// Genres are encoded as numbers in the query string instead of a label ex: action = 1
	public getGenreFilters(): string[] {
		throw new Error("Method not implemented.")
	}
}

export default NHentaiService
