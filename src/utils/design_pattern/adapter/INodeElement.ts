/**
 * Interface for handling elements in a web scraping context.
 * This interface allows seamless switching between different element handlers,
 * such as Puppeteer and Cheerio.
 */
interface INodeElement {
	/**
	 * Retrieves the value of an attribute from the element.
	 * @param name - The name of the attribute to retrieve.
	 * @returns A promise that resolves to the attribute value, or null if the attribute does not exist.
	 */
	attr(name: string): Promise<string | null>

	/**
	 * Retrieves the text content of the element.
	 * @returns A promise that resolves to the text content of the element.
	 */
	text(): Promise<string>

	/**
	 * Finds a single child element that matches the given selector.
	 * @param selector - The CSS selector to match the child element.
	 * @returns A promise that resolves to an IElementHandler for the matched element, or null if no match is found.
	 */
	find(selector: string): Promise<INodeElement | null>

	/**
	 * Finds all child elements that match the given selector.
	 * @param selector - The CSS selector to match the child elements.
	 * @returns A promise that resolves to an array of IElementHandler instances for the matched elements.  Empty array if no match is found. Null if selector is invalid.
	 */
	findAll(selector: string): Promise<INodeElement[] | null>

	// Add more methods as needed
}

export default INodeElement
