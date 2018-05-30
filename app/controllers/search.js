import Controller from "@ember/controller"
import { debounce } from "@ember/runloop"
import { computed } from "@ember/object"

export default Controller.extend({
  queryParams: [
    "search",
    "people",
    "starships",
    "vehicles",
    "species",
    "planets",
    "films"
  ],
  search: "",
  people: true,
  starships: false,
  vehicles: false,
  species: false,
  planets: false,
  films: false,

  categorys: [
    { code: "people", name: "People" },
    { code: "starships", name: "Starships" },
    { code: "vehicles", name: "Vehicles" },
    { code: "species", name: "Species" },
    { code: "planets", name: "Planets" },
    { code: "films", name: "Films" }
  ],

  init() {
    this._super(...arguments)
  },

  setSearch(value) {
    this.set("search", value)
  },

  categoryWithSelected: Ember.computed(
    "people",
    "starships",
    "vehicles",
    "species",
    "planets",
    "films",
    "categorys.@each.code",
    {
      get() {
        return this.get("categorys").map(({ code, name }) => ({
          code,
          name,
          checked: this.get(code)
        }))
      }
    }
  ),

  actions: {
    handleSearch(value) {
      debounce(this, this.setSearch, value, 500)
    },

    toggleCategory(category) {
      const { code } = category
      this.set(code, !this.get(code))
    }
  }
})
