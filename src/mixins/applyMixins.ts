// https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern

// function applyMixins(derivedCtor: any, constructors: any[]) {
// 	constructors.forEach((baseCtor) => {
// 		Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
// 			Object.defineProperty(
// 				derivedCtor.prototype,
// 				name,
// 				Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
// 					Object.create(null)
// 			)
// 		})
// 	})
// }

// The function that applies the mixins
function applyMixins(derivedCtor: any, constructors: any[]) {
	constructors.forEach((baseCtor) => {
		// Initialize the constructor for each mixin
		Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
			// Skip
			if (name !== "constructor") {
				return
			}

			// Copy methods from mixin to the derived class
			Object.defineProperty(
				derivedCtor.prototype,
				name,
				Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
					Object.create(null)
			)
		})

		// Initialize the constructor logic from each mixin
		Object.assign(derivedCtor.prototype, new baseCtor())
	})
}

export default applyMixins
