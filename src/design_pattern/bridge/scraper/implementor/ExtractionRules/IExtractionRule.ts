import INodeElement from "../../../../adapter/INodeElement"

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

	 *   - `INodeElement`: A custom element handler interface.
	 * @returns The promise resolves to the extracted data.
	 */
	extract(element: INodeElement): Promise<any>
}

export default IExtractionRule
