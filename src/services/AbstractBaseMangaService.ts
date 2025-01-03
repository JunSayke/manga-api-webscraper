import IMangaService from "../interfaces/IMangaService"
import Manga from "../types/Manga"
import MangaChapter from "../types/MangaChapter"
import IWebscraper from "../utils/design_pattern/bridge/scraper/IWebscraper"
import BaseMangaDetailRulesConfig from "../utils/rules_config/BaseMangaDetailRulesConfig"
import BaseMangaListRulesConfig from "../utils/rules_config/BaseMangaListRulesConfig"

abstract class AbstractBaseMangaService implements IMangaService {
	protected baseUrl: string
	protected webscraper: IWebscraper

	// (ml) Manga List
	protected mlRulesConfig: BaseMangaListRulesConfig

	// (md) Manga Detail
	protected mdRulesConfig: BaseMangaDetailRulesConfig

	// protected mangaDetailRules: Record<string, IExtractionRule>

	constructor(baseUrl: string, webScraper: IWebscraper) {
		this.baseUrl = baseUrl
		this.webscraper = webScraper
		this.mlRulesConfig = new BaseMangaListRulesConfig(this.webscraper)
		this.mdRulesConfig = new BaseMangaDetailRulesConfig(this.webscraper)
	}

	/**
	 * Override this method to initialize the extraction rules for the manga list.
	 * Handles the pagination for the next page of manga results.
	 * @param query - The current query string.
	 * @returns The query string for the next page.
	 */
	protected abstract nextPageHandler(query: string): string

	/**
	 * Override this method to initialize the extraction rules for the manga list.
	 * Retrieves the initial query string for fetching the latest mangas.
	 * @returns The initial query string.
	 */
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
			const mangas: Manga[] = await this.mlRulesConfig.execute(query)
			mangaList.push(...mangas)

			// Stop if no more manga is found probably including page not found
			if (mangas.length === 0) break
			query = this.nextPageHandler(query)
		}

		return mangaList.slice(0, maxResults)
	}

	public async getMangaInfo(mangaLink: string): Promise<Manga> {
		const manga = await this.mdRulesConfig.execute(mangaLink)
		return manga
	}

	public async getMangaChapterImages(
		chapterLink: string
	): Promise<MangaChapter[]> {
		throw new Error("Method not implemented.")
	}
}

export default AbstractBaseMangaService
