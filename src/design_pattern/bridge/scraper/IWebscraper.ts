import { ElementHandle } from "puppeteer"
import IElementHandler from "../../adapter/IElementHandler"
import IExtractionRule from "./implementor/ExtractionRules/IExtractionRule"
import { Cheerio } from "cheerio"
import { AnyNode } from "domhandler"

interface IWebscraper {
	/**
	 * Load a page for manipulation (could fetch content or navigate directly).
	 * @param url - The URL of the page to load.
	 * @returns A promise that resolves when the page is loaded.
	 */
	loadPage(url: string): Promise<void>

	/**
	 * Clean up resources after scraping.
	 * @returns A promise that resolves when the cleanup is complete.
	 */
	cleanup(): Promise<void>

	/**
	 * Select elements based on a selector.
	 * @param selector - The CSS selector to use for selecting elements.
	 * @returns A promise that resolves to an array of selected elements.
	 */
	querySelector(selector: string): Promise<any[]>

	/**
	 * Apply extraction rules and return the scraped data.
	 * @param rules - An array of extraction rules to apply to the loaded page.
	 * @returns A promise that resolves to a record (object) where the keys are rule names and the values are the extracted data.
	 *
	 * The return type is `Promise<Record<string, any>>` because:
	 * - The method is asynchronous and returns a promise that resolves when the scraping is complete.
	 * - The result is a record (object) where each key corresponds to the name of an extraction rule.
	 * - The value for each key is the data extracted by applying the corresponding rule.
	 * - This structure allows for flexible and organized storage of the scraped data, making it easy to access and use.
	 */
	scrape(rules: IExtractionRule[]): Promise<Record<string, any>>

	/**
	 * Create an extraction rule for transforming selected elements.
	 * @param name - The name of the extraction rule.
	 * @param selector - The CSS selector to use for selecting elements.
	 * @param transform - A function that transforms the selected elements into the desired data format.
	 * @returns The created extraction rule.
	 */
	createExtractionRule(
		name: string,
		selector: string,
		transform: (el: any | IElementHandler) => any
	): IExtractionRule

	/**
	 * Adapter method to handle elements.
	 * @param element - The element to adapt.
	 * @param args - Optional arbitrary parameters.
	 * @returns An instance of IElementHandler.
	 */
	elementAdapter: (
		element: any | ElementHandle | Cheerio<AnyNode>,
		...args: any[]
	) => IElementHandler
}

export default IWebscraper
