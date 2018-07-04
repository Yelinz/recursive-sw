import Controller from '@ember/controller'
import { debounce } from '@ember/runloop'
import { computed, getProperties, set } from '@ember/object'
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

  init() {
    this._super(...arguments)
    this.set('categorys', ENV.APP.categorys)
    this.set('filters', ENV.APP.filters)

    this.set('activeFilters', {
      normal: [],
      numeric: []
    })
    this.set('numericFilters', {
      observe: []
    })
    this.set('selectedFilters', [])
  },

  debounceSearch(value) {
    this.set('search', value)
  },

  updateNumericFilterObserve(data) {
    this.numericFilters.observe.forEach(pair => {
      if (pair.includes(data[0])) {
        this.numericFilters.observe.removeObject(pair)
      }
    })

    this.numericFilters.observe.pushObject(data)
  },

  setNumericFilters(type, name, value) {
    if (this.numericFilters[name] === undefined) {
      set(this.numericFilters, name, type ? ['gt', value] : [value, 0])
    } else {
      this.get(`numericFilters.${name}`)[type] = value
    }
    this.updateNumericFilterObserve(
      type ? [name, 'gt', value] : [name, value, 0]
    )
  },

  /*
   * Function for searching out the Filter Name, Filter Category and Category
   * which are defined in the filters Object.
   *
   * Returns information about the filters or the filtered model
   */
  getFilterInfo(mode) {
    let resultObj = {},
      filterInfo = [],
      model = this.model
    Object.values(this.activeFilters).forEach((filterType, type) => {
      let filter, category, filterCategory, filteredModel
      let potentialResult = true
      filterType.forEach(name => {
        filter = name.toLowerCase()
        Object.entries(this.filters).forEach(categoryFilter => {
          Object.entries(categoryFilter[1]).forEach(filters => {
            filters[1].forEach(filterName => {
              if (
                (typeof filterName === 'string'
                  ? filterName.toLowerCase()
                  : filterName.name.toLowerCase()) === filter
              ) {
                category = categoryFilter[0]
                filterCategory = filters[0].replace(/ /g, '_').toLowerCase()
                if (filterInfo.every(e => e[0] !== filter)) {
                  filterInfo.push([filter, category, filterCategory])
                }
              }
            })
          })
        })

        if (mode) {
          if (resultObj[category] === undefined) resultObj[category] = []
          let obj = resultObj[category].length
            ? resultObj[category]
            : model[category]
          if (!type && filterType.length) {
            resultObj[category] = obj.filter(modelEntry => {
              if (modelEntry[filterCategory] === filter) {
                return true
              } else if (filterCategory !== 'gender') {
                return modelEntry[filterCategory].includes(filter)
              } else {
                return false
              }
            })
          } else if (type && potentialResult && filterType.length) {
            resultObj[category] = obj.filter(objEntry => {
              let num = parseInt(objEntry[filter])
              let numericFilter = this.get(`numericFilters.${filter}`)
              if (objEntry[filter] !== 'unkown') {
                switch (numericFilter[0]) {
                  case 'gt':
                    return num > parseInt(numericFilter[1])
                  case 'eq':
                    return num === parseInt(numericFilter[1])
                  case 'lt':
                    return num < parseInt(numericFilter[1])
                }
              }
            })
            if (resultObj[category].length === 0) potentialResult = false
          }
        }
      })
    })

    if (mode) {
      return resultObj
    } else {
      return filterInfo
    }
  },

  filteredModel: computed(
    'activeFilters.{normal,numeric}.[]',
    'selectedFilters.[]',
    'search',
    'people',
    'starships',
    'vehicles',
    'species',
    'planets',
    'films',
    {
      get() {
        let model = this.model,
          resultObj = {}
        if (
          this.activeFilters.normal.length ||
          this.activeFilters.numeric.length
        ) {
          resultObj = this.getFilterInfo(true)

          let clonedCategories = JSON.parse(JSON.stringify(this.categorys)).map(
            word => word.toLowerCase()
          )

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

  queryParamFilters: computed(
    'activeFilters.{normal,numeric}.[]',
    'numericFilters.observe.[]',
    {
      get() {
        let returnArr
        if (
          this.activeFilters.normal.length ||
          this.activeFilters.numeric.length
        ) {
          returnArr = []
          Object.values(this.filters).forEach(filter => {
            Object.values(filter).forEach(nameArr => {
              nameArr.forEach(filterName => {
                let name = filterName.name || filterName
                this.getFilterInfo(false)
                  .map(a => (a[0] = a[0].capitalize()))
                  .forEach(info => {
                    if (info === name) {
                      if (typeof filterName === 'string') {
                        returnArr.push(name)
                      } else if (typeof filterName === 'object') {
                        name = name.toLowerCase()
                        returnArr.push([
                          name,
                          ...this.get(`numericFilters.${name}`)
                        ])
                      }
                    }
                  })
              })
            })
          })
        } else {
          returnArr = this.selectedFilters
        }
        returnArr.forEach(name => {
          if (typeof name === 'string') {
            this.get('activeFilters.normal').addObject(name)
          } else {
            this.get('activeFilters.numeric').addObject(name[0])
            this.setNumericFilters(1, name[0], name[2])
            this.setNumericFilters(0, name[0], name[1])
            this.getFilterInfo(false).forEach(filterInfos => {
              this.get(`filters.${filterInfos[1]}.Numeric`).forEach(filter => {
                if (filter.name.toLowerCase() === name[0]) {
                  set(filter, 'value', name[2])
                }
              })
            })
          }
        })
        this.selectedFilters.setObjects(returnArr)
        return returnArr
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
        this.getFilterInfo(false).forEach(filter => {
          if (filter[1] === name && filter[2] !== 'numeric') {
            this.get('activeFilters.normal').removeObject(
              filter[0].capitalize()
            )
          } else {
            this.get('activeFilters.numeric').removeObject(filter[0])
          }
        })
      }
      this.toggleProperty(name)
    },

    toggleFilter(name) {
      if (this.get('activeFilters.normal').includes(name)) {
        this.get('activeFilters.normal').removeObject(name)
      } else {
        this.get('activeFilters.normal').pushObject(name)
      }

      if (!this.get('activeFilters.normal').length) {
        this.selectedFilters.clear()
      }
    },

    /*
     * Action when a Numeric Inputfield gets changed
     *
     * Triggers an update on the Computed Property of filteredModel
     * whenever an number changes, by adding and removing a pair of name and value
     * from numericFilter.observe
     *
     * Calls setNumericFilters to achieve numeric filter data mutation
     */
    valChange(name, value) {
      if (value === '') {
        if (this.get('activeFilters.numeric').includes(name)) {
          this.get('activeFilters.numeric').removeObject(name)
        }
      } else {
        if (!this.get('activeFilters.numeric').includes(name)) {
          this.get('activeFilters.numeric').pushObject(name)
        }
        this.setNumericFilters(1, name, value)
      }
    },

    selectType(type) {
      let nameTypeArr = type.toLowerCase().split('-')
      this.setNumericFilters(0, nameTypeArr[0], nameTypeArr[1])
    }
  }
})
