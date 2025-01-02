import IElementHandler from "../design_pattern/adapter/IElementHandler"
import IExtractionRule from "../design_pattern/bridge/scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import IMangaService from "../interfaces/IMangaService"
import Manga from "../types/Manga"
import MangaChapter from "../types/MangaChapter"

abstract class AbstractBaseMangaService implements IMangaService {
	protected baseUrl: string
	protected webScraper: IWebscraper
	protected mangaListRules: Record<string, IExtractionRule>

	constructor(baseUrl: string, webScraper: IWebscraper) {
		this.baseUrl = baseUrl
		this.webScraper = webScraper

		// Manga list rules
		this.mangaListRules = {
			container: this.webScraper.createExtractionRule(
				"container",
				"",
				async (el: IElementHandler) => {
					const idRule = this.mangaListRules["id"]
					const titleRule = this.mangaListRules["title"]
					const linkRule = this.mangaListRules["link"]
					const synopsisRule = this.mangaListRules["synopsis"]
					const thumbnailRule = this.mangaListRules["thumbnail"]
					const genresRule = this.mangaListRules["genres"]
					const statusRule = this.mangaListRules["status"]
					const ratingRule = this.mangaListRules["rating"]
					const viewsRule = this.mangaListRules["views"]
					const chaptersRule = this.mangaListRules["chapters"]

					const manga: Manga = this.createManga({
						id: await idRule.extract(await el.find(idRule.selector)),
						title: await titleRule.extract(await el.find(titleRule.selector)),
						link: await linkRule.extract(await el.find(linkRule.selector)),
						synopsis: await synopsisRule.extract(
							await el.find(synopsisRule.selector)
						),
						thumbnailUrl: await thumbnailRule.extract(
							await el.find(thumbnailRule.selector)
						),
						genres: await Promise.all(
							(
								await el.findAll(genresRule.selector)
							).map(async (genreEl) => await genresRule.extract(genreEl))
						),
						status: await statusRule.extract(
							await el.find(statusRule.selector)
						),
						rating: await ratingRule.extract(
							await el.find(ratingRule.selector)
						),
						views: await viewsRule.extract(await el.find(viewsRule.selector)),
						chapters: await chaptersRule.extract(
							await el.find(chaptersRule.selector)
						),
					})

					return manga
				}
			),
			id: this.webScraper.createExtractionRule(
				"id",
				"",
				async (el: IElementHandler) => {
					throw new Error("MangaListId rule not implemented.")
				}
			),
			title: this.webScraper.createExtractionRule(
				"title",
				"",
				async (el: IElementHandler) => {
					throw new Error("MangaListTitle rule not implemented.")
				}
			),
			link: this.webScraper.createExtractionRule(
				"link",
				"",
				async (el: IElementHandler) => {
					throw new Error("MangaListLink rule not implemented.")
				}
			),
			synopsis: this.webScraper.createExtractionRule(
				"synopsis",
				"",
				async (el: IElementHandler) => null
			),
			thumbnail: this.webScraper.createExtractionRule(
				"thumbnailUrl",
				"",
				async (el: IElementHandler) => {
					throw new Error("MangaListThumbnail rule not implemented.")
				}
			),
			genres: this.webScraper.createExtractionRule(
				"genres",
				"",
				async (el: IElementHandler) => null
			),
			status: this.webScraper.createExtractionRule(
				"status",
				"",
				async (el: IElementHandler) => null
			),
			rating: this.webScraper.createExtractionRule(
				"rating",
				"",
				async (el: IElementHandler) => null
			),
			views: this.webScraper.createExtractionRule(
				"views",
				"",
				async (el: IElementHandler) => null
			),
			chapters: this.webScraper.createExtractionRule(
				"chapters",
				"",
				async (el: IElementHandler) => null
			),
		}
	}

	protected createManga(params: {
		id: string
		title: string
		link: string
		synopsis?: string
		thumbnailUrl: string
		genres?: string[]
		status?: string
		rating?: number
		views?: number
		chapters?: MangaChapter[]
	}): Manga {
		return {
			id: params.id,
			title: params.title,
			link: params.link,
			thumbnailUrl: params.thumbnailUrl,
			synopsis: params.synopsis ?? null,
			genres: params.genres ?? null,
			status: params.status ?? null,
			rating: params.rating ?? null,
			views: params.views ?? null,
			chapters: params.chapters ?? null,
		}
	}

	protected abstract nextPageHandler(query: string): string

	protected abstract getLatestMangasInitialQuery(): string

	public getKeywordFilters(): string[] {
		throw new Error("Method not implemented.")
	}
	public getStatusFilters(): string[] {
		throw new Error("Method not implemented.")
	}
	public getGenreFilters(): string[] {
		throw new Error("Method not implemented.")
	}
	public async getTotalMangaCount(): Promise<number> {
		throw new Error("Method not implemented.")
	}
	public async getMangasByTitle(
		title: string,
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	public async getMangasByGenres(
		genres: string[],
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	public async getMangasByStatus(
		status: string,
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	// Maybe utilize https://www.anime-planet.com/ recommendations system?
	public async getSimilarMangas(
		mangaId: string,
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	public async getLatestMangas(maxResults: number = 10): Promise<Manga[]> {
		const mangaList: Manga[] = []

		let query = this.getLatestMangasInitialQuery()

		while (mangaList.length < maxResults) {
			await this.webScraper.loadPage(query)
			const result = await this.webScraper.scrape([
				this.mangaListRules["container"],
			])
			const mangas = result["container"]
			mangaList.push(...mangas)

			// Stop if no more manga is found including page not found
			if (mangas.length === 0) break
			query = this.nextPageHandler(query)
			this.webScraper.cleanup()
		}

		return mangaList.slice(0, maxResults)
	}
	public async getMangaInfo(mangaId: string): Promise<Manga> {
		throw new Error("Method not implemented.")
	}
	public async getMangaChapterImages(
		mangaId: string,
		chapterId: string
	): Promise<MangaChapter[]> {
		throw new Error("Method not implemented.")
	}
}

export default AbstractBaseMangaService
