import MangaChapter from "./MangaChapter"

// Should I add authors, artists and alternative titles?
// Instead of null should I use undefined so that when serializing to JSON it doesn't include the key?
type Manga = {
	link: string // identifier for the manga
	title: string
	synopsis: string | null // Null if not available
	thumbnail: string | null // Null if not available
	author: string[] | null // Null if not available
	genres: string[] | null // Null when fetching only for manga info and not the manga content itself
	status: string | null // Null if not available
	rating: number | null // Rating out of 5 normalize if needed, Null if not available
	views: number | null // Null if not available
	chapters: MangaChapter[] | null // Null when fetching only for manga info and not the manga content itself
}

export default Manga

/**
 * Helper function to create a Manga object.
 * Creates a Manga object with the given parameters. Automatically assigns null to optional parameters if not provided.
 *
 * @param {Object} params - The parameters for creating the Manga object.
 * @param {string} params.link - The link to the manga.
 * @param {string} params.title - The title of the manga.
 * @param {string} [params.synopsis] - (Optional) The synopsis of the manga. Defaults to null if not provided.
 * @param {string} params.thumbnailUrl - (Optional) The thumbnail URL of the manga. Defaults to null if not provided.
 * @param {string[]} [params.genres] - (Optional) The genres of the manga. Defaults to null if not provided.
 * @param {string} [params.status] - (Optional) The status of the manga. Defaults to null if not provided.
 * @param {number} [params.rating] - (Optional) The rating of the manga. Defaults to null if not provided.
 * @param {number} [params.views] - (Optional) The views of the manga. Defaults to null if not provided.
 * @param {MangaChapter[]} [params.chapters] - (Optional) The chapters of the manga. Defaults to null if not provided.
 * @returns {Manga} - The created Manga object.
 * @throws {Error} - Throws an error if the link or title is not provided or undefined.
 */
export function createManga({
	link,
	title,
	synopsis = null,
	thumbnail = null,
	author = null,
	genres = null,
	status = null,
	rating = null,
	views = null,
	chapters = null,
}: {
	link: string
	title: string
	synopsis?: string | null
	thumbnail?: string | null
	author?: string[] | null
	genres?: string[] | null
	status?: string | null
	rating?: number | null
	views?: number | null
	chapters?: MangaChapter[] | null
}): Manga {
	// if (!link) throw new Error("Cannot find manga link")
	// if (!title) throw new Error("Cannot find manga title")
	return {
		link: link,
		title: title,
		synopsis: synopsis,
		thumbnail: thumbnail,
		author: author,
		genres: genres,
		status: status,
		rating: rating,
		views: views,
		chapters: chapters,
	}
}
