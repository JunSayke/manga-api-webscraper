// Encapsulate the business logic and data fetching/manipulation
import BaseMangaService from "./baseMangaService"
import IManga from "../interfaces/iManga"
import IMangaChapter from "../interfaces/iMangaChapter"
import * as cheerio from "cheerio"
import { AnyNode } from "domhandler"
import MangaDto from "../dtos/mangaDto"
import BrowserManager from "./browserManagerService"
import { PageManager } from "../manager/browserPageManager"
import { ParsedQs } from "qs"

class MangahubService extends BaseMangaService {
    private readonly browserManager: typeof BrowserManager

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
        this.browserManager = BrowserManager
    }

    private constructQuery({
        q = "",
        order = "",
        genre = "",
        page = 1,
    }: {
        q?: string;
        order?: string;
        genre?: string;
        page?: number;
    }) {
        // Base URL
        let queryString = `https://mangahub.io/search/page/${page}`;
    
        // Construct query parameters
        const queryParams = [];
        if (q) {
            queryParams.push(`q=${q}`);
        }
        if (order) {
            queryParams.push(`order=${order}`);
        }
        if (genre) {
            queryParams.push(`genre=${genre}`);
        }
    
        if (queryParams.length > 0) {
            queryString += `?${queryParams.join("&")}`;
        }
    
        return queryString;
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

    public async getLatestMangas(maxResults: number = 10): Promise<IManga[]> {
        const mangaList: IManga[] = []

        let query = this.constructQuery({ order: "LATEST" });

        const browser = BrowserManager.getInstance().getBrowser();
        const queryPage = await PageManager.setupPage(browser);

        //TODO MODULARIZE AND ADD TIMEOUT
        while (1) {
            await queryPage.goto(query, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            const mangas = await queryPage.evaluate(
                (
                    mangaContainerSelector,
                    mangaTitleSelector,
                    mangaIdSelector,
                    mangaThumbnailSelector,
                    mangaGenresSelector,
                    mangaStatusSelector
                ) => {
                    const mangaContainers = Array.from(document.querySelectorAll(mangaContainerSelector));
                    const processManga = (manga: Element) => ({
                        id: manga.querySelector(mangaIdSelector)?.getAttribute("href")?.split("/").pop() || "",
                        title: manga.querySelector(mangaTitleSelector)?.getAttribute("title") || "",
                        link: manga.querySelector(mangaIdSelector)?.getAttribute("href") || "",
                        synopsis: "",
                        thumbnailUrl: manga.querySelector(mangaThumbnailSelector)?.getAttribute("src") || "",
                        genres: Array.from(manga.querySelectorAll(mangaGenresSelector)).map(
                            (genre) => genre.textContent || ""
                        ),
                        status:
                            manga.querySelector(mangaStatusSelector)?.textContent?.match(/\(([^)]+)\)/)?.[1] ||
                            "",
                        rating: null,
                        views: null,
                        chapters: null,
                    });

                    return Promise.all(
                        mangaContainers.map((manga) => Promise.resolve(processManga(manga)))
                    );
                },
                this.mangaContainerSelector,
                this.mangaTitleSelector,
                this.mangaIdSelector,
                this.mangaThumbnailSelector,
                this.mangaGenresSelector,
                this.mangaStatusSelector
            );

            mangas.forEach(manga => {
                mangaList.push(manga)
            });

            await PageManager.cleanupPage(queryPage);

            if(await queryPage.$("li.next") == null || (mangaList.length >= maxResults)) {
                break
            }

            query = this.nextPageHandler(query)
        }
        return mangaList.slice(0, maxResults)
    }


    public async searchMangas(query: ParsedQs): Promise<IManga[]> {
        const mangaList: IManga[] = []
        let { limit } = query
        if (!limit) {
            limit = '50'
        }
        let queryString = this.constructQuery(query);

        const browser = BrowserManager.getInstance().getBrowser();
        const queryPage = await PageManager.setupPage(browser);

        //TODO MODULARIZE AND ADD TIMEOUT
        while (1) {
            await queryPage.goto(queryString, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            const mangas = await queryPage.evaluate(
                (
                    mangaContainerSelector,
                    mangaTitleSelector,
                    mangaIdSelector,
                    mangaThumbnailSelector,
                    mangaGenresSelector,
                    mangaStatusSelector
                ) => {
                    const mangaContainers = Array.from(document.querySelectorAll(mangaContainerSelector));
                    const processManga = (manga: Element) => ({
                        id: manga.querySelector(mangaIdSelector)?.getAttribute("href")?.split("/").pop() || "",
                        title: manga.querySelector(mangaTitleSelector)?.getAttribute("title") || "",
                        link: manga.querySelector(mangaIdSelector)?.getAttribute("href") || "",
                        synopsis: "",
                        thumbnailUrl: manga.querySelector(mangaThumbnailSelector)?.getAttribute("src") || "",
                        genres: Array.from(manga.querySelectorAll(mangaGenresSelector)).map(
                            (genre) => genre.textContent || ""
                        ),
                        status:
                            manga.querySelector(mangaStatusSelector)?.textContent?.match(/\(([^)]+)\)/)?.[1] ||
                            "",
                        rating: null,
                        views: null,
                        chapters: null,
                    });

                    return Promise.all(
                        mangaContainers.map((manga) => Promise.resolve(processManga(manga)))
                    );
                },
                this.mangaContainerSelector,
                this.mangaTitleSelector,
                this.mangaIdSelector,
                this.mangaThumbnailSelector,
                this.mangaGenresSelector,
                this.mangaStatusSelector
            );

            mangas.forEach(manga => {
                mangaList.push(manga)
            });

            await PageManager.cleanupPage(queryPage);
            if(await queryPage.$("li.next") == null || (mangaList.length >= Number(limit))) {
                break
            }
            queryString = this.nextPageHandler(queryString)
        }
        return mangaList
    }

	public async getMangasByGenres(
		genres: string[],
		maxResults: number = 10
	): Promise<IManga[]> {
        throw new Error("Method not implemented.")
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