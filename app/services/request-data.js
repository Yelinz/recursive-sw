import Service from "@ember/service"

export default Service.extend({
  requestData(_type, _number) {
    let xhr = new XMLHttpRequest()
    let type = `${_type}/` || ""
    let number
    if (type === "") {
      number = ""
    } else {
      number = `${_number}/`
    }
    let url = `https://swapi.co/api/${type}${number}`
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        return xhr.response
      }
    }
    xhr.open("GET", url)
    xhr.send()
  }
})
