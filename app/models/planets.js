import attr from "ember-data/attr"
import Model from "ember-data/model"
import { hasMany } from "ember-data/relationships"

export default Model.extend({
  name: attr("string"),
  diameter: attr("string"),
  rotation_period: attr("string"),
  orbital_period: attr("string"),
  gravity: attr("string"),
  population: attr("string"),
  climate: attr("string"),
  terrain: attr("string"),
  surface_water: attr("string"),

  residents: hasMany("people"),
  films: hasMany("films")
})
