import Component from '@ember/component'
import { computed, getProperties } from '@ember/object'

export default Component.extend({
  filteredModel: computed(
    'selectedFilters.[]',
    'categories.{People,Starships,Vehicles,Species,Planets,Films}',
    'model',
    function() {
      let resultObj = {},
        potentialResult = true
      if (this.get('selectedFilters.length')) {
        this.getFilterInfo().forEach(filterInfo => {
          let [filter, category, filterCategory] = filterInfo
          if (resultObj[category] === undefined) {
            resultObj[category] = []
          }
          if (filterCategory !== 'numeric') {
            resultObj[category] = resultObj[category].concat(
              this.get(`model.${category}`).filter(obj => {
                if (obj[filterCategory] === filter) {
                  return true
                } else if (filterCategory !== 'gender') {
                  return obj[filterCategory].includes(filter)
                } else {
                  return false
                }
              })
            )
          } else if (potentialResult && filterCategory === 'numeric') {
            resultObj[category] = (resultObj[category].length
              ? resultObj[category]
              : this.get(`model.${category}`)
            ).filter(obj => {
              if (obj[filter] !== 'unknown') {
                let num = parseInt(obj[filter])
                let numericFilter = this.selectedFilters.find(
                  e => e[0] === filter
                )
                switch (numericFilter[1]) {
                  case 'gt':
                    return num > parseInt(numericFilter[2])
                  case 'eq':
                    return num === parseInt(numericFilter[2])
                  case 'lt':
                    return num < parseInt(numericFilter[2])
                }
              }
            })
            if (resultObj[category].length === 0) potentialResult = false
          }
        })

        resultObj = Object.assign(
          {},
          resultObj,
          getProperties(
            this.model,
            Object.keys(this.categories)
              .map(word => word.toLowerCase())
              .filter(category => !resultObj.hasOwnProperty(category))
          )
        )
      } else {
        resultObj = this.model
      }
      return resultObj
    }
  )
})
