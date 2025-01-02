import { ElementHandle } from "puppeteer"
import IExtractionRule from "./IExtractionRule"

class PuppeteerExtractionRule implements IExtractionRule {
	constructor(
		public name: string,
		public selector: string,
		private transform: (el: ElementHandle) => Promise<any>
	) {}

	public async extract(element: ElementHandle): Promise<any> {
		return this.transform(element)
	}
}

export default PuppeteerExtractionRule
