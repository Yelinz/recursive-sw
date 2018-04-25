import DS from "ember-data"

export default DS.Model.extend({
  name: DS.attr(),
  model: DS.attr(),
  vehicle_class: DS.attr(),
  manufacturer: DS.attr(),
  length: DS.attr(),
  cost_in_credits: DS.attr(),
  crew: DS.attr(),
  passengers: DS.attr(),
  max_atmosphering_speed: DS.attr(),
  cargo_capacity: DS.attr(),
  consumables: DS.attr(),
  films: DS.attr(),
  pilots: DS.attr(),
  type_vehicles: DS.attr()
})
