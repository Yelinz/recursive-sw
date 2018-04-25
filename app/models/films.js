import DS from "ember-data"

export default DS.Model.extend({
  title: DS.attr(),
  episode_id: DS.attr(),
  opening_crawl: DS.attr(),
  director: DS.attr(),
  producer: DS.attr(),
  release_date: DS.attr(),
  species: DS.attr(),
  starships: DS.attr(),
  vehicles: DS.attr(),
  characters: DS.attr(),
  planets: DS.attr()
})
