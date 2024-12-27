import axios from "axios"
import cheerio, { CheerioAPI } from "cheerio"
import Manga from "../dtos/manga"
import MangaChapter from "../dtos/mangaChapter"
import IMangaService from "../interfaces/iMangaService"
import AdmZip from "adm-zip"
import ISelectorHandler from "../interfaces/iSelectorHandler"

class BaseMangaService implements IMangaService {
	protected baseUrl: string

	// These selectors are used to scrape the website
	// Manga list page selectors
	protected mangasContainerSelector: string = ""
	protected mangaContainerSelector: string = ""

	// Manga info page selectors
	protected mangaIdSelector: string = ""
	protected mangaTitleSelector: string = ""
	protected mangaLinkSelector: string = ""
	protected mangaSynopsisSelector: string = ""
	protected mangaThumbnailSelector: string = ""
	protected mangaGenresSelector: string = ""
	protected mangaStatusSelector: string = ""
	protected mangaRatingSelector: string = ""
	protected mangaViewsSelector: string = ""

	// Chapter list page selectors
	protected chaptersContainerSelector: string = ""
	protected chapterContainerSelector: string = ""

	// Manga chapter page selectors
	protected mangaChapterIdSelector: string = ""
	protected mangaChapterTitleSelector: string = ""
	protected mangaChapterLinkSelector: string = ""
	protected mangaChapterDateSelector: string = ""

	// Manga chapter images page selectors
	protected mangaChapterImagesContainerSelector: string = ""
	protected mangaChapterImagesSelector: string = ""

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	// Override this method to provide custom headers
	protected getRequestHeaders(): Record<string, string> {
		return {
			Referer: this.baseUrl,
		}
	}

	// Utilize this method for making GET requests as it uses the headers returned by getRequestHeaders
	protected async fetchData<T>(
		url: string,
		config?: Record<string, any>
	): Promise<T> {
		const defaultConfig = {
			headers: this.getRequestHeaders(),
		}
		const finalConfig = { ...defaultConfig, ...config }
		const response = await axios.get<T>(url, finalConfig)
		return response.data
	}

	// Some resources may block requests due to unauthorized referer headers etc
	protected async downloadImagesAsZip(imageUrls: string[]): Promise<Buffer> {
		const zip = new AdmZip()
		for (const imageUrl of imageUrls) {
			const response = await this.fetchData<Buffer>(imageUrl, {
				responseType: "arraybuffer",
			})
			const imageName = imageUrl.split("/").pop() || "image.jpg"
			zip.addFile(imageName, response)
		}
		return zip.toBuffer()
	}

	// Utilize this method for web scraping as it uses cheerio to parse the HTML
	protected async webScrape(
		url: string,
		selectors: Record<string, ISelectorHandler>
	): Promise<void> {
		const response = await this.fetchData<string>(url)
		const $: CheerioAPI = cheerio.load(response)

		for (const { selector, handler } of Object.values(selectors)) {
			const element = $(selector)
			handler(element)
		}
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
	public getTotalMangaCount(): Promise<number> {
		throw new Error("Method not implemented.")
	}
	public getMangasByTitle(
		title: string,
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	public getMangasByGenres(
		genres: string[],
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	public getMangasByStatus(
		status: string,
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	// Maybe utilize https://www.anime-planet.com/ recommendations system?
	public getSimilarMangas(
		mangaId: string,
		maxResults?: number
	): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	public getLatestMangas(maxResults?: number): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	public getMangaInfo(mangaId: string): Promise<Manga> {
		throw new Error("Method not implemented.")
	}
	public getMangaChapterImages(
		mangaId: string,
		chapterId: string
	): Promise<MangaChapter[]> {
		throw new Error("Method not implemented.")
	}
}

export default BaseMangaService
