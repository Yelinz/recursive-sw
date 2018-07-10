import Component from '@ember/component'
import { computed } from '@ember/object'
import ENV from 'recursive-sw/config/environment'

export default Component.extend({
  filters: ENV.APP.filters,

  filteredModel: computed(
    'selectedFilters.[]',
    'categories',
    'model',
    function() {
      let resultObj = {},
        potentialResult = true
      if (this.get('selectedFilters').length) {
        this.getFilterInfo().forEach(filterInfo => {
          let [filter, category, filterCategory] = filterInfo
          if (resultObj[category] === undefined) resultObj[category] = []
          let model = resultObj[category].length
            ? resultObj[category]
            : this.get(`model.${category}`)
          if (filterCategory !== 'numeric') {
            resultObj[category] = model.filter(obj => {
              if (obj[filterCategory] === filter) {
                return true
              } else if (filterCategory !== 'gender') {
                return obj[filterCategory].includes(filter)
              } else {
                return false
              }
            })
          } else if (potentialResult && filterCategory === 'numeric') {
            resultObj[category] = model.filter(obj => {
              if (obj[filter] !== 'unkown') {
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
      } else {
        resultObj = this.model
      }
      return resultObj
    }
  )
})
