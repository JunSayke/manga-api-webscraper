// This mixin is used to provide the basic structure of a webscraper
abstract class AbstractWebscraper {
	// These selectors are used to scrape the website
	// Altho the urls must be provided by the implementation
	// Manga list page selectors
	protected mangaContainerSelector: string = "" // Most likely a <li> tag

	// Manga info page selectors
	protected mangaIdSelector: string = "" // Most likely a part of the URL or <a> tag link
	protected mangaTitleSelector: string = ""
	protected mangaLinkSelector: string = ""
	protected mangaSynopsisSelector: string = "" // Some websites may have a separate page for the synopsis
	protected mangaThumbnailSelector: string = ""
	protected mangaGenresSelector: string = ""
	protected mangaStatusSelector: string = ""
	protected mangaRatingSelector: string = ""
	protected mangaViewsSelector: string = ""

	// Chapter list page selectors
	protected chapterContainerSelector: string = "" // Most likely a <li> tag

	// Manga chapter page selectors
	protected mangaChapterIdSelector: string = "" // Most likely a part of the URL or <a> tag link
	protected mangaChapterTitleSelector: string = ""
	protected mangaChapterLinkSelector: string = ""
	protected mangaChapterDateSelector: string = ""
	protected mangaChapterImagesSelector: string = "" // Most likely an <img> tag
}

export default AbstractWebscraper
