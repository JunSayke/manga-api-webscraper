import IElementHandler from "../design_pattern/adapter/IElementHandler"
import IExtractionRule from "../design_pattern/bridge/scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import IMangaService from "../interfaces/IMangaService"
import crypto from "crypto"
import Manga from "../types/Manga"
import MangaChapter from "../types/MangaChapter"
import dotenv from "dotenv"
dotenv.config()

abstract class AbstractBaseMangaService implements IMangaService {
	protected baseUrl: string
	protected webScraper: IWebscraper
	private transformKey: string = process.env.TRANSFORM_KEY!
	private transformIV: string = process.env.TRANSFORM_IV!

	/**
	 * A record of extraction rules for various manga attributes.
	 * Each key represents an attribute of the manga, and the value is an extraction rule
	 * that defines how to extract that attribute from the HTML.
	 */
	protected mangaListRules: Record<string, IExtractionRule>

	protected mangaDetailRules: Record<string, IExtractionRule>

	constructor(baseUrl: string, webScraper: IWebscraper) {
		this.baseUrl = baseUrl
		this.webScraper = webScraper
		// Manga list rules
		this.mangaListRules = {
			container: this.webScraper.createExtractionRule(
				"container",
				"",
				async (el: IElementHandler) => {
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
						id: this.tranformLinkToId(
							await linkRule.extract(await el.find(linkRule.selector))
						),
						title: await titleRule.extract(await el.find(titleRule.selector)),
						synopsis: await synopsisRule.extract(
							await el.find(synopsisRule.selector)
						),
						thumbnailUrl: await thumbnailRule.extract(
							await el.find(thumbnailRule.selector)
						),
						genres: genresRule.selector
							? await Promise.all(
									(
										await el.findAll(genresRule.selector)
									).map(async (genreEl) => await genresRule.extract(genreEl))
							  )
							: undefined,
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

		// Manga detail rules
		this.mangaDetailRules = {
			title: this.webScraper.createExtractionRule(
				"title",
				"",
				async (el: IElementHandler) => {
					throw new Error("MangaDetailTitle rule not implemented.")
				}
			),
			link: this.webScraper.createExtractionRule(
				"link",
				"",
				async (el: IElementHandler) => {
					throw new Error("MangaDetailLink rule not implemented.")
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
					throw new Error("MangaDetailThumbnail rule not implemented.")
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

	/**
	 * Encrypts a given link to an ID using AES-256-CBC encryption.
	 *
	 * @param {string} link - The link to be encrypted.
	 * @returns {string} - The encrypted ID.
	 */
	protected tranformLinkToId(link: string): string {
		const cipher = crypto.createCipheriv(
			"aes-256-cbc",
			this.transformKey,
			this.transformIV
		)
		let encrypted = cipher.update(link, "utf8", "base64")
		encrypted += cipher.final("base64")
		return encrypted
	}

	/**
	 * Decrypts a given ID back to the original link using AES-256-CBC decryption.
	 *
	 * @param {string} id - The encrypted ID to be decrypted.
	 * @returns {string} - The decrypted link.
	 */
	protected transformIdToLink(id: string): string {
		const decipher = crypto.createDecipheriv(
			"aes-256-cbc",
			this.transformKey,
			this.transformIV
		)
		let decrypted = decipher.update(id, "base64", "utf8")
		decrypted += decipher.final("utf8")
		return decrypted
	}

	/**
	 * Creates a Manga object with the given parameters.
	 *
	 * @param {Object} params - The parameters for creating the Manga object.
	 * @param {string} params.id - The ID of the manga. Encrypted link.
	 * @param {string} params.title - The title of the manga.
	 * @param {string} [params.synopsis] - The synopsis of the manga.
	 * @param {string} params.thumbnailUrl - The thumbnail URL of the manga.
	 * @param {string[]} [params.genres] - The genres of the manga.
	 * @param {string} [params.status] - The status of the manga.
	 * @param {number} [params.rating] - The rating of the manga.
	 * @param {number} [params.views] - The views of the manga.
	 * @param {MangaChapter[]} [params.chapters] - The chapters of the manga.
	 * @returns {Manga} - The created Manga object.
	 */
	protected createManga(params: {
		id: string
		title: string
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
			thumbnailUrl: params.thumbnailUrl,
			synopsis: params.synopsis ?? null,
			genres: params.genres ?? null,
			status: params.status ?? null,
			rating: params.rating ?? null,
			views: params.views ?? null,
			chapters: params.chapters ?? null,
		}
	}

	/**
	 * Handles the pagination for the next page of manga results.
	 * @param query - The current query string.
	 * @returns The query string for the next page.
	 */
	protected abstract nextPageHandler(query: string): string

	/**
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
		chapterId: string
	): Promise<MangaChapter[]> {
		throw new Error("Method not implemented.")
	}
}

export default AbstractBaseMangaService
