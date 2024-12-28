import IManga from "../interfaces/iManga"
import IMangaChapter from "../interfaces/iMangaChapter"

class MangaDto implements IManga {
	id: string
	title: string
	link: string
	synopsis: string | null
	thumbnailUrl: string
	genres: string[] | null
	status: string | null
	rating: number | null
	views: number | null
	chapters: IMangaChapter[] | null

	constructor() {
		this.id = ""
		this.title = ""
		this.link = ""
		this.synopsis = null
		this.thumbnailUrl = ""
		this.genres = null
		this.status = null
		this.rating = null
		this.views = null
		this.chapters = null
	}
}

export default MangaDto
