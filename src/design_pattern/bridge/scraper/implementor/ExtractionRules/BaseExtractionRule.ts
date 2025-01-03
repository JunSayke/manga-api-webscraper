import INodeElement from "../../../../adapter/INodeElement"
import IExtractionRule from "./IExtractionRule"

class BaseExtractionRule implements IExtractionRule {
	constructor(
		public name: string,
		public selector: string,
		private transform: (el: INodeElement) => any
	) {}

	public async extract(element: INodeElement): Promise<any> {
		return await this.transform(element)
	}
}

export default BaseExtractionRule
