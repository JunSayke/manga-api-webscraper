// Encapsulate the business logic and data fetching/manipulation
import BaseMangaService from "./baseMangaService"
import IManga from "../interfaces/iManga"
import IMangaChapter from "../interfaces/iMangaChapter"
import * as cheerio from "cheerio"
import { AnyNode } from "domhandler"
import MangaDto from "../dtos/mangaDto"

class MangakakalotService extends BaseMangaService {
	constructor() {
		super("https://mangakakalot.com")
		this.mangaContainerSelector = "div.list-truyen-item-wrap"
		this.mangaIdSelector = "a.list-story-item"
		this.mangaTitleSelector = this.mangaIdSelector
		this.mangaLinkSelector = this.mangaIdSelector
		this.mangaSynopsisSelector = "" // Truncated synopsis in the list page
		this.mangaThumbnailSelector = `${this.mangaIdSelector} > img`
		this.mangaGenresSelector = "" // No genres on the list page
		this.mangaStatusSelector = "" // No status on the list page
		this.mangaRatingSelector = "" // No rating on the list page
		this.mangaViewsSelector = "span.aye_icon" // No views on the list page
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

	// TODO: What's the best way to extract the manga ID from the URL? or does it even matter?
	// ex: https://mangakakalot.com/manga/ej934596 and https://chapmanganato.to/manga-ts953327
	private extractMangaId(url: string): string {
		const match = url.match(/manga-([a-zA-Z0-9]+)/)
		return match ? match[1] : ""
	}

	public async getLatestMangas(maxResults: number = 10): Promise<IManga[]> {
		const mangaList: IManga[] = []
		let page = 1

		let query = this.constructQuery("latest", "all", "all", page)

		while (mangaList.length < maxResults) {
			const response = await this.fetch<string>(query)
			const $ = cheerio.load(response)

			$(this.mangaContainerSelector).each((index, element) => {
				const htmlEl = $(element)
				const manga = new MangaDto()
				const href = htmlEl.find(this.mangaIdSelector).attr("href") || ""
				manga.id = this.extractMangaId(href)
				manga.title = htmlEl.find(this.mangaTitleSelector).attr("title") || ""
				manga.link = href
				manga.thumbnailUrl =
					htmlEl.find(this.mangaThumbnailSelector).attr("src") || ""
				manga.views =
					parseInt(
						htmlEl
							.find("span.aye_icon")
							.first()
							.text()
							.trim()
							.replace(/[^0-9]/g, "")
					) || null
				mangaList.push(manga)
			})

			if (mangaList.length >= maxResults) {
				break
			}

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
