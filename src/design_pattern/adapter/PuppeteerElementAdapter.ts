import { ElementHandle } from "puppeteer"
import IElementHandler from "./IElementHandler"

class PuppeteerElementAdapter implements IElementHandler {
	private element: ElementHandle

	constructor(element: ElementHandle) {
		this.element = element
	}

	public async attr(name: string): Promise<string | null> {
		return await this.element.evaluate(
			(el, attrName) => el.getAttribute(attrName),
			name
		)
	}

	public async text(): Promise<string> {
		return await this.element.evaluate((el) => el.textContent || "")
	}

	public async find(selector: string): Promise<IElementHandler | null> {
		if (!selector) {
			return null
		}

		const childElement = await this.element.$(selector)
		console.log(selector, childElement)

		return childElement ? new PuppeteerElementAdapter(childElement) : null
	}

	public async findAll(selector: string): Promise<IElementHandler[]> {
		if (!selector) {
			return []
		}

		const childElements = await this.element.$$(selector)
		return childElements.map(
			(childElement) => new PuppeteerElementAdapter(childElement)
		)
	}
}

export default PuppeteerElementAdapter
