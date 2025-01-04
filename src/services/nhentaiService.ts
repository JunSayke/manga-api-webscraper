// Encapsulate the business logic and data fetching/manipulation
import INodeElement from "../utils/adapter/INodeElement"
import PuppeteerWebscraper from "../utils/scraper/implementor/PuppeteerWebscraper"
import IWebscraper from "../utils/scraper/IWebscraper"
import AbstractMangaService from "./AbstractMangaService"

class NHentaiService extends AbstractMangaService {
	constructor(
		url: string = "https://nhentai.net",
		webscraper: IWebscraper = new PuppeteerWebscraper()
	) {
		super(url, webscraper)
		this.initMangaListRules()
	}

	private initMangaListRules() {
		this.mlRulesConfig.container.selector =
			".container.index-container:not(.index-popular) > div.gallery"
		this.mlRulesConfig.title.selector = `div.gallery > a > div.caption`
		this.mlRulesConfig.link.selector = `a[href*="/g/"]`
		// How to get the thumbnail out of this data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?
		this.mlRulesConfig.thumbnail.selector = `div.gallery > a > img`

		this.mlRulesConfig.title.extract = async (el: INodeElement) =>
			await el.text()
		this.mlRulesConfig.link.extract = async (el: INodeElement) => {
			const href = await el.attr("href")
			return this.baseUrl + href
		}
		this.mlRulesConfig.thumbnail.extract = async (el: INodeElement) =>
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
