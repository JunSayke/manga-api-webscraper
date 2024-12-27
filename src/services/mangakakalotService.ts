// Encapsulate the business logic and data fetching/manipulation
import BaseMangaService from "./baseMangaService"
import Manga from "../dtos/manga"
import MangaChapter from "../dtos/mangaChapter"

class MangakakalotService extends BaseMangaService {
	constructor() {
		super("https://mangakakalot.com")
	}

	public getLatestMangas(maxResults?: number): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}

	constructQuery(
		type: string = "latest",
		category: string = "all",
		state: string = "all",
		page: number = 1
	): string {
		const query = `${this.baseUrl}/manga_list?type=${type}&category=${category}&state=${state}&page=${page}`
		return query
	}
}

export default MangakakalotService
