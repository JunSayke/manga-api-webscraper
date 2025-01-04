import Manga from "../../types/Manga"
import IExtractionRule from "../scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../scraper/IWebscraper"
import AbstractRulesConfig from "./AbstractRulesConfig"

/**
 * Configuration class for extracting manga detail information.
 *
 * This class extends the AbstractRulesConfig class and defines the extraction rules
 * for various manga attributes such as title, author, artist, genres, status, rating, views, and chapters.
 * It also defines the container rule for extracting manga information from a detail page.
 */
class BaseMDRulesConfig extends AbstractRulesConfig {
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

	constructor(protected webscraper: IWebscraper) {
		super(webscraper)
	}

	public async execute(query: string): Promise<Manga> {
		const result = await this.webscraper.scrape(
			[
				this.title,
				this.link,
				this.synopsis,
				this.thumbnail,
				this.genres,
				this.status,
				this.rating,
				this.views,
				this.chapters,
			],
			query
		)

		const manga = this.createManga({
			link: result["link"]?.[0],
			title: result["title"]?.[0],
			synopsis: result["synopsis"]?.[0],
			thumbnailUrl: result["thumbnail"]?.[0],
			genres: result["genres"],
			status: result["status"]?.[0],
			rating: result["rating"]?.[0],
			views: result["views"]?.[0],
			chapters: result["chapters"],
		})

		return manga
	}
}

export default BaseMDRulesConfig
