import IManga from "../interfaces/IManga"
import IMangaChapter from "../interfaces/IMangaChapter"

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
