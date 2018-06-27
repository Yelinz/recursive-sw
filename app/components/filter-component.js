import Component from '@ember/component'

export default Component.extend({
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
