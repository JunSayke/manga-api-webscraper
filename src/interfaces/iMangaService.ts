import Manga from "../types/Manga"
import MangaChapter from "../types/MangaChapter"

/**
 * This interface defines the methods that a manga service should implement.
 */
interface IMangaService {
	/**
	 * Retrieves the available keyword filters.
	 * @returns An array of keyword filters.
	 */
	getKeywordFilters(): string[]

	/**
	 * Retrieves the available status filters.
	 * @returns An array of status filters.
	 */
	getStatusFilters(): string[]

	/**
	 * Retrieves the available genre filters.
	 * @returns An array of genre filters.
	 */
	getGenreFilters(): string[]

	/**
	 * Retrieves the total count of mangas.
	 * @returns A promise that resolves to the total number of mangas.
	 */
	getTotalMangaCount(): Promise<number>

	/**
	 * Retrieves mangas by their title.
	 * @param title - The title of the manga to search for.
	 * @param maxResults - The maximum number of results to return.
	 * @returns A promise that resolves to an array of Manga objects.
	 */
	getMangasByTitle(title: string, maxResults?: number): Promise<Manga[]>

	/**
	 * Retrieves mangas by their genres.
	 * @param genres - An array of genres to search for.
	 * @param maxResults - The maximum number of results to return.
	 * @returns A promise that resolves to an array of Manga objects.
	 */
	getMangasByGenres(genres: string[], maxResults?: number): Promise<Manga[]>

	/**
	 * Retrieves mangas by their status.
	 * @param status - The status of the manga to search for.
	 * @param maxResults - The maximum number of results to return.
	 * @returns A promise that resolves to an array of Manga objects.
	 */
	getMangasByStatus(status: string, maxResults?: number): Promise<Manga[]>

	/**
	 * Retrieves similar mangas based on a given manga ID.
	 * @param mangaId - The ID of the manga to find similar mangas for.
	 * @param maxResults - The maximum number of results to return.
	 * @returns A promise that resolves to an array of Manga objects.
	 */
	getSimilarMangas(mangaId: string, maxResults?: number): Promise<Manga[]>

	/**
	 * Retrieves the latest mangas.
	 * @param maxResults - The maximum number of results to return.
	 * @returns A promise that resolves to an array of Manga objects.
	 */
	getLatestMangas(maxResults?: number): Promise<Manga[]>

	/**
	 * Retrieves detailed information about a specific manga.
	 * @param mangaId - The ID of the manga to retrieve information for.
	 * @returns A promise that resolves to a Manga object.
	 */
	getMangaInfo(mangaId: string): Promise<Manga>

	/**
	 * Retrieves the images for a specific manga chapter.
	 * @param mangaId - The ID of the manga.
	 * @param chapterId - The ID of the chapter.
	 * @returns A promise that resolves to an array of MangaChapter objects.
	 */
	getMangaChapterImages(chapterId: string): Promise<MangaChapter[]>
}

export default IMangaService
