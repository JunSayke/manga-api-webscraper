import { AnyNode } from "domhandler"
import IExtractionRule from "./IExtractionRule"
import { Cheerio } from "cheerio"

class CheerioExtractionRule implements IExtractionRule {
	constructor(
		public name: string,
		public selector: string,
		private transform: (el: Cheerio<AnyNode>) => any
	) {}

	public extract(element: Cheerio<AnyNode>): any {
		return this.transform(element)
	}
}

export default CheerioExtractionRule
