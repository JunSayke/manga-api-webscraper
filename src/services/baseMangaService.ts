import axios from "axios"
import IManga from "../interfaces/iManga"
import IMangaChapter from "../interfaces/iMangaChapter"
import IMangaService from "../interfaces/iMangaService"
import AdmZip from "adm-zip"
import RotateUserAgentMixin from "../mixins/RotateUserAgentMixin"
import applyMixins from "../mixins/applyMixins"
import SimpleWebscraperMixin from "../mixins/SimpleWebscraperMixin"

abstract class BaseMixin {
	constructor() {}
}

interface BaseMixin extends RotateUserAgentMixin, SimpleWebscraperMixin {}
applyMixins(BaseMixin, [RotateUserAgentMixin, SimpleWebscraperMixin])

class BaseMangaService extends BaseMixin implements IMangaService {
	protected baseUrl: string

	constructor(baseUrl: string) {
		super()
		this.baseUrl = baseUrl
		console.log("BaseMangaService Constructor")
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
