import { Cheerio } from "cheerio"
import { AnyNode } from "domhandler"
import INodeElement from "./INodeElement"

class CheerioElementAdapter implements INodeElement {
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

	public async find(selector: string): Promise<INodeElement | null> {
		const childElement = this.element.find(selector)
		return childElement.length > 0
			? new CheerioElementAdapter(childElement)
			: null
	}

	public async findAll(selector: string): Promise<INodeElement[] | null> {
		if (!selector) {
			return null
		}

		const childElements = this.element.find(selector).toArray()
		return childElements.map(
			(childElement) =>
				new CheerioElementAdapter(this.element.constructor(childElement))
		)
	}
}

export default CheerioElementAdapter
