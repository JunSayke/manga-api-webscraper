import MangaChapter from "./MangaChapter"

type Manga = {
	id: string // An link, optionally encrypted
	title: string
	synopsis: string | null // Null if not available
	thumbnailUrl: string | null // Null if not available
	genres: string[] | null // Null when fetching only for manga info and not the manga content itself
	status: string | null // Null if not available
	rating: number | null // Null if not available
	views: number | null // Null if not available
	chapters: MangaChapter[] | null // Null when fetching only for manga info and not the manga content itself
}

export default Manga
