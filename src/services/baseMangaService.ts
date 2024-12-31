import axios from "axios"
import IManga from "../interfaces/iManga"
import IMangaChapter from "../interfaces/iMangaChapter"
import IMangaService from "../interfaces/iMangaService"
import AdmZip from "adm-zip"
import RotateUserAgentMixin from "../mixins/RotateUserAgentMixin"
import applyMixins from "../mixins/applyMixins"

abstract class BaseMixin {}

interface BaseMixin extends RotateUserAgentMixin {}
applyMixins(BaseMixin, [RotateUserAgentMixin])

class BaseMangaService extends BaseMixin implements IMangaService {
	protected baseUrl: string

	// These selectors are used to scrape the website
	// Altho the urls must be provided by the implementation
	// Manga list page selectors
	protected mangaContainerSelector: string = "" // Most likely a <li> tag

	// Manga info page selectors
	protected mangaIdSelector: string = "" // Most likely a part of the URL or <a> tag link
	protected mangaTitleSelector: string = ""
	protected mangaLinkSelector: string = ""
	protected mangaSynopsisSelector: string = "" // Some websites may have a separate page for the synopsis
	protected mangaThumbnailSelector: string = ""
	protected mangaGenresSelector: string = ""
	protected mangaStatusSelector: string = ""
	protected mangaRatingSelector: string = ""
	protected mangaViewsSelector: string = ""

	// Chapter list page selectors
	protected chapterContainerSelector: string = "" // Most likely a <li> tag

	// Manga chapter page selectors
	protected mangaChapterIdSelector: string = "" // Most likely a part of the URL or <a> tag link
	protected mangaChapterTitleSelector: string = ""
	protected mangaChapterLinkSelector: string = ""
	protected mangaChapterDateSelector: string = ""
	protected mangaChapterImagesSelector: string = "" // Most likely an <img> tag

	constructor(baseUrl: string) {
		super()
		this.baseUrl = baseUrl
		this.requestHeaders["Referer"] = baseUrl
	}

	// Utilize this method for making GET requests as it uses the headers returned by getRequestHeaders
	protected async fetch<T>(
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
			const response = await this.fetch<Buffer>(imageUrl, {
				responseType: "arraybuffer",
			})
			const imageName = imageUrl.split("/").pop() || "image.jpg"
			zip.addFile(imageName, response)
		}
		return zip.toBuffer()
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
