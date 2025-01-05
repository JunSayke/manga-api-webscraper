type MangaChapter = {
	link: string // identifier for the chapter
	title: string
	date: string | null // Null when fetching only for chapter info and not the chapter content itself
	images: string[] | null // Null when fetching only for chapter info and not the chapter content itself
}

export default MangaChapter

/**
 * Helper function to create a MangaChapter object.
 * Creates a MangaChapter object with the given parameters. Automatically assigns null to optional parameters if not provided.
 *
 * @param {Object} params - The parameters for creating the MangaChapter object.
 * @param {string} params.link - The link to the chapter.
 * @param {string} params.title - The title of the chapter.
 * @param {string} [params.date] - (Optional) The date of the chapter. Defaults to null if not provided.
 * @param {string} [params.images] - (Optional) The chapter images. Defaults to null if not provided.
 * @returns {MangaChapter} - The created MangaChapter object.
 * @throws {Error} - Throws an error if the link or title is not provided or undefined.
 */
export function createChapter({
	link,
	title,
	date = null,
	images = null,
}: {
	link: string
	title: string
	date?: string | null
	images?: string[] | null
}): MangaChapter {
	if (!link) throw new Error("Cannot find chapter link")
	if (!title) throw new Error("Cannot find chapter title")
	return {
		link: link,
		title: title,
		date: date,
		images: images,
	}
}
