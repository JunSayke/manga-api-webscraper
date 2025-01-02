import { AnyNode } from "domhandler"
import IExtractionRule from "./ExtractionRules/IExtractionRule"
import IWebscraper from "../IWebscraper"
import { Cheerio } from "cheerio"
import IElementHandler from "../../../adapter/IElementHandler"

abstract class AbstractBaseScraper implements IWebscraper {
	public abstract elementAdapter: (
		element: any,
		...args: any[]
	) => IElementHandler

	public abstract loadPage(url: string): Promise<void>
	public abstract cleanup(): Promise<void>
	public abstract querySelector(selector: string): Promise<any[]>

	public async scrape(rules: IExtractionRule[]): Promise<Record<string, any>> {
		const data: Record<string, any> = {}

		for (const rule of rules) {
			const elements = await this.querySelector(rule.selector)
			data[rule.name] = await Promise.all(
				elements.map((el) => rule.extract(this.elementAdapter(el)))
			)
		}

		return data
	}

	public abstract createExtractionRule(
		name: string,
		selector: string,
		transform: (el: any | IElementHandler) => any
	): IExtractionRule
}

export default AbstractBaseScraper
