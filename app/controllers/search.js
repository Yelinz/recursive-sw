import Controller from '@ember/controller'
import { debounce } from '@ember/runloop'
import { computed, getProperties, set } from '@ember/object'
import MutableArray from '@ember/array/mutable'

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
        Gender: ['Male', 'Female', 'Hermaphrodite', 'N/a'],
        'Eye Color': ['Blue', 'Brown', 'Orange', 'Hazel', 'Red'],
        Numeric: [
          {
            name: 'Height',
            value: 0
          },
          {
            name: 'Mass',
            value: 0
          }
        ]
      },
      starships: {
        'Starship Class': ['Starfighter', 'Corvette', 'Star Destroyer'],
        Numeric: [
          {
            name: 'Crew',
            value: 0
          },
          {
            name: 'Length',
            value: 0
          }
        ]
      },
      vehicles: {
        'Vehicle Class': ['Wheeled', 'Repulsorcraft', 'Starfighter']
      },
      species: {
        Classification: ['Mammal', 'Artificial', 'Unknown', 'Reptile']
      },
      planets: {
        Terrain: ['Desert', 'Grasslands', 'Mountains', 'Jungles', 'Ocean']
      },
      films: {
        Producer: ['Rick McCallum', 'George Lucas', 'Gray Krutz']
      }
    })
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
      filterType.forEach((name, index, filterArr) => {
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
                filterInfo[index] = [filter, category, filterCategory]
              }
            })
          })
        })

        if (mode) {
          if (resultObj[category] === undefined) resultObj[category] = []
          if (!type && filterArr.length) {
            filteredModel = model[category].filter(modelEntry => {
              if (modelEntry[filterCategory] === filter) {
                return true
              } else if (filterCategory !== 'gender') {
                return modelEntry[filterCategory].includes(filter)
              } else {
                return false
              }
            })
            resultObj[category] = resultObj[category].concat(filteredModel)
          } else if (potentialResult && filterArr.length) {
            let obj = resultObj[category].length
              ? resultObj[category]
              : model[category]
            filteredModel = obj.filter(objEntry => {
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
            if (filteredModel.length === 0) potentialResult = false
            resultObj[category] = filteredModel
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
    'numericFilters.observe.[]',
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
                this.getFilterInfo(false).forEach(infoArr => {
                  if (
                    infoArr[0] ===
                    (typeof filterName === 'string'
                      ? filterName.toLowerCase()
                      : filterName.name.toLowerCase())
                  ) {
                    if (typeof filterName === 'string') {
                      returnArr.push(filterName)
                    } else if (typeof filterName === 'object') {
                      returnArr.push([
                        filterName.name.toLowerCase(),
                        ...this.get(
                          `numericFilters.${filterName.name.toLowerCase()}`
                        )
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
            this.activeFilters.normal.addObject(name)
          } else {
            //also needs to push numbers into the numericfiler array
            this.activeFilters.numeric.addObject(name[0])
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
            this.activeFilters.normal.removeObject(
              filter[0].charAt(0).toUpperCase() + filter[0].slice(1)
            )
          } else {
            this.activeFilters.numeric.removeObject(filter[0])
          }
        })
      }
      this.toggleProperty(name)
    },

    toggleFilter(name) {
      if (this.activeFilters.normal.includes(name)) {
        this.activeFilters.normal.removeObject(name)
      } else {
        this.activeFilters.normal.pushObject(name)
      }

      if (!this.activeFilters.normal.length) {
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
      if (value === '' || value === '0') {
        if (this.activeFilters.numeric.includes(name)) {
          this.activeFilters.numeric.removeObject(name)
        }
      } else {
        if (!this.activeFilters.numeric.includes(name)) {
          this.activeFilters.numeric.pushObject(name)
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
