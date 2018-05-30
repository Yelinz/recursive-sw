import Route from "@ember/routing/route"
import RSVP from "rsvp"

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
          if (this.controllerFor("search").get(obj.code)) {
            Object.defineProperty(searchResult, obj.code, {
              value: this.get("store").query(obj.code, {
                search: params.search
              })
            })
          }
        })
    }
    return searchResult
  }
})
