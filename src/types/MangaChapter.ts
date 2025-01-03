type MangaChapter = {
	link: string // identifier for the chapter
	title: string
	date: Date | null // Null when fetching only for chapter info and not the chapter content itself
	images: string[] | null // Null when fetching only for chapter info and not the chapter content itself
}

export default MangaChapter
