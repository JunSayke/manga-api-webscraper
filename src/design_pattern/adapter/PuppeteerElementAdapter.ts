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
		const childElement = await this.element.$(selector)
		return childElement ? new PuppeteerElementAdapter(childElement) : null
	}
}

export default PuppeteerElementAdapter
