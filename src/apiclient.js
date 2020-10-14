
import axios from 'axios'

export class ApiClient {

  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  getAuthors(skip, limit) {
    return axios.get(`https://api.quotable.io/authors?skip=${skip}&limit=${limit}`)
      .then(this.status)
  }

  getQuote() {
    return axios.get("https://api.quotable.io/random")
      .then(this.status)
      
      .catch(function (error) {
        // handle error
        console.error(error);
        alert(error)
      })

  }
}