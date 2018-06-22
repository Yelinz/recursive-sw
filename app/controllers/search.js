import Controller from '@ember/controller'
import { debounce } from '@ember/runloop'
import { computed, getProperties, set } from '@ember/object'

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
        Gender: ['Male', 'Female', 'Hermaphrodite', 'N/a'],
        'Eye Color': ['Blue', 'Brown', 'Orange', 'Hazel', 'Red'],
        Numeric: [{ name: 'Height', value: 0 }, { name: 'Mass', value: 0 }]
      },
      starships: {
        'Starship Class': ['Starfighter', 'Corvette', 'Star Destroyer'],
        Numeric: [{ name: 'Crew', value: 0 }, { name: 'Length', value: 0 }]
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
    this.set('activeFilters', { normal: [], numeric: [] })
    this.set('numericFilters', { observe: [] })
  },

  debounceSearch(value) {
    this.set('search', value)
  },

  updateNumericFilterObserve(data) {
    this.get('numericFilters.observe').forEach(pair => {
      if (pair.includes(data[0])) {
        this.get('numericFilters.observe').removeObject(pair)
      }
    })

    this.get('numericFilters.observe').pushObject(data)
  },

  setNumericFilters(type, name, value) {
    if (this.get('numericFilters')[name] === undefined) {
      set(this.get('numericFilters'), name, type ? ['gt', value] : [value, 0])
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
      model = this.get('model')
    Object.values(this.get('activeFilters')).forEach(
      (filterType, type, activeFilterArr) => {
        let filter, category, filterCategory, filteredModel
        filterType.forEach((name, index, filterArr) => {
          filter = name.toLowerCase()
          Object.entries(this.get('filters')).forEach(categoryFilter => {
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
            } else {
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
              resultObj[category] = filteredModel || []
            }
          }
        })
      }
    )

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
        let model = this.get('model'),
          resultObj = {}
        if (
          this.get('activeFilters.normal').length ||
          this.get('activeFilters.numeric').length
        ) {
          let clonedCategories = JSON.parse(
            JSON.stringify(this.get('categorys'))
          ).map(word => word.toLowerCase())
          resultObj = this.getFilterInfo(true)

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
        this.getFilterInfo(false).forEach(filter => {
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
      if (this.get('activeFilters.normal').includes(name)) {
        this.get('activeFilters.normal').removeObject(name)
      } else {
        this.get('activeFilters.normal').pushObject(name)
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
