// Encapsulate the business logic and data fetching/manipulation
import INodeElement from "../design_pattern/adapter/INodeElement"
import CheerioWebscraper from "../design_pattern/bridge/scraper/implementor/CheerioWebscraper"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import AbstractBaseMangaService from "./AbstractBaseMangaService"

class MangakakalotService extends AbstractBaseMangaService {
	constructor(
		url: string = "https://mangakakalot.com",
		webscraper: IWebscraper = new CheerioWebscraper()
	) {
		super(url, webscraper)
		this.initMangaListRules()
		this.initMangaDetailRules()
	}

	private initMangaListRules(): void {
		// manga list (ml) rules
		const container = this.mangaListRules["container"]
		const link = this.mangaListRules["link"]
		const title = this.mangaListRules["title"]
		const thumbnail = this.mangaListRules["thumbnail"]
		const views = this.mangaListRules["views"]

		container.selector = "div.list-truyen-item-wrap"
		link.selector = "a.list-story-item"
		title.selector = "a.list-story-item"
		thumbnail.selector = "a.list-story-item > img"
		views.selector = "span.aye_icon"

		// manga list (ml) extractors
		container.extract = async (el: INodeElement) =>
			await el.findAll("div.list-truyen-item-wrap")
		link.extract = async (el: INodeElement) => await el.attr("href")
		title.extract = async (el: INodeElement) => await el.attr("title")
		thumbnail.extract = async (el: INodeElement) => await el.attr("src")
		views.extract = async (el: INodeElement) =>
			parseInt((await el.text()).trim().replace(/[^0-9]/g, ""))
	}

	private initMangaDetailRules(): void {
		// manga detail (md) rules
		const link = this.mangaDetailRules["link"]
		const title = this.mangaDetailRules["title"]
		const synopsis = this.mangaDetailRules["synopsis"]
		const thumbnail = this.mangaDetailRules["thumbnail"]
		const genres = this.mangaDetailRules["genres"]
		const status = this.mangaDetailRules["status"]
		const rating = this.mangaDetailRules["rating"]
		const views = this.mangaDetailRules["views"]
		const chapters = this.mangaDetailRules["chapters"]

		// manga detail (md) selectors
		link.selector = "a[itemprop='item'][href*='/manga/']"
		title.selector = "ul.manga-info-text > li > h1"
		synopsis.selector = "div#noidungm"
		thumbnail.selector = "div.manga-info-pic > img"
		genres.selector = "ul.manga-info-text > li:nth-child(7) > a"
		status.selector = "ul.manga-info-text > li:nth-child(3)"
		rating.selector = "em#rate_row_cmd"
		views.selector = "ul.manga-info-text > li:nth-child(6)"
		chapters.selector = "div.chapter-list > div.row"

		// manga detail (md) extractors
		link.extract = async (el: INodeElement) => await el.attr("href")
		title.extract = async (el: INodeElement) => await el.text()
		synopsis.extract = async (el: INodeElement) => await el.text()
		thumbnail.extract = async (el: INodeElement) => await el.attr("src")
		genres.extract = async (el: INodeElement) => {
			const text = await el.text()
			return text.toLowerCase()
		}
		status.extract = async (el: INodeElement) => {
			const text = await el.text()
			return text.match(/Status\s*:\s*(.*)/)?.[1].toLowerCase() || null
		}
		rating.extract = async (el: INodeElement) => {
			const text = await el.text()
			const match = text.match(/rate\s*:\s*([\d.]+)/)
			return match ? parseFloat(match[1]) : null
		}
		views.extract = async (el: INodeElement) => {
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
