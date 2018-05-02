import Service from "@ember/service"
import RSVP from "rsvp"

function requestData(type, number) {
  return new RSVP.Promise(function(resolve) {
    let xhr = new XMLHttpRequest()
    let url = `https://swapi.co/api/${type}/${number}`
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.response)
      }
    }
    xhr.open("GET", url, true)
    xhr.send("")
  })
}

function parseParams(params) {
  let paramsArr = Object.entries(params)[0]
  return [paramsArr[0].split("_")[0], paramsArr[1]]
}

export default Service.extend({
  returnUrls(params) {
    return new RSVP.Promise(function(resolve) {
      let urlArr = []
      let parsedUrls = []
      let route = parseParams(params)
      requestData(route[0], route[1]).then(function(data) {
        Object.entries(JSON.parse(data)).forEach(element => {
          if (typeof element[1] === "object") {
            urlArr = urlArr.concat(element[1])
          }
        })
        urlArr.forEach(element => {
          if (element !== null) {
            let splitUrl = element.split("/")
            parsedUrls.push([splitUrl[4], splitUrl[5]])
          }
        })
        resolve(parsedUrls)
      })
    })
  },

  returnSearchUrls(params) {
    return new RSVP.Promise(function(resolve) {
      const types = ["people", "films", "planets", "starships", "vehicles"]
      let results = []
      let urlsArr = []
      let typesProcessed = 0
      types.forEach(type => {
        requestData(type, `?search=${params.search}`).then(data => {
          data = JSON.parse(data)
          results.push(data.results)
          /*
          let next = data.next
          while (next !== null) {
            requestData(type, data.next.split("/")[5]).then(data => {
              data = JSON.parse(data)
              results.push(data.results)
              next = data.next
            })
          }
          */
          results.forEach((result, id) => {
            result.forEach(entry => {
              let splitUrl = entry.url.split("/")
              urlsArr.push([splitUrl[4], splitUrl[5]])
            })
            results.splice(id)
          })
          typesProcessed++
          if (typesProcessed === types.length) {
            resolve(urlsArr)
          }
        })
      })
    })
  }
})
