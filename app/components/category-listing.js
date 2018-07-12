import Component from '@ember/component'

export default Component.extend({
  actions: {
    toggleCategory(name) {
      this.get('toggle')(name)
    }
  }
})
