import { ElementHandle } from "puppeteer"
import INodeElement from "../../../adapter/INodeElement"
import IWebscraper from "../IWebscraper"
import BaseExtractionRule from "./ExtractionRules/BaseExtractionRule"
import IExtractionRule from "./ExtractionRules/IExtractionRule"
import { Cheerio } from "cheerio"
import { AnyNode } from "domhandler"

abstract class AbstractBaseScraper implements IWebscraper {
	public abstract elementAdapter: (element: any) => INodeElement

	public abstract loadPage(url: string): Promise<void>
	public abstract cleanup(): Promise<void>
	public abstract querySelector(selector: string): Promise<any[]>

	public async scrape(
		rules: IExtractionRule[],
		element?: INodeElement
	): Promise<Record<string, any[]>> {
		const data: Record<string, any[]> = {}

		for (const rule of rules) {
			const elements = await this.querySelector(rule.selector)
			data[rule.name] = await Promise.all(
				elements.map(async (el) => await rule.extract(this.elementAdapter(el)))
			)
		}

		return data
	}

	public createExtractionRule(
		name: string,
		selector: string,
		transform: (el: INodeElement) => any
	): IExtractionRule {
		return new BaseExtractionRule(name, selector, transform)
	}
}

export default AbstractBaseScraper
