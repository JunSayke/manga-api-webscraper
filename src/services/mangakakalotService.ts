// Encapsulate the business logic and data fetching/manipulation
import INodeElement from "../utils/design_pattern/adapter/INodeElement"
import CheerioWebscraper from "../utils/design_pattern/bridge/scraper/implementor/CheerioWebscraper"
import PuppeteerWebscraper from "../utils/design_pattern/bridge/scraper/implementor/PuppeteerWebscraper"
import IWebscraper from "../utils/design_pattern/bridge/scraper/IWebscraper"
import AbstractBaseMangaService from "./AbstractBaseMangaService"

class MangakakalotService extends AbstractBaseMangaService {
	constructor(
		url: string = "https://mangakakalot.com",
		webscraper: IWebscraper = new PuppeteerWebscraper()
	) {
		super(url, webscraper)
		this.initMangaListRules()
		this.initMangaDetailRules()
	}

	private initMangaListRules(): void {
		this.mlRulesConfig.container.selector = "div.list-truyen-item-wrap"
		this.mlRulesConfig.link.selector = "a.list-story-item"
		this.mlRulesConfig.title.selector = "a.list-story-item"
		this.mlRulesConfig.thumbnail.selector = "a.list-story-item > img"
		this.mlRulesConfig.views.selector = "span.aye_icon"

		// manga list (ml) extractors
		this.mlRulesConfig.link.extract = async (el: INodeElement) =>
			await el.attr("href")
		this.mlRulesConfig.title.extract = async (el: INodeElement) =>
			await el.attr("title")
		this.mlRulesConfig.thumbnail.extract = async (el: INodeElement) =>
			await el.attr("src")
		this.mlRulesConfig.views.extract = async (el: INodeElement) =>
			parseInt((await el.text()).trim().replace(/[^0-9]/g, ""))
	}

	private initMangaDetailRules(): void {
		this.mdRulesConfig.link.selector = "a[itemprop='item'][href*='/manga/']"
		this.mdRulesConfig.title.selector = "ul.manga-info-text > li > h1"
		this.mdRulesConfig.synopsis.selector = "div#noidungm"
		this.mdRulesConfig.thumbnail.selector = "div.manga-info-pic > img"
		this.mdRulesConfig.genres.selector =
			"ul.manga-info-text > li:nth-child(7) > a"
		this.mdRulesConfig.status.selector = "ul.manga-info-text > li:nth-child(3)"
		this.mdRulesConfig.rating.selector = "em#rate_row_cmd"
		this.mdRulesConfig.views.selector = "ul.manga-info-text > li:nth-child(6)"
		this.mdRulesConfig.chapters.selector = "div.chapter-list > div.row"

		// manga detail (md) extractors
		this.mdRulesConfig.link.extract = async (el: INodeElement) =>
			await el.attr("href")
		this.mdRulesConfig.title.extract = async (el: INodeElement) =>
			await el.text()
		this.mdRulesConfig.synopsis.extract = async (el: INodeElement) =>
			await el.text()
		this.mdRulesConfig.thumbnail.extract = async (el: INodeElement) =>
			await el.attr("src")
		this.mdRulesConfig.genres.extract = async (el: INodeElement) => {
			const text = await el.text()
			return text.toLowerCase()
		}
		this.mdRulesConfig.status.extract = async (el: INodeElement) => {
			const text = await el.text()
			return text.match(/Status\s*:\s*(.*)/)?.[1].toLowerCase() || null
		}
		this.mdRulesConfig.rating.extract = async (el: INodeElement) => {
			const text = await el.text()
			const match = text.match(/rate\s*:\s*([\d.]+)/)
			return match ? parseFloat(match[1]) : null
		}
		this.mdRulesConfig.views.extract = async (el: INodeElement) => {
			const text = await el.text()
			const match = text.match(/View\s*:\s*([\d,]+)/)
			return match ? parseInt(match[1].replace(/,/g, "")) : null
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
