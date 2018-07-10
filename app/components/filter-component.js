import Component from '@ember/component'

export default Component.extend({
  init() {
    this._super(...arguments)
    this.set(
      'filterCategorys.Numeric',
      this.get('filterCategorys.Numeric').map(name => {
        return { name: name, type: 'gt', value: 0 }
      })
    )
    this.queryParameter.filter(e => typeof e === 'object').forEach(filter => {
      this.get('filterCategorys.Numeric').any(obj => {
        if (obj.name.toLowerCase() === filter[0]) {
          obj.type = filter[1]
          obj.value = filter[2]
          return true
        }
      })
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
