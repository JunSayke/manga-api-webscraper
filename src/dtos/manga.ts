import MangaChapter from "./mangaChapter"

interface Manga {
	id: string
	title: string
	link: string
	synopsis: string
	thumbnailUrl: string
	genres: string[]
	status: string
	rating: number | null // Null if not available
	views: number | null // Null if not available
	chapters: MangaChapter[] | null // Null when fetching only for manga info and not the manga content itself
}

export default Manga
