import attr from "ember-data/attr"
import Model from "ember-data/model"
import { hasMany } from "ember-data/relationships"

export default Model.extend({
  title: attr("string"),
  episode_id: attr("string"),
  opening_crawl: attr("string"),
  director: attr("string"),
  producer: attr("string"),
  release_date: attr("string"),

  species: hasMany("species"),
  starships: hasMany("starships"),
  vehicles: hasMany("vehicles"),
  characters: hasMany("people"),
  planets: hasMany("planets")
})
