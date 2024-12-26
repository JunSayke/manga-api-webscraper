import Manga from "../dtos/manga"
import MangaChapter from "../dtos/mangaChapter"

// This interface defines the methods that a manga service should implement
interface IMangaService {
	getKeywordFilters(): string[]
	getStatusFilters(): string[]
	getGenreFilters(): string[]
	getTotalMangaCount(): Promise<number>
	getMangasByTitle(title: string, maxResults?: number): Promise<Manga[]>
	getMangasByGenres(genres: string[], maxResults?: number): Promise<Manga[]>
	getMangasByStatus(status: string, maxResults?: number): Promise<Manga[]>
	getSimilarMangas(mangaId: string, maxResults?: number): Promise<Manga[]>
	getLatestMangas(maxResults?: number): Promise<Manga[]>
	getMangaInfo(mangaId: string): Promise<Manga>
	getMangaChapterImages(
		mangaId: string,
		chapterId: string
	): Promise<MangaChapter[]>
}

export default IMangaService
