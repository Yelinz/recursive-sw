import attr from "ember-data/attr"
import Model from "ember-data/model"
import { belongsTo, hasMany } from "ember-data/relationships"

export default Model.extend({
  name: attr("string"),
  height: attr("string"),
  mass: attr("string"),
  hair_color: attr("string"),
  skin_color: attr("string"),
  eye_color: attr("string"),
  birth_year: attr("string"),
  gender: attr("string"),

  species: hasMany("species"),
  homeworld: belongsTo("planets"),
  starships: hasMany("starships"),
  vehicles: hasMany("vehicles"),
  films: hasMany("films")
})
