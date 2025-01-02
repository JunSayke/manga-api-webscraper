// Encapsulate the business logic and data fetching/manipulation
import { Cheerio } from "cheerio"
import CheerioWebscraper from "../design_pattern/bridge/scraper/implementor/CheerioWebscraper"
import MangaDto from "../dtos/mangaDto"
import IManga from "../interfaces/IManga"
import BaseMangaService from "./baseMangaService"
import { AnyNode } from "domhandler"
import IElementHandler from "../design_pattern/adapter/IElementHandler"

class MangakakalotService extends BaseMangaService {
	constructor(
		url: string = "https://mangakakalot.com",
		webscraper: CheerioWebscraper = new CheerioWebscraper()
	) {
		super(url, webscraper)

		this.rules["mangaList"] = this.webScraper.createExtractionRule(
			"mangaList",
			"div.list-truyen-item-wrap",
			async (el: IElementHandler) => {
				const idRule = this.rules["mangaListId"]
				const titleRule = this.rules["mangaListTitle"]
				const linkRule = this.rules["mangaListLink"]
				const thumbnailRule = this.rules["mangaListThumbnail"]
				const viewsRule = this.rules["mangaListViews"]

				const manga = new MangaDto()
				manga.id = await idRule.extract(await el.find(idRule.selector))
				manga.title = await titleRule.extract(await el.find(titleRule.selector))
				manga.link = await linkRule.extract(await el.find(linkRule.selector))
				manga.thumbnailUrl = await thumbnailRule.extract(
					await el.find(thumbnailRule.selector)
				)
				manga.views = await viewsRule.extract(await el.find(viewsRule.selector))
				return manga
			}
		)

		this.rules["mangaListId"] = this.webScraper.createExtractionRule(
			"id",
			"a.list-story-item",
			async (el: IElementHandler) =>
				this.extractMangaId((await el.attr("href")) ?? "")
		)
		this.rules["mangaListTitle"] = this.webScraper.createExtractionRule(
			"title",
			"a.list-story-item",
			async (el: IElementHandler) => await el.attr("title")
		)
		this.rules["mangaListLink"] = this.webScraper.createExtractionRule(
			"link",
			"a.list-story-item",
			async (el: IElementHandler) => await el.attr("href")
		)
		this.rules["mangaListThumbnail"] = this.webScraper.createExtractionRule(
			"thumbnailUrl",
			"a.list-story-item > img",
			async (el: IElementHandler) => await el.attr("src")
		)
		this.rules["mangaListViews"] = this.webScraper.createExtractionRule(
			"views",
			"span.aye_icon",
			async (el: IElementHandler) => {
				const text = await el.text()
				return parseInt(text.trim().replace(/[^0-9]/g, ""))
			}
		)
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

	private nextPageHandler(url: string): string {
		const pageNumber = this.extractPageNumber(url)
		const nextPageNumber = pageNumber + 1
		return url.replace(/page=\d+/, `page=${nextPageNumber}`)
	}

	public async getLatestMangas(maxResults: number = 10): Promise<IManga[]> {
		const mangaList: IManga[] = []
		let page = 1

		let query = this.constructQuery("latest", "all", "all", page)

		while (mangaList.length < maxResults) {
			await this.webScraper.loadPage(query)
			const result = await this.webScraper.scrape([this.rules["mangaList"]])
			const mangas = result["mangaList"]
			mangaList.push(...mangas)

			if (mangas.length === 0) break
			page++
			query = this.nextPageHandler(query)
		}

		return mangaList.slice(0, maxResults)
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
