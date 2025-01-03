import INodeElement from "../../adapter/INodeElement"
import IExtractionRule from "./implementor/ExtractionRules/IExtractionRule"

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
	 * @throws an error if load page is not called before this method.
	 */
	querySelector(selector: string): Promise<any>

	/**
	 * Scrape the page using the given rules.
	 * @param rules - The extraction rules to apply to the page.
	 * @param query - The URL of the page to scrape. If not provided, the current page loaded by `loadPage()` is used.
	 * @returns A promise that resolves to the scraped data
	 * @throws an error if current page is undefined.
	 */
	scrape(
		rules: IExtractionRule[],
		query?: string
	): Promise<Record<string, any[]>>

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
		transform: (el: INodeElement) => any
	): IExtractionRule

	/**
	 * Adapter method to handle elements.
	 * @param element - The element to adapt.
	 * @returns An instance of IElementHandler.
	 */
	elementAdapter: (element: any) => INodeElement
}

export default IWebscraper
