import IExtractionRule from "../../../utils/IExtractionRule"

interface IWebscraper {
	fetchContent(url: string): Promise<string>
	querySelector(content: string, selector: string): any[]
	scrape(url: string, rules: IExtractionRule[]): Promise<Record<string, any>>
}

export default IWebscraper
