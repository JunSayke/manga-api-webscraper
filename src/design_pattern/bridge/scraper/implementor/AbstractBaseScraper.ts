import IExtractionRule from "../../../../utils/IExtractionRule"
import IWebscraper from "../IWebscraper"

abstract class AbstractBaseScraper implements IWebscraper {
	public fetchContent(url: string): Promise<string> {
		throw new Error("Method not implemented.")
	}

	public querySelector(content: string, selector: string): any[] {
		throw new Error("Method not implemented.")
	}

	public async scrape(
		url: string,
		rules: IExtractionRule[]
	): Promise<Record<string, any>> {
		const content = await this.fetchContent(url)
		const data: Record<string, any> = {}

		for (const rule of rules) {
			const elements = this.querySelector(content, rule.selector)
			data[rule.name] = elements.map((el) => rule.extract(el))
		}

		return data
	}
}

export default AbstractBaseScraper
