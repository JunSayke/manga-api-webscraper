import MangaChapter from "./MangaChapter"

// Should I add authors, artists and alternative titles?
// Instead of null should I use undefined so that when serializing to JSON it doesn't include the key?
type Manga = {
	link: string // identifier for the manga
	title: string
	synopsis: string | null // Null if not available
	thumbnailUrl: string | null // Null if not available
	genres: string[] | null // Null when fetching only for manga info and not the manga content itself
	status: string | null // Null if not available
	rating: number | null // Rating out of 5 Null if not available
	views: number | null // Null if not available
	chapters: MangaChapter[] | null // Null when fetching only for manga info and not the manga content itself
}

export default Manga
