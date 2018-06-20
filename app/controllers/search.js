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
        Gender: ['Male', 'Female', 'Heraphrodite', 'N/a'],
        'Eye Color': ['Blue', 'Brown', 'Orange', 'Hazel', 'Red'],
        Numeric: [{ name: 'Height', value: 0 }, { name: 'Mass', value: 0 }]
      },
      starships: {
        'Starship Class': ['Starfighter', 'Corvette', 'Star Destroyer']
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
    this.set('activeFilters', [])
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
      this.get(`numericFilters.${name}`)[type ? 1 : 0] = value
    }
    this.updateNumericFilterObserve(
      type ? [name, 'gt', value] : [name, value, 0]
    )
  },

  /*
   * Function for searching out the Filter Name, Filter Category and Category
   * which are defined in the filters Object.
   *
   * Returns the information or the filtered model
   */
  getFilterInfo(mode) {
    let filter,
      category,
      filterName,
      filteredModel,
      resultObj = {},
      filterInfo = [],
      model = this.get('model')
    this.get('activeFilters').forEach((name, index) => {
      filterInfo[index] = []
      filter = name.toLowerCase()
      filterInfo[index].push(filter)
      Object.entries(this.get('filters')).forEach(filterCategory => {
        Object.entries(filterCategory[1]).forEach(filters => {
          filters[1].forEach(name => {
            if (
              (typeof name === 'string'
                ? name.toLowerCase()
                : name.name.toLowerCase()) === filter
            ) {
              category = filterCategory[0]
              filterName = filters[0].replace(/ /g, '_').toLowerCase()
              filterInfo[index].push(category)
              filterInfo[index].push(filterName)
            }
          })
        })
      })

      if (filterName === 'numeric') {
        Object.entries(this.get('numericFilters')).forEach(numericFilter => {
          if (numericFilter[0] !== 'observe') {
            filteredModel = model[category].filter(item => {
              if (item[filter] !== 'unknown') {
                switch (numericFilter[1][0]) {
                  case 'gt':
                    return (
                      parseInt(item[filter]) > parseInt(numericFilter[1][1])
                    )
                  case 'eq':
                    return (
                      parseInt(item[filter]) === parseInt(numericFilter[1][1])
                    )
                  case 'lt':
                    return (
                      parseInt(item[filter]) < parseInt(numericFilter[1][1])
                    )
                  default:
                    return (
                      parseInt(item[filter]) > parseInt(numericFilter[1][1])
                    )
                }
              }
            })
          }
        })
      } else {
        filteredModel = model[category].filter(item => {
          if (item[filterName] === filter) {
            return true
          } else {
            if (filterName !== 'gender') {
              return item[filterName].includes(filter)
            }
          }
        })
      }

      if (resultObj[category] === undefined) {
        resultObj[category] = filteredModel
      } else {
        resultObj[category] = resultObj[category].concat(filteredModel)
      }
    })

    if (mode) {
      return filterInfo
    } else {
      return resultObj
    }
  },

  filteredModel: computed(
    'activeFilters.[]',
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
        if (this.get('activeFilters').length) {
          let clonedCategories = JSON.parse(
            JSON.stringify(this.get('categorys'))
          ).map(word => word.toLowerCase())
          resultObj = this.getFilterInfo(false)

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
        this.getFilterInfo(true).forEach(filter => {
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
      if (value !== '') {
        if (!this.get('activeFilters').includes(name)) {
          this.get('activeFilters').pushObject(name)
        }
        this.setNumericFilters(true, name, value)
      } else {
        if (this.get('activeFilters').includes(name)) {
          this.get('activeFilters').removeObject(name)
        }
      }
    },

    selectType(type) {
      let nameTypeArr = type.toLowerCase().split('-')
      this.setNumericFilters(false, nameTypeArr[0], nameTypeArr[1])
    }
  }
})
