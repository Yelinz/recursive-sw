import DS from "ember-data"

export default DS.JSONSerializer.extend({
  normalizeFindRecordResponse(
    store,
    primaryModelClass,
    payload,
    id,
    requestType
  ) {
    payload.id = id

    // Parses Urls for Relationships
    Object.entries(payload).forEach(entry => {
      let urlArr = []
      if (typeof entry[1] === typeof [] && entry[1] !== null) {
        entry[1].forEach(url => {
          urlArr.push(url.split("/")[5])
        })
        payload[entry[0]] = urlArr
      }
    })

    if (typeof payload.homeworld === typeof "") {
      payload.homeworld = payload.homeworld.split("/")[5]
    }

    let supah = this._super(...arguments)
    //console.log(supah)
    return supah
    //return this._super(...arguments)
  },

  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    /*
    if (payload.results.length !== 0) {
      id = 1
      payload.results.forEach(element => {
        element.id = element.url.split("/")[5]
      })
      payload = { attributes: payload, id: 1, type: "search" }
      let supah = this._super(...arguments)
      console.log(supah)
      return supah
    }
    */
    if (payload.hasOwnProperty("count")) {
      console.log(...arguments)
      payload.results.forEach(element => {
        element.id = element.url.split("/")[5]
      })
      return this._super(
        store,
        primaryModelClass,
        payload.results,
        id,
        requestType
      )
    } else {
      return this._super(...arguments)
    }
  }
})
