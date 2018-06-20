import Component from '@ember/component'

export default Component.extend({
  actions: {
    toggleFilter(name) {
      this.get('toggleFilter')(name)
    },

    valChange(name, value) {
      this.get('valChange')(name, value)
    }
  }
})
