interface IExtractionRule {
	selector: string
	name: string
	extract(element: any): any
}

export default IExtractionRule
