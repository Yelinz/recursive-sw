import DS from "ember-data"

export default DS.Model.extend({
  name: DS.attr(),
  model: DS.attr(),
  starship_class: DS.attr(),
  manufacturer: DS.attr(),
  cost_in_credits: DS.attr(),
  length: DS.attr(),
  crew: DS.attr(),
  passengers: DS.attr(),
  max_atmosphering_speed: DS.attr(),
  hyperdrive_rating: DS.attr(),
  MGLT: DS.attr(),
  cargo_capacity: DS.attr(),
  consumables: DS.attr(),
  films: DS.attr(),
  pilots: DS.attr()
})
