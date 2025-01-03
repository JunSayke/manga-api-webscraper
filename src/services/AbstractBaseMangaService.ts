import INodeElement from "../design_pattern/adapter/INodeElement"
import IExtractionRule from "../design_pattern/bridge/scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import IMangaService from "../interfaces/IMangaService"
import Manga from "../types/Manga"
import MangaChapter from "../types/MangaChapter"

abstract class AbstractBaseMangaService implements IMangaService {
	protected baseUrl: string
	protected webScraper: IWebscraper

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
			// Default extraction rules for manga list
			container: this.newExtractionRule({
				name: "manga",
				transform: async (el: INodeElement) => {
					const titleRule = this.mangaListRules["title"]
					const linkRule = this.mangaListRules["link"]
					const synopsisRule = this.mangaListRules["synopsis"]
					const thumbnailRule = this.mangaListRules["thumbnail"]
					const genresRule = this.mangaListRules["genres"]
					const statusRule = this.mangaListRules["status"]
					const ratingRule = this.mangaListRules["rating"]
					const viewsRule = this.mangaListRules["views"]
					const chaptersRule = this.mangaListRules["chapters"]

					const linkElement = await el.find(linkRule.selector)
					const titleElement = await el.find(titleRule.selector)
					const synopsisElement = await el.find(synopsisRule.selector)
					const thumbnailElement = await el.find(thumbnailRule.selector)
					const statusElement = await el.find(statusRule.selector)
					const ratingElement = await el.find(ratingRule.selector)
					const viewsElement = await el.find(viewsRule.selector)

					const manga: Manga = this.createManga({
						link: await this.safeExtract(linkRule, linkElement),
						title: await this.safeExtract(titleRule, titleElement),
						synopsis: await this.safeExtract(synopsisRule, synopsisElement),
						thumbnailUrl: await this.safeExtract(
							thumbnailRule,
							thumbnailElement
						),
						genres: await this.safeExtract(genresRule, el),
						status: await this.safeExtract(statusRule, statusElement),
						rating: await this.safeExtract(ratingRule, ratingElement),
						views: await this.safeExtract(viewsRule, viewsElement),
						chapters: await this.safeExtract(chaptersRule, el),
					})

					return manga
				},
			}),
			title: this.newExtractionRule({ name: "title" }),
			link: this.newExtractionRule({ name: "link" }),
			synopsis: this.newExtractionRule({ name: "synopsis" }),
			thumbnail: this.newExtractionRule({ name: "thumbnail" }),
			genres: this.newExtractionRule({ name: "genres" }),
			status: this.newExtractionRule({ name: "status" }),
			rating: this.newExtractionRule({ name: "rating" }),
			views: this.newExtractionRule({ name: "views" }),
			chapters: this.newExtractionRule({ name: "chapters" }),
		}

		// Manga detail rules
		this.mangaDetailRules = {
			// Default extraction rules for manga detail
			title: this.newExtractionRule({ name: "title" }),
			link: this.newExtractionRule({ name: "link" }),
			synopsis: this.newExtractionRule({ name: "synopsis" }),
			thumbnail: this.newExtractionRule({ name: "thumbnail" }),
			genres: this.newExtractionRule({ name: "genres" }),
			status: this.newExtractionRule({ name: "status" }),
			rating: this.newExtractionRule({ name: "rating" }),
			views: this.newExtractionRule({ name: "views" }),
			chapters: this.newExtractionRule({ name: "chapters" }),
		}
	}

	/**
	 * Helper function to create a new extraction rule.
	 * Creates a new extraction rule with the given parameters.
	 *
	 * @param {Object} params - The parameters for creating the extraction rule.
	 * @param {string} params.name - The name of the extraction rule.
	 * @param {string} [params.selector] - The CSS selector for the extraction rule. Defaults to an empty string if not provided.
	 * @param {Function} [params.transform] - The transform function to apply to the extracted element. Defaults to a function that returns undefined if not provided.
	 * @returns {IExtractionRule} - The created extraction rule.
	 */
	protected newExtractionRule({
		name,
		selector,
		transform,
	}: {
		name: string
		selector?: string
		transform?: (el: INodeElement) => any
	}): IExtractionRule {
		return this.webScraper.createExtractionRule(
			name,
			selector ?? "",
			transform ?? (() => undefined)
		)
	}

	/**
	 * Helper function to safely extract data from an element.
	 * Safely extracts data from an element, catching any errors that occur during extraction especially when dealing with the element.
	 * @param rule - The extraction rule to apply to the element.
	 * @param element - The element to extract data from.
	 * @returns The extracted data, or `undefined` if an error occurs during extraction.
	 */
	protected async safeExtract(
		rule: IExtractionRule,
		element: any
	): Promise<any> {
		return await rule.extract(element).catch(() => undefined)
	}

	/**
	 * Helper function to create a Manga object.
	 * Creates a Manga object with the given parameters. Automatically assigns null to optional parameters if not provided.
	 *
	 * @param {Object} params - The parameters for creating the Manga object.
	 * @param {string} params.link - The link to the manga.
	 * @param {string} params.title - The title of the manga.
	 * @param {string} [params.synopsis] - The synopsis of the manga.
	 * @param {string} params.thumbnailUrl - The thumbnail URL of the manga.
	 * @param {string[]} [params.genres] - The genres of the manga.
	 * @param {string} [params.status] - The status of the manga.
	 * @param {number} [params.rating] - The rating of the manga.
	 * @param {number} [params.views] - The views of the manga.
	 * @param {MangaChapter[]} [params.chapters] - The chapters of the manga.
	 * @returns {Manga} - The created Manga object.
	 * @throws {Error} - Throws an error if the link or title is not provided or undefined.
	 */
	protected createManga({
		link,
		title,
		synopsis,
		thumbnailUrl,
		genres,
		status,
		rating,
		views,
		chapters,
	}: {
		link: string
		title: string
		synopsis: string
		thumbnailUrl: string
		genres: string[]
		status: string
		rating: number
		views: number
		chapters?: MangaChapter[]
	}): Manga {
		if (!link) throw new Error("Cannot find manga link")
		if (!title) throw new Error("Cannot find manga title")
		return {
			link: link,
			title: title,
			synopsis: synopsis ?? null,
			thumbnailUrl: thumbnailUrl ?? null,
			genres: genres ?? null,
			status: status ?? null,
			rating: rating ?? null,
			views: views ?? null,
			chapters: chapters ?? null,
		}
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
			await this.webScraper.loadPage(query)
			const result = await this.webScraper.scrape([
				this.mangaListRules["manga"],
			])
			const mangas = result["manga"]
			mangaList.push(...mangas)

			// Stop if no more manga is found probably including page not found
			if (mangas.length === 0) break
			query = this.nextPageHandler(query)
			this.webScraper.cleanup()
		}

		return mangaList.slice(0, maxResults)
	}

	public async getMangaInfo(mangaLink: string): Promise<Manga> {
		await this.webScraper.loadPage(mangaLink)
		const result = await this.webScraper.scrape([
			this.mangaDetailRules["title"],
			this.mangaDetailRules["link"],
			this.mangaDetailRules["synopsis"],
			this.mangaDetailRules["thumbnail"],
			this.mangaDetailRules["genres"],
			this.mangaDetailRules["status"],
			this.mangaDetailRules["rating"],
			this.mangaDetailRules["views"],
			this.mangaDetailRules["chapters"],
		])

		const manga = this.createManga({
			link: result["link"]?.[0],
			title: result["title"]?.[0],
			synopsis: result["synopsis"]?.[0],
			thumbnailUrl: result["thumbnail"]?.[0],
			genres: result["genres"],
			status: result["status"]?.[0],
			rating: result["rating"]?.[0],
			views: result["views"]?.[0],
			chapters: result["chapters"],
		})

		return manga
	}
	public async getMangaChapterImages(
		chapterLink: string
	): Promise<MangaChapter[]> {
		throw new Error("Method not implemented.")
	}
}

export default AbstractBaseMangaService
