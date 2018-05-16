import Inflector from "ember-inflector"

const inflector = Inflector.inflector

inflector.uncountable("people")
inflector.uncountable("films")
inflector.uncountable("starships")
inflector.uncountable("vehicles")
inflector.uncountable("planets")

export default {}
