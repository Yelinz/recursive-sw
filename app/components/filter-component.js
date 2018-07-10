import Component from '@ember/component'

export default Component.extend({
  init() {
    this._super(...arguments)
    this.set('filterCategories', this.get(`filterCategories.${this.name}`))
    /*
     * Sets the Value in the input fields, if it's defined in the queryparamters
     */
    if (
      this.get('filterCategories.Numeric').every(e => typeof e === 'string')
    ) {
      this.set(
        'filterCategories.Numeric',
        this.get('filterCategories.Numeric').map(name => {
          return { name: name, type: 'gt', value: 0 }
        })
      )
    }

    this.queryParameter
      .filter(e => typeof e === 'object')
      .forEach(filterInfo => {
        let filterValue = this.get('filterCategories.Numeric').find(
          obj => obj.name.toLowerCase() === filterInfo[0]
        )
        if (filterValue !== undefined) {
          filterValue.type = filterInfo[1]
          filterValue.value = filterInfo[2]
        }
      })
  },

  actions: {
    toggleFilter(name) {
      this.get('toggleFilter')(name)
    },

    selectType(value) {
      this.get('selectType')(value)
    },

    valChange(name, value) {
      this.get('valChange')(name, value)
    }
  }
})
