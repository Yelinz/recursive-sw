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

  init() {
    this._super(...arguments)
    this.categorys = [
      { name: "People" },
      { name: "Starships" },
      { name: "Vehicles" },
      { name: "Species" },
      { name: "Planets" },
      { name: "Films" }
    ]
    this.filters = {
      people: {
        Gender: [
          { name: "Male" },
          { name: "Female" },
          { name: "Heraphrodite" },
          { name: "n/a" }
        ],
        "Eye Color": [{ name: "Blue" }, { name: "Brown" }]
      },
      starships: {
        Class: [
          { name: "Starfighter" },
          { name: "Corvette" },
          { name: "Star Destroyer" },
          { name: "Freighter" }
        ]
      },
      vehicles: {
        Class: [
          { name: "Wheeled" },
          { name: "Repulsorcraft" },
          { name: "Starfighter" }
        ]
      },
      species: {
        Designation: [{ name: "Sentient" }, { name: "Reptillian" }]
      },
      planets: {
        Terrain: [
          { name: "Desert" },
          { name: "Grasslands" },
          { name: "Mountains" },
          { name: "Jungle" },
          { name: "Rainforests" }
        ]
      },
      films: {
        Producer: [
          { name: "Rick McCallum" },
          { name: "Goerge Lucas" },
          { name: "Gray Krutz" }
        ]
      }
    }
    this.set("activeFilters", [])
  },

  setSearch(value) {
    this.set("search", value)
  },

  categoryWithSelected: computed(
    "people",
    "starships",
    "vehicles",
    "species",
    "planets",
    "films",
    "categorys.@each.name",
    {
      get() {
        return this.get("categorys").map(({ name }) => ({
          name,
          checked: this.get(name.toLowerCase())
        }))
      }
    }
  ),

  filteredModel: computed("activeFilters.[]", {
    get() {
      let model = this.get("model")
      if (this.get("activeFilters").length !== 0) {
        this.get("activeFilters").forEach(name => {
          let activeFilterName = name.toLowerCase()
          let category
          let filterKey
          Object.entries(this.get("filters")).forEach(filterCategory => {
            Object.entries(filterCategory[1]).forEach(filters => {
              filters[1].forEach(filterNameObj => {
                if (filterNameObj.name.toLowerCase() === activeFilterName) {
                  category = filterCategory[0]
                  filterKey = filters[0].replace(/ /g, "_").toLowerCase()
                }
              })
            })
          })
          model[category] = model[category].filterBy(
            filterKey,
            activeFilterName
          )
        })
      }
      this.get("target").send("refreshRoute")
      return model
    }
  }),

  actions: {
    handleSearch(value) {
      debounce(this, this.setSearch, value, 500)
    },

    toggleCategory(name) {
      const code = name.toLowerCase()
      this.set(code, !this.get(code))
    },

    setFilter(name) {
      if (this.get("activeFilters").includes(name)) {
        this.get("activeFilters").removeObject(name)
      } else {
        this.get("activeFilters").pushObject(name)
      }
    }
  }
})
