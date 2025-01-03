import { ElementHandle } from "puppeteer"
import INodeElement from "./INodeElement"

class PuppeteerElementAdapter implements INodeElement {
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

	public async find(selector: string): Promise<INodeElement | null> {
		if (!selector) {
			return null
		}

		const childElement = await this.element.$(selector)

		return childElement ? new PuppeteerElementAdapter(childElement) : null
	}

	public async findAll(selector: string): Promise<INodeElement[] | null> {
		if (!selector) {
			return null
		}

		const childElements = await this.element.$$(selector)
		return childElements.map(
			(childElement) => new PuppeteerElementAdapter(childElement)
		)
	}
}

export default PuppeteerElementAdapter
