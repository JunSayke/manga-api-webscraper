import { Cheerio } from "cheerio"
import { AnyNode } from "domhandler"
import IElementHandler from "./IElementHandler"

class CheerioElementAdapter implements IElementHandler {
	private element: Cheerio<AnyNode>

	constructor(element: Cheerio<AnyNode>) {
		this.element = element
	}

	public async attr(name: string): Promise<string | null> {
		return this.element.attr(name) || null
	}

	public async text(): Promise<string> {
		return this.element.text()
	}

	public async find(selector: string): Promise<IElementHandler | null> {
		const childElement = this.element.find(selector)
		return childElement.length > 0
			? new CheerioElementAdapter(childElement)
			: null
	}
}

export default CheerioElementAdapter
