import INodeElement from "../adapter/INodeElement"
import IExtractionRule from "../scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../scraper/IWebscraper"
import Manga from "../../types/Manga"
import AbstractRulesConfig from "./AbstractRulesConfig"

/**
 * Configuration class for extracting manga list information.
 *
 * This class extends the AbstractRulesConfig class and defines the extraction rules
 * for various manga attributes such as title, link, thumbnail, genres, status, rating, views, and chapters.
 * It also defines the container rule for extracting manga information from a list.
 */
class BaseMLRulesConfig extends AbstractRulesConfig {
	public title: IExtractionRule = this.newExtractionRule({ name: "title" })
	public link: IExtractionRule = this.newExtractionRule({ name: "link" })
	public synopsis: IExtractionRule = this.newExtractionRule({
		name: "synopsis",
	})
	public thumbnail: IExtractionRule = this.newExtractionRule({
		name: "thumbnail",
	})
	public genres: IExtractionRule = this.newExtractionRule({ name: "genres" })
	public status: IExtractionRule = this.newExtractionRule({ name: "status" })
	public rating: IExtractionRule = this.newExtractionRule({ name: "rating" })
	public views: IExtractionRule = this.newExtractionRule({ name: "views" })
	public chapters: IExtractionRule = this.newExtractionRule({
		name: "chapters",
	})
	/*
	 * The container for the manga list. This is the main extraction rule that contains all the other extraction rules. Must be set before executing the extraction.
	 * @type {IExtractionRule}
	 */
	public container: IExtractionRule

	constructor(protected webscraper: IWebscraper) {
		super(webscraper)
		this.container = this.newExtractionRule({
			name: "manga",
			selector: "",
			transform: async (el: INodeElement) => {
				const linkElement = await el.find(this.link.selector)
				const titleElement = await el.find(this.title.selector)
				const synopsisElement = await el.find(this.synopsis.selector)
				const thumbnailElement = await el.find(this.thumbnail.selector)
				const statusElement = await el.find(this.status.selector)
				const ratingElement = await el.find(this.rating.selector)
				const viewsElement = await el.find(this.views.selector)
				const genres = await el.findAll(this.genres.selector)
				const chapters = await el.findAll(this.chapters.selector)

				const manga: Manga = this.createManga({
					link: await this.safeExtract(this.link, linkElement),
					title: await this.safeExtract(this.title, titleElement),
					synopsis: await this.safeExtract(this.synopsis, synopsisElement),
					thumbnailUrl: await this.safeExtract(
						this.thumbnail,
						thumbnailElement
					),
					genres: await this.safeExtract(this.genres, genres),
					status: await this.safeExtract(this.status, statusElement),
					rating: await this.safeExtract(this.rating, ratingElement),
					views: await this.safeExtract(this.views, viewsElement),
					chapters: await this.safeExtract(this.chapters, chapters),
				})

				return manga
			},
		})
	}

	public async execute(query: string): Promise<Manga[]> {
		if (!this.container.selector) {
			throw new Error("No container selector provided.")
		}
		const result = await this.webscraper.scrape([this.container], query)
		return result["manga"]
	}
}

export default BaseMLRulesConfig
