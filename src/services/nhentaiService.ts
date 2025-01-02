// Encapsulate the business logic and data fetching/manipulation
import AbstractBaseMangaService from "./AbstractBaseMangaService"
import IManga from "../interfaces/IManga"
import IMangaChapter from "../interfaces/IMangaChapter"
import { AnyNode } from "domhandler"
import MangaDto from "../dtos/mangaDto"
import puppeteer from "puppeteer"

class NHentaiService extends AbstractBaseMangaService {
	constructor() {
		super("https://nhentai.net")
		this.mangaContainerSelector = "div.container.index-container"
		this.mangaIdSelector = `a[href*="/g/"]`
		this.mangaTitleSelector = `div.gallery > a > div.caption`
		this.mangaLinkSelector = this.mangaIdSelector
		this.mangaSynopsisSelector = "" // Truncated synopsis in the list page
		this.mangaThumbnailSelector = `div.gallery > a > img`
		this.mangaGenresSelector = ""
		this.mangaStatusSelector = ""
		this.mangaRatingSelector = "" // No rating on the list page
		this.mangaViewsSelector = "" // No views on the list page
	}

	private searchQuery(
		searchQuery: string,
		sort: string = "all-time" // sort by popularity: default to all-time
	) {
		const query = `${this.baseUrl}/search/?q=${searchQuery}&sort=${sort}`
		return query
	}

	// https://nhentai.net/?page=2
	private latestQuery(page: number) {
		const query = `${this.baseUrl}/?page=${page}`
		return query
	}

	private extractPageNumber(url: string): number {
		const match = url.match(/page\/(\d+)/)
		return match ? parseInt(match[1], 10) : 1
	}

	private nextPageHandler(url: string): string {
		const pageNumber = this.extractPageNumber(url)
		const nextPageNumber = pageNumber + 1
		return url.replace(/page=\d+/, `page=${nextPageNumber}`)
	}

	// TODO: What's the best way to extract the manga ID from the URL? or does it even matter?
	// https://mangahub.io/manga/tales-of-demons-and-gods
	private extractMangaId(url: string): string {
		const match = url.match(/manga\/([a-zA-Z0-9-]+)/)
		return match ? match[1] : ""
	}

	public async getLatestMangas(maxResults: number = 10): Promise<IManga[]> {
		const mangaList: IManga[] = []
		let page = 1

		let query = this.latestQuery(page)

		const browser = await puppeteer.launch({ headless: true })
		const queryPage = await browser.newPage()
		await queryPage.setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"
		)

		while (mangaList.length < maxResults) {
			await queryPage.goto(query, { waitUntil: "load" })

			// TODO make into reusable function
			const mangas = await queryPage.evaluate(
				(
					baseUrl,
					mangaContainerSelector,
					mangaTitleSelector,
					mangaIdSelector,
					mangaThumbnailSelector
				) => {
					return Array.from(
						document.querySelectorAll(mangaContainerSelector)
					).map((manga) => {
						return {
							id:
								manga
									.querySelector(mangaIdSelector)
									?.getAttribute("href")
									?.split("/")[2] || "",
							title: manga.querySelector(mangaTitleSelector)?.textContent || "",
							link:
								baseUrl +
									manga.querySelector(mangaIdSelector)?.getAttribute("href") ||
								"",
							synopsis: null,
							thumbnailUrl:
								manga
									.querySelector(mangaThumbnailSelector)
									?.getAttribute("src") || "",
							genres: null,
							status: null,
							rating: null,
							views: null,
							chapters: null,
						}
					})
				},
				this.baseUrl,
				this.mangaContainerSelector,
				this.mangaTitleSelector,
				this.mangaIdSelector,
				this.mangaThumbnailSelector
			)

			mangas.forEach((manga) => {
				mangaList.push(manga)
			})

			if (mangaList.length >= maxResults) {
				break
			}

			page++
			query = this.nextPageHandler(query)
		}

		return mangaList.slice(0, maxResults)
	}

	public getStatusFilters(): string[] {
		return ["all", "completed", "ongoing"]
	}

	// Genres are encoded as numbers in the query string instead of a label ex: action = 1
	public getGenreFilters(): string[] {
		throw new Error("Method not implemented.")
	}
}

export default NHentaiService
