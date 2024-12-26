import MangaChapter from "./mangaChapter"

interface Manga {
	id: string
	title: string
	synopsis: string
	thumbnailUrl: string
	genres: string[]
	status: string
	chapters: MangaChapter[]
}

export default Manga
