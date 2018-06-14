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
        Gender: ['Male', 'Female', 'Heraphrodite', 'N/a'],
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

  getFilterInfo(mode) {
    let model = this.get('model')
    let filterInfo = []
    let resultObj = {}
    this.get('activeFilters').forEach((name, index) => {
      filterInfo[index] = []
      filterInfo[index].push(name.toLowerCase())
      Object.entries(this.get('filters')).forEach(filterCategory => {
        Object.entries(filterCategory[1]).forEach(filters => {
          filters[1].forEach(filterNameObj => {
            if (filterNameObj.toLowerCase() === filterInfo[index][0]) {
              filterInfo[index].push(filterCategory[0])
              filterInfo[index].push(
                filters[0].replace(/ /g, '_').toLowerCase()
              )
            }
          })
        })
      })
      if (resultObj[filterInfo[index][1]] === undefined) {
        resultObj[filterInfo[index][1]] = model[filterInfo[index][1]].filterBy(
          filterInfo[index][2],
          filterInfo[index][0]
        )
      } else {
        resultObj[filterInfo[index][1]] = resultObj[
          filterInfo[index][1]
        ].concat(
          model[filterInfo[index][1]].filterBy(
            filterInfo[index][2],
            filterInfo[index][0]
          )
        )
      }
    })
    switch (mode) {
      case 'model':
        return resultObj
      case 'info':
        return filterInfo
      default:
        return resultObj
    }
  },

  filteredModel: computed(
    'activeFilters.[]',
    'search',
    'people',
    'starships',
    'vehicles',
    'species',
    'planets',
    'films',
    {
      get() {
        let model = this.get('model')
        let resultObj = {}
        if (this.get('activeFilters').length) {
          let clonedCategories = JSON.parse(
            JSON.stringify(this.get('categorys'))
          ).map(w => w.toLowerCase())
          resultObj = this.getFilterInfo('model')

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
    }
  ),

  actions: {
    handleSearch(value) {
      debounce(this, this.debounceSearch, value, 500)
    },

    toggleCategory(name) {
      name = name.toLowerCase()
      if (this.get(name)) {
        this.getFilterInfo('info').forEach(filter => {
          if (filter[1] === name) {
            this.activeFilters.removeObject(
              filter[0].charAt(0).toUpperCase() + filter[0].slice(1)
            )
          }
        })
      }
      this.toggleProperty(name)
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
