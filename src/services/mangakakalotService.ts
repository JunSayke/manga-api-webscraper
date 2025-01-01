// Encapsulate the business logic and data fetching/manipulation
import CheerioWebscraper from "../design_pattern/bridge/scraper/implementor/CheerioWebscraper"
import MangaDto from "../dtos/mangaDto"
import IManga from "../interfaces/IManga"
import CheerioExtractionRule from "../utils/CheerioExtractionRule"
import BaseMangaService from "./baseMangaService"

class MangakakalotService extends BaseMangaService {
	constructor() {
		super("https://mangakakalot.com", new CheerioWebscraper())

		this.rules["mangaList"] = new CheerioExtractionRule(
			"mangaList",
			"div.list-truyen-item-wrap",
			(el) => {
				const idRule = this.rules["mangaListId"]
				const titleRule = this.rules["mangaListTitle"]
				const linkRule = this.rules["mangaListLink"]
				const thumbnailRule = this.rules["mangaListThumbnail"]
				const viewsRule = this.rules["mangaListViews"]

				const manga = new MangaDto()
				manga.id = idRule.extract(el.find(idRule.selector))
				manga.title = titleRule.extract(el.find(titleRule.selector))
				manga.link = linkRule.extract(el.find(linkRule.selector))
				manga.thumbnailUrl = thumbnailRule.extract(
					el.find(thumbnailRule.selector)
				)
				manga.views = viewsRule.extract(el.find(viewsRule.selector))
				return manga
			}
		)

		this.rules["mangaListId"] = new CheerioExtractionRule(
			"id",
			"a.list-story-item",
			(el) => el.attr("href")
		)
		this.rules["mangaListTitle"] = new CheerioExtractionRule(
			"title",
			"a.list-story-item",
			(el) => el.attr("title")
		)
		this.rules["mangaListLink"] = new CheerioExtractionRule(
			"link",
			"a.list-story-item",
			(el) => el.attr("href")
		)
		this.rules["mangaListThumbnail"] = new CheerioExtractionRule(
			"thumbnailUrl",
			"a.list-story-item > img",
			(el) => el.attr("src")
		)
		this.rules["mangaListViews"] = new CheerioExtractionRule(
			"views",
			"span.aye_icon",
			(el) =>
				parseInt(
					el
						.text()
						.trim()
						.replace(/[^0-9]/g, "")
				)
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
			const result = await this.webScraper.scrape(query, [
				this.rules["mangaList"],
			])
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
