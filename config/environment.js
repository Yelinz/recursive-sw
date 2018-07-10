'use strict'

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'recursive-sw',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      categorys: [
        'People',
        'Starships',
        'Vehicles',
        'Species',
        'Planets',
        'Films'
      ],
      filters: {
        people: {
          Gender: ['Male', 'Female', 'Hermaphrodite', 'N/a'],
          'Eye Color': ['Blue', 'Brown', 'Orange', 'Hazel', 'Red'],
          Numeric: ['Height', 'Mass']
        },
        starships: {
          'Starship Class': ['Starfighter', 'Corvette', 'Star Destroyer'],
          Numeric: ['Crew', 'Length']
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
      }
    }
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none'

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'
    ENV.APP.autoboot = false
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV
}
