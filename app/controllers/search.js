import Controller from '@ember/controller'
import { debounce } from '@ember/runloop'
import EmberObject, { computed } from '@ember/object'
import { underscore, capitalize } from '@ember/string'
import ENV from 'recursive-sw/config/environment'

export default Controller.extend({
  queryParams: [
    'search',
    'people',
    'starships',
    'vehicles',
    'species',
    'planets',
    'films',
    'selectedFilters'
  ],
  search: '',
  people: true,
  starships: false,
  vehicles: false,
  species: false,
  planets: false,
  films: false,
  categorys: computed(() => ENV.APP.categories),

  init() {
    this._super(...arguments)
    this.set('selectedFilters', [])
    this.set('filters', EmberObject.create(ENV.APP.filters))
  },

  debounceSearch(value) {
    this.set('search', value)
  },

  setNumericSelected(n, name, value) {
    if (!this.selectedFilters.filter(filter => filter[0] === name).length) {
      this.selectedFilters.addObject(
        n ? [name, 'gt', value] : [name, value, '0']
      )
    }
    let filter = this.selectedFilters.find(filter => filter[0] === name)
    this.selectedFilters.removeObject(filter)
    if (value !== '') {
      filter[n + 1] = value
      this.selectedFilters.addObject(filter)
    }
  },

  /*
   * Function for searching out the Filter Name, Filter Category and Category
   * which are defined in the filters Object.
   *
   * Returns information about the filters
   */
  getFilterInfo(name) {
    let filterInfo = [],
      notSpecific = name === undefined ? true : false
    this.selectedFilters.forEach(nameSelected => {
      if (notSpecific) {
        name = (typeof nameSelected === 'string'
          ? nameSelected
          : nameSelected[0]
        ).toLowerCase()
      }

      Object.entries(this.filters).some(categoryFilter => {
        return Object.entries(categoryFilter[1]).some(filters => {
          return filters[1].some(filterName => {
            filterName = filterName.name || filterName
            if (
              filterName.toLowerCase() === name &&
              filterInfo.every(entry => entry[0] !== name)
            ) {
              filterInfo.push([name, categoryFilter[0], underscore(filters[0])])
              return true
            }
          })
        })
      })
    })
    return filterInfo
  },

  categories: computed(
    'people',
    'starships',
    'vehicles',
    'species',
    'planets',
    'films',
    function() {
      let categoryObj = {}
      this.categorys.forEach(name => {
        categoryObj[name] = this.get(`${name.toLowerCase()}`)
      })
      return categoryObj
    }
  ),

  actions: {
    handleSearch(value) {
      debounce(this, this.debounceSearch, value, 500)
    },

    toggleCategory(name) {
      name = name.toLowerCase()
      if (this.get(name)) {
        this.getFilterInfo().forEach(filter => {
          if (filter[1] === name && filter[2] !== 'numeric') {
            this.selectedFilters.removeObject(capitalize(filter[0]))
          } else if (filter[1] === name && filter[2] === 'numeric') {
            this.selectedFilters.forEach(item => {
              if (typeof item === 'object' && filter[0] === item[0]) {
                this.selectedFilters.removeObject(item)
              }
            })
          }
        })
      }
      this.toggleProperty(name)
    },

    toggleFilter(name) {
      if (this.selectedFilters.includes(name)) {
        this.selectedFilters.removeObject(name)
      } else {
        this.selectedFilters.addObject(name)
      }
    },

    valChange(name, value) {
      this.setNumericSelected(1, name, value)
    },

    selectType(nameType) {
      let [name, type] = nameType.toLowerCase().split('-')
      this.setNumericSelected(0, name, type)
    }
  }
})
