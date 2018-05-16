import attr from "ember-data/attr"
import Model from "ember-data/model"
import { belongsTo, hasMany } from "ember-data/relationships"

export default Model.extend({
  name: attr("string"),
  classification: attr("string"),
  designation: attr("string"),
  average_height: attr("string"),
  average_lifespan: attr("string"),
  eye_colors: attr("string"),
  hair_colors: attr("string"),
  skin_colors: attr("string"),
  language: attr("string"),

  homeworld: belongsTo("planets"),
  people: hasMany("people"),
  films: hasMany("films")
})
