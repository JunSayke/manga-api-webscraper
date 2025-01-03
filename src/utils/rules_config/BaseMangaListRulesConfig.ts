import INodeElement from "../design_pattern/adapter/INodeElement"
import IExtractionRule from "../design_pattern/bridge/scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import Manga from "../../types/Manga"
import AbstractBaseRulesConfig from "./AbstractBaseRulesConfig"

class BaseMangaListRulesConfig extends AbstractBaseRulesConfig {
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
	// The most important field
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

				const manga: Manga = this.createManga({
					link: await this.safeExtract(this.link, linkElement),
					title: await this.safeExtract(this.title, titleElement),
					synopsis: await this.safeExtract(this.synopsis, synopsisElement),
					thumbnailUrl: await this.safeExtract(
						this.thumbnail,
						thumbnailElement
					),
					genres: await this.safeExtract(this.genres, el),
					status: await this.safeExtract(this.status, statusElement),
					rating: await this.safeExtract(this.rating, ratingElement),
					views: await this.safeExtract(this.views, viewsElement),
					chapters: await this.safeExtract(this.chapters, el),
				})

				return manga
			},
		})
	}

	public async execute(query: string): Promise<Manga[]> {
		if (!this.container.selector) {
			throw new Error("No container selector provided.")
		}
		const result = await this.webscraper.scrape(query, [this.container])
		return result["manga"]
	}
}

export default BaseMangaListRulesConfig
