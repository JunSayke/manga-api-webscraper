// Encapsulate the business logic and data fetching/manipulation
import BaseMangaService from "./baseMangaService"
import IManga from "../interfaces/iManga"
import IMangaChapter from "../interfaces/iMangaChapter"
import * as cheerio from "cheerio"
import { AnyNode } from "domhandler"
import MangaDto from "../dtos/mangaDto"
import puppeteer from "puppeteer"

class MangahubService extends BaseMangaService {
	constructor() {
		super("https://mangahub.io")
		this.mangaContainerSelector = "div._1KYcM.col-sm-6.col-xs-12"
		this.mangaIdSelector = `a[href*="/manga/"]`
		this.mangaTitleSelector = this.mangaIdSelector
		this.mangaLinkSelector = this.mangaIdSelector
		this.mangaSynopsisSelector = "" // Truncated synopsis in the list page
		this.mangaThumbnailSelector = `div.media-left > a > img`
		this.mangaGenresSelector = "a.label.genre-label"
		this.mangaStatusSelector = "div.media-body span"
		this.mangaRatingSelector = "" // No rating on the list page
		this.mangaViewsSelector = "" // No views on the list page
	}

	private constructQuery(
        order: string = "latest",
        genre: string = "all",
		page: number = 1
	) {
		const query = `https://mangahub.io/search/page/${page}?q=&order=${order}&genre=${genre}`
		return query
	}

	private extractPageNumber(url: string): number {
        const match = url.match(/page\/(\d+)/)
		return match ? parseInt(match[1], 10) : 1
	}

	private nextPageHandler(url: string): string {
		const pageNumber = this.extractPageNumber(url)
		const nextPageNumber = pageNumber + 1
        return url.replace(/page\/\d+/, `page/${nextPageNumber}`)
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

		let query = this.constructQuery("LATEST", "all", page)

        const browser = await puppeteer.launch({ headless: true });
        const queryPage = await browser.newPage();
        await queryPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36');
		while (mangaList.length < maxResults) {
            await queryPage.goto(query, { waitUntil: 'load' });
            
            // TODO make into reusable function
			const mangas = await queryPage.evaluate((mangaContainerSelector, mangaTitleSelector, mangaIdSelector, mangaThumbnailSelector, mangaGenresSelector, mangaStatusSelector) => {
				return Array.from(document.querySelectorAll(mangaContainerSelector)).map(manga => {
					return {
						id: manga.querySelector(mangaIdSelector)?.getAttribute("href")?.split("/").pop() || "",
						title: manga.querySelector(mangaTitleSelector)?.getAttribute("title") || "",
						link: manga.querySelector(mangaIdSelector)?.getAttribute("href") || "",
						synopsis: "",
						thumbnailUrl: manga.querySelector(mangaThumbnailSelector)?.getAttribute("src") || "",
						genres: Array.from(manga.querySelectorAll(mangaGenresSelector)).map(genre => genre.textContent || ""),
						status: (manga.querySelector(mangaStatusSelector)?.textContent)?.match(/\(([^)]+)\)/)?.[1] || "",
						rating: null,
						views: null,
						chapters: null
					};
				});
			}, this.mangaContainerSelector, this.mangaTitleSelector, this.mangaIdSelector, this.mangaThumbnailSelector, this.mangaGenresSelector, this.mangaStatusSelector);

			mangas.forEach(manga => {
                mangaList.push(manga)
            });

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

export default MangahubService