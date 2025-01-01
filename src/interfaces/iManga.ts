import IMangaChapter from "./IMangaChapter"

interface IManga {
	id: string // Does this even matter knowing that the manga ID is mostly a part of the URL?
	title: string
	link: string
	synopsis: string | null // Null if not available
	thumbnailUrl: string
	genres: string[] | null // Null when fetching only for manga info and not the manga content itself
	status: string | null // Null if not available
	rating: number | null // Null if not available
	views: number | null // Null if not available
	chapters: IMangaChapter[] | null // Null when fetching only for manga info and not the manga content itself
}

export default IManga
