import DS from "ember-data"

export default DS.JSONSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id) {
    payload.id = id
    return this._super(...arguments)
  }
})
