import IManga from "./iManga"
import IMangaChapter from "./iMangaChapter"

// This interface defines the methods that a manga service should implement
interface IMangaService {
	getKeywordFilters(): string[]
	getStatusFilters(): string[]
	getGenreFilters(): string[]
	getTotalMangaCount(): Promise<number>
	getMangasByTitle(title: string, maxResults?: number): Promise<IManga[]>
	// Some mangas have multiple genres, so we should be able to search by multiple genres but but other services may not support multiple genres
	getMangasByGenres(genres: string[], maxResults?: number): Promise<IManga[]>
	getMangasByStatus(status: string, maxResults?: number): Promise<IManga[]>
	getSimilarMangas(mangaId: string, maxResults?: number): Promise<IManga[]>
	getLatestMangas(maxResults?: number): Promise<IManga[]>
	getMangaInfo(mangaId: string): Promise<IManga>
	getMangaChapterImages(
		mangaId: string,
		chapterId: string
	): Promise<IMangaChapter[]>
}

export default IMangaService
