import DS from "ember-data"

export default DS.Model.extend({
  name: DS.attr(),
  classification: DS.attr(),
  designation: DS.attr(),
  average_height: DS.attr(),
  average_lifespan: DS.attr(),
  eye_colors: DS.attr(),
  hair_colors: DS.attr(),
  skin_colors: DS.attr(),
  language: DS.attr(),
  homeworld: DS.attr(),
  people: DS.attr(),
  films: DS.attr()
})
