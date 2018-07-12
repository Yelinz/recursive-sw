import Route from '@ember/routing/route'
import { hash } from 'rsvp'
import ENV from 'recursive-sw/config/environment'

export default Route.extend({
  queryParams: {
    search: { refreshModel: true },
    people: { refreshModel: true },
    starships: { refreshModel: true },
    vehicles: { refreshModel: true },
    species: { refreshModel: true },
    planets: { refreshModel: true },
    films: { refreshModel: true },
    selectedFilters: { refreshModel: true }
  },

  model(params) {
    let searchResult = {}

    if (params.search !== '') {
      ENV.APP.categories.forEach(category => {
        let name = category.toLowerCase()
        if (params[name]) {
          searchResult[name] = this.store.query(name, {
            search: params.search
          })
        }
      })
    }
    return hash(searchResult)
  }
})
