import DS from 'ember-data'

export default DS.JSONSerializer.extend({
  normalizeFindRecordResponse(store, primaryModelClass, payload, id) {
    payload.id = id

    // Parses Urls for Relationships
    Object.entries(payload).forEach(entry => {
      let urlArr = []
      if (typeof entry[1] === typeof [] && entry[1] !== null) {
        entry[1].forEach(url => {
          urlArr.push(url.split('/')[5])
        })
        payload[entry[0]] = urlArr
      }
    })

    if (typeof payload.homeworld === typeof '') {
      payload.homeworld = payload.homeworld.split('/')[5]
    }

    return this._super(...arguments)
  },

  normalizeQueryResponse(store, primaryModelClass, payload, id) {
    if (payload.hasOwnProperty('count')) {
      payload.results.forEach(element => {
        element.id = element.url.split('/')[5]
        if (
          primaryModelClass.modelName === 'starships' ||
          primaryModelClass.modelName === 'vehicles' ||
          primaryModelClass.modelName === 'films'
        ) {
          Object.entries(element).forEach(valuePair => {
            if (
              valuePair[0] === 'starship_class' ||
              valuePair[0] === 'vehicle_class' ||
              valuePair[0] === 'producer'
            ) {
              element[valuePair[0]] = valuePair[1].toLowerCase()
            }
          })
        } else if (primaryModelClass.modelName === 'people') {
          Object.entries(element).forEach(valuePair => {
            if (valuePair[0] === 'mass') {
              element[valuePair[0]] = valuePair[1].replace(/,/g, '')
            }
          })
        }
      })
      return this._super(store, primaryModelClass, payload.results, id)
    } else {
      return this._super(...arguments)
    }
  }
})
