import * as cheerio from "cheerio"
import axios from "axios"
import { AnyNode } from "domhandler"
import AbstractBaseScraper from "./AbstractBaseScraper"

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
}

export default CheerioWebscraper
