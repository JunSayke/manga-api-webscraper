// Purpose: to seamlessly switch between ElementHandler (Puppeteer) and AnyNode (Cheerio)
// Modify as needed
interface IElementHandler {
	attr(name: string): Promise<string | null>
	text(): Promise<string>
	find(selector: string): Promise<IElementHandler | null>
	// Add more methods as needed
}

export default IElementHandler
