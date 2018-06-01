import Route from "@ember/routing/route"

export default Route.extend({
  queryParams: {
    search: { refreshModel: true },
    people: { refreshModel: true },
    starships: { refreshModel: true },
    vehicles: { refreshModel: true },
    species: { refreshModel: true },
    planets: { refreshModel: true },
    films: { refreshModel: true }
  },

  model(params) {
    let searchResult = {}

    if (params.search !== "") {
      this.controllerFor("search")
        .get("categorys")
        .forEach(obj => {
          let name = obj.name.toLowerCase()
          if (params[name]) {
            Object.defineProperty(searchResult, name, {
              value: this.get("store").query(name, {
                search: params.search
              }),
              writable: true
            })
          }
        })
    }
    return searchResult
  },

  actions: {
    refreshRoute() {
      this.refresh()
    }
  }
})
