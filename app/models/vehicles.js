import attr from "ember-data/attr"
import Model from "ember-data/model"
import { hasMany } from "ember-data/relationships"

export default Model.extend({
  name: attr("string"),
  model: attr("string"),
  vehicle_class: attr("string"),
  manufacturer: attr("string"),
  length: attr("string"),
  cost_in_credits: attr("string"),
  crew: attr("string"),
  passengers: attr("string"),
  max_atmosphering_speed: attr("string"),
  cargo_capacity: attr("string"),
  consumables: attr("string"),

  pilots: hasMany("people"),
  films: hasMany("films")
})
