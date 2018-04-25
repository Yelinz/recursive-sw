import DS from "ember-data"

export default DS.Model.extend({
  name: DS.attr(),
  diameter: DS.attr(),
  rotation_period: DS.attr(),
  orbital_period: DS.attr(),
  gravity: DS.attr(),
  population: DS.attr(),
  climate: DS.attr(),
  terrain: DS.attr(),
  surface_water: DS.attr(),
  residents: DS.attr(),
  films: DS.attr()
})
