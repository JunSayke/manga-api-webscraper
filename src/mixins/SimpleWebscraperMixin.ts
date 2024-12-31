import AbstractWebscraper from "./AbstractWebscraperMixin"
// import Constructor from "./Constructor"

// function SimpleWebscraperMixin<TBase extends Constructor>(Base?: TBase) {
// 	// Default base class if none is provided
// 	const baseClass =
// 		Base ||
// 		class {
// 			constructor() {
// 				// Default constructor for the case when no base class is provided
// 			}
// 		}

// 	return class SimpleWebscraperMixin extends baseClass {
// 		constructor(...args: any[]) {
// 			super(...args)
// 			console.log("SimpleWebscraperMixin constructor")
// 		}
// 	}
// }

class SimpleWebscraperMixin extends AbstractWebscraper {
	constructor() {
		super()
		console.log("SimpleWebscraperMixin constructor")
	}
}

export default SimpleWebscraperMixin
