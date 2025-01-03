import axios from "axios"
import * as cheerio from "cheerio"
import { Cheerio } from "cheerio"
import { AnyNode } from "domhandler"
import CheerioElementAdapter from "../../../adapter/CheerioElementAdapter"
import AbstractBaseScraper from "./AbstractBaseScraper"

class CheerioWebscraper extends AbstractBaseScraper {
	private $: cheerio.CheerioAPI | null = null

	public elementAdapter = (element: Cheerio<AnyNode>): CheerioElementAdapter =>
		new CheerioElementAdapter(element)

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
		return this.$!(selector)
			.toArray()
			.map((el) => this.$!(el))
	}
}

export default CheerioWebscraper
