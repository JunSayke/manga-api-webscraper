import INodeElement from "../design_pattern/adapter/INodeElement"
import IExtractionRule from "../design_pattern/bridge/scraper/implementor/ExtractionRules/IExtractionRule"
import IWebscraper from "../design_pattern/bridge/scraper/IWebscraper"
import Manga from "../../types/Manga"
import MangaChapter from "../../types/MangaChapter"

abstract class AbstractBaseRulesConfig {
	constructor(protected webscraper: IWebscraper) {}

	public abstract execute(query: string): Promise<any>

	/**
	 * Helper function to safely extract data from an element or multiple elements.
	 * Safely extracts data from an element or multiple elements, catching any errors that occur during extraction.
	 *
	 * @param {IExtractionRule} rule - The extraction rule to apply to the element(s).
	 * @param {any} elements - The element or elements to extract data from. If null or not an array, the method returns undefined.
	 * @returns {Promise<any | undefined>} - A promise that resolves to the extracted data, or undefined if an error occurs during extraction.
	 */
	protected async safeExtract(
		rule: IExtractionRule,
		elements: any
	): Promise<any | undefined> {
		if (Array.isArray(elements)) {
			return await Promise.all(
				elements.map(
					async (el) => await rule.extract(el).catch(() => undefined)
				)
			)
		} else {
			return await rule.extract(elements).catch(() => undefined)
		}
	}

	/**
	 * Helper function to create a new extraction rule.
	 * Creates a new extraction rule with the given parameters.
	 *
	 * @param {Object} params - The parameters for creating the extraction rule.
	 * @param {string} params.name - The name of the extraction rule.
	 * @param {string} [params.selector] - The CSS selector for the extraction rule. Defaults to an empty string if not provided.
	 * @param {Function} [params.transform] - The transform function to apply to the extracted element. Defaults to a function that returns undefined if not provided.
	 * @returns {IExtractionRule} - The created extraction rule.
	 */
	protected newExtractionRule({
		name,
		selector,
		transform,
	}: {
		name: string
		selector?: string
		transform?: (el: INodeElement) => any
	}): IExtractionRule {
		return this.webscraper.createExtractionRule(
			name,
			selector ?? "",
			transform ?? (() => undefined)
		)
	}

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
	protected createManga({
		link,
		title,
		synopsis,
		thumbnailUrl,
		genres,
		status,
		rating,
		views,
		chapters,
	}: {
		link: string
		title: string
		synopsis?: string
		thumbnailUrl?: string
		genres?: string[]
		status?: string
		rating?: number
		views?: number
		chapters?: MangaChapter[]
	}): Manga {
		if (!link) throw new Error("Cannot find manga link")
		if (!title) throw new Error("Cannot find manga title")
		return {
			link: link,
			title: title,
			synopsis: synopsis ?? null,
			thumbnailUrl: thumbnailUrl ?? null,
			genres: genres ?? null,
			status: status ?? null,
			rating: rating ?? null,
			views: views ?? null,
			chapters: chapters ?? null,
		}
	}
}

export default AbstractBaseRulesConfig
