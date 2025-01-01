import * as cheerio from "cheerio"
import axios from "axios"
import { AnyNode } from "domhandler"
import AbstractBaseScraper from "./AbstractBaseScraper"
import IExtractionRule from "../../../../utils/IExtractionRule"
import CheerioExtractionRule from "../../../../utils/CheerioExtractionRule"

class CheerioWebscraper extends AbstractBaseScraper {
	public async fetchContent(url: string): Promise<string> {
		const response = await axios.get<string>(url)
		return response.data
	}

	public querySelector(
		content: string,
		selector: string
	): cheerio.Cheerio<AnyNode>[] {
		const $ = cheerio.load(content)
		return $(selector)
			.toArray()
			.map((el) => $(el))
	}

	public createExtractionRule(
		name: string,
		selector: string,
		transform: (el: cheerio.Cheerio<AnyNode>) => any
	): IExtractionRule {
		return new CheerioExtractionRule(name, selector, transform)
	}
}

export default CheerioWebscraper
