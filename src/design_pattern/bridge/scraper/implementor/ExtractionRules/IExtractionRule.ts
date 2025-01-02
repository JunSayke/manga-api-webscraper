import { Cheerio } from "cheerio"
import { AnyNode } from "domhandler"
import { ElementHandle } from "puppeteer"
import IElementHandler from "../../../../adapter/IElementHandler"

/**
 * Interface representing an extraction rule for web scraping.
 */
interface IExtractionRule {
	/**
	 * The CSS selector used to select elements for extraction.
	 */
	selector: string

	/**
	 * The name of the extraction rule.
	 */
	name: string

	/**
	 * Extracts data from the selected element.
	 * @param element - The element to extract data from. This can be of various types, including:
	 *   - `any`: A generic type for flexibility.
	 *   - `ElementHandle`: An element handle from Puppeteer.
	 *   - `Cheerio<AnyNode>`: A Cheerio element.
	 *   - `IElementHandler`: A custom element handler interface.
	 * @returns The extracted data.
	 */
	extract(
		element: any | ElementHandle | Cheerio<AnyNode> | IElementHandler
	): any
}

export default IExtractionRule
