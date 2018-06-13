import Controller from '@ember/controller'
import { debounce } from '@ember/runloop'
import { computed, getProperties } from '@ember/object'

export default Controller.extend({
  queryParams: [
    'search',
    'people',
    'starships',
    'vehicles',
    'species',
    'planets',
    'films'
  ],
  search: '',
  people: true,
  starships: false,
  vehicles: false,
  species: false,
  planets: false,
  films: false,

  init() {
    this._super(...arguments)
    this.set('categorys', [
      'People',
      'Starships',
      'Vehicles',
      'Species',
      'Planets',
      'Films'
    ])
    this.set('filters', {
      people: {
        Gender: ['Male', 'Female', 'Heraphrodite', 'n/a'],
        'Eye Color': ['Blue', 'Brown', 'Orange', 'Hazel', 'Red']
      },
      starships: {
        Class: ['Starfighter', 'Corvette', 'Star Destroyer', 'Freighter']
      },
      vehicles: {
        'Vehicle Class': ['Wheeled', 'Repulsorcraft', 'Starfighter']
      },
      species: {
        Classification: ['Mammal', 'Artificial', 'Unknown', 'Reptile']
      },
      planets: {
        Terrain: ['Desert', 'Grasslands', 'Mountains', 'Jungle', 'Rainforests']
      },
      films: {
        Producer: ['Rick McCallum', 'Goerge Lucas', 'Gray Krutz']
      }
    })
    this.set('activeFilters', [])
  },

  debounceSearch(value) {
    this.set('search', value)
  },

  filteredModel: computed('activeFilters.[]', 'search', {
    get() {
      let model = this.get('model')
      let resultObj = {}
      if (this.get('activeFilters').length) {
        let clonedCategories = JSON.parse(
          JSON.stringify(this.get('categorys'))
        ).map(w => w.toLowerCase())
        this.get('activeFilters').forEach(name => {
          let activeFilterName = name.toLowerCase()
          let category
          let filterKey
          Object.entries(this.get('filters')).forEach(filterCategory => {
            Object.entries(filterCategory[1]).forEach(filters => {
              filters[1].forEach(filterNameObj => {
                if (filterNameObj.toLowerCase() === activeFilterName) {
                  category = filterCategory[0]
                  filterKey = filters[0].replace(/ /g, '_').toLowerCase()
                }
              })
            })
          })
          if (resultObj[category] === undefined) {
            resultObj[category] = model[category].filterBy(
              filterKey,
              activeFilterName
            )
          } else {
            resultObj[category] = resultObj[category].concat(
              model[category].filterBy(filterKey, activeFilterName)
            )
          }
        })

        clonedCategories.forEach((category, index) => {
          if (resultObj.hasOwnProperty(category)) {
            clonedCategories.splice(index, 1)
          }
        })
        resultObj = Object.assign(
          {},
          resultObj,
          getProperties(model, clonedCategories)
        )
      } else {
        resultObj = model
      }
      return resultObj
    }
  }),

  actions: {
    handleSearch(value) {
      debounce(this, this.debounceSearch, value, 500)
    },

    toggleCategory(name) {
      this.toggleProperty(name.toLowerCase())
    },

    toggleFilter(name) {
      if (this.get('activeFilters').includes(name)) {
        this.get('activeFilters').removeObject(name)
      } else {
        this.get('activeFilters').pushObject(name)
      }
    }
  }
})
