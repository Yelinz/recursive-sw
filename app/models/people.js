import DS from "ember-data"

export default DS.Model.extend({
  name: DS.attr(),
  height: DS.attr(),
  mass: DS.attr(),
  hair_color: DS.attr(),
  skin_color: DS.attr(),
  eye_color: DS.attr(),
  birth_year: DS.attr(),
  gender: DS.attr(),
  homeworld: DS.attr(),
  films: DS.attr(),
  species: DS.attr(),
  starships: DS.attr()
})
