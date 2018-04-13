import DS from "ember-data"

export default DS.JSONSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id) {
    payload.type_vehicles = true
    payload.id = id
    return this._super(...arguments)
  }
})
