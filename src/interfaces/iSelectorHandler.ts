import { Cheerio } from "cheerio"
import { AnyNode } from "domhandler"

interface ISelectorHandler {
	selector: string
	handler: (element: Cheerio<AnyNode>) => any
}

export default ISelectorHandler
