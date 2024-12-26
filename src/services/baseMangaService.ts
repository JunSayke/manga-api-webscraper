import axios from "axios"
import Manga from "../dtos/manga"
import MangaChapter from "../dtos/mangaChapter"
import IMangaService from "../interfaces/iMangaService"
import AdmZip from "adm-zip"

class BaseMangaService implements IMangaService {
	protected baseUrl: string

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
	protected async fetchData<T>(url: string): Promise<T> {
		const config = {
			headers: this.getRequestHeaders(),
		}
		const response = await axios.get<T>(url, config)
		return response.data
	}

	// Some resources may block requests due to unauthorized referer headers etc
	protected async downloadImagesAsZip(imageUrls: string[]): Promise<Buffer> {
		const zip = new AdmZip()
		const headers = this.getRequestHeaders()
		for (const imageUrl of imageUrls) {
			const response = await axios.get<Buffer>(imageUrl, {
				responseType: "arraybuffer",
				headers: headers,
			})
			const imageName = imageUrl.split("/").pop() || "image.jpg"
			zip.addFile(imageName, response.data)
		}
		return zip.toBuffer()
	}

	getKeywordFilters(): string[] {
		throw new Error("Method not implemented.")
	}
	getStatusFilters(): string[] {
		throw new Error("Method not implemented.")
	}
	getGenreFilters(): string[] {
		throw new Error("Method not implemented.")
	}
	getTotalMangaCount(): Promise<number> {
		throw new Error("Method not implemented.")
	}
	getMangasByTitle(title: string, maxResults?: number): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	getMangasByGenres(genres: string[], maxResults?: number): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	getMangasByStatus(status: string, maxResults?: number): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	getSimilarMangas(mangaId: string, maxResults?: number): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	getLatestMangas(maxResults?: number): Promise<Manga[]> {
		throw new Error("Method not implemented.")
	}
	getMangaInfo(mangaId: string): Promise<Manga> {
		throw new Error("Method not implemented.")
	}
	getMangaChapterImages(
		mangaId: string,
		chapterId: string
	): Promise<MangaChapter[]> {
		throw new Error("Method not implemented.")
	}
}

export default BaseMangaService
