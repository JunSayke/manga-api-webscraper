import * as cheerio from "cheerio"
import { Cheerio } from "cheerio"
import axios from "axios"
import { AnyNode } from "domhandler"
import AbstractBaseScraper from "./AbstractBaseScraper"
import IExtractionRule from "./ExtractionRules/IExtractionRule"
import CheerioExtractionRule from "./ExtractionRules/CheerioExtractionRule"
import CheerioElementAdapter from "../../../adapter/CheerioElementAdapter"
import IElementHandler from "../../../adapter/IElementHandler"

class CheerioWebscraper extends AbstractBaseScraper {
	private $: cheerio.CheerioAPI | null = null

	public elementAdapter = (
		element: Cheerio<AnyNode>,
		...args: any[]
	): CheerioElementAdapter => new CheerioElementAdapter(element)

	public async loadPage(url: string): Promise<void> {
		const response = await axios.get<string>(url)
		this.$ = cheerio.load(response.data)
	}

	public async cleanup(): Promise<void> {
		if (this.$) this.$ = null
	}

	public async querySelector(
		selector: string
	): Promise<cheerio.Cheerio<AnyNode>[]> {
		if (!this.$) {
			throw new Error("Page not loaded. Call loadPage first.")
		}
		return this.$(selector)
			.toArray()
			.map((el) => this.$!(el))
	}

	public createExtractionRule(
		name: string,
		selector: string,
		transform: (el: any | IElementHandler) => any
	): IExtractionRule {
		return new CheerioExtractionRule(name, selector, transform)
	}
}

export default CheerioWebscraper
