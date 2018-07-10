import Controller from '@ember/controller'
import { debounce } from '@ember/runloop'
import { computed } from '@ember/object'
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
  categorys: ENV.APP.categorys,
  filters: ENV.APP.filters,

  init() {
    this._super(...arguments)
    this.set('selectedFilters', [])
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
    this.selectedFilters.any(filter => {
      if (filter[0] === name) {
        this.selectedFilters.removeObject(filter)
        if (value !== '') {
          filter[n + 1] = value
          this.selectedFilters.addObject(filter)
        }
        return true
      }
    })
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
    this.selectedFilters.forEach(name_ => {
      if (notSpecific) {
        name = (typeof name_ === 'string' ? name_ : name_[0]).toLowerCase()
      }
      Object.entries(this.filters).any(categoryFilter => {
        return Object.entries(categoryFilter[1]).any(filters => {
          return filters[1].any(filterName => {
            filterName = filterName.name || filterName
            if (filterName.toLowerCase() === name) {
              if (filterInfo.every(entry => entry[0] !== name)) {
                filterInfo.push([
                  name,
                  categoryFilter[0],
                  filters[0].underscore()
                ])
              }
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
            this.selectedFilters.removeObject(filter[0].capitalize())
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
