interface IMangaChapter {
	id: string
	title: string
	link: string
	date: Date
	images: string[] | null // Null when fetching only for chapter info and not the chapter content itself
}

export default IMangaChapter
