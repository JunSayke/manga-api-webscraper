// https://www.typescriptlang.org/docs/handbook/mixins.html#constrained-mixins
// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

// In the case of a super call
// https://stackoverflow.com/questions/72897219/is-there-a-wasy-to-emulate-super-with-mixins-in-typescript

// Apply a constraint to the Constructor type to ensure that it is a class of some type.
type Constructor = new (...args: any[]) => {}

export default Constructor
