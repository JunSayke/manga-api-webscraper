import IExtractionRule from "../design_pattern/bridge/scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import IManga from "../interfaces/IManga"
import IMangaChapter from "../interfaces/IMangaChapter"
import IMangaService from "../interfaces/IMangaService"

class BaseMangaService implements IMangaService {
	protected baseUrl: string
	protected webScraper: IWebscraper
	protected rules: Record<string, IExtractionRule>

	constructor(baseUrl: string, webScraper: IWebscraper) {
		this.baseUrl = baseUrl
		this.webScraper = webScraper
		this.rules = {}
		console.log("BaseMangaService Constructor")
	}

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
	): Promise<IManga[]> {
		throw new Error("Method not implemented.")
	}
	public async getMangasByGenres(
		genres: string[],
		maxResults?: number
	): Promise<IManga[]> {
		throw new Error("Method not implemented.")
	}
	public async getMangasByStatus(
		status: string,
		maxResults?: number
	): Promise<IManga[]> {
		throw new Error("Method not implemented.")
	}
	// Maybe utilize https://www.anime-planet.com/ recommendations system?
	public async getSimilarMangas(
		mangaId: string,
		maxResults?: number
	): Promise<IManga[]> {
		throw new Error("Method not implemented.")
	}
	public async getLatestMangas(maxResults?: number): Promise<IManga[]> {
		throw new Error("Method not implemented.")
	}
	public async getMangaInfo(mangaId: string): Promise<IManga> {
		throw new Error("Method not implemented.")
	}
	public async getMangaChapterImages(
		mangaId: string,
		chapterId: string
	): Promise<IMangaChapter[]> {
		throw new Error("Method not implemented.")
	}
}

export default BaseMangaService
