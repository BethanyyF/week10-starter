import React from 'react';
import { ApiClient } from './apiclient'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.ApiClient = new ApiClient();

    this.state = {
      content: "",
      author: "",
      tags: [],
      fetching: false,
      authors: [],
      lastItemIndex: 0,
      pageSize: 20
    }
    this.apiClient = new ApiClient()
  }

  updateQuote(response) {
    this.setState({
      content: response.content,
      author: response.author,
      tags: response.tags
    })
  }

  refreshQuote() {
    this.setState({
      content: "....loading",
      author: "",
      tags: [],
      fetching: true //tracking status
    })

    // execute an api request to api.quotable
    this.apiClient.getQuote() //call function
      .then((response) => //handling the response
      { this.updateQuote(response.data) })  //send the response data to state
      .finally(() => {
        this.setState({
          fetching: false
        })
      })
  }

  listAuthors(skip=0) {
    this.apiClient.getAuthors(skip, this.state.pageSize)
      .then((response) => { this.updateAuthors(response.data) })
  }

  updateAuthors(response) {
    // create 2nd array with data we need
    const authors = response.results.map((author) => ({ name: author.name, count: author.quoteCount }))
    this.setState({
      authors,
      lastItemIndex: response.lastItemIndex
    })
  }

  refreshAuthors(next) {
    if (next) {
      this.listAuthors(this.state.lastItemIndex)
    }
  }

  refreshPagination(e) {
    this.setState({
      pageSize: e.target.value
    }, () => this.listAuthors())
  }


  makeAuthorTable() {
    return this.state.authors.map((author, i) => { //return new array of table rows
      return (
        <tr key={i}>
          <td>
            {author.name}
          </td>
          <td>
            {author.count}
          </td>
        </tr>
      )
    })
  }

  // used to get our functions - lifecycle function
  componentDidMount() {
    //get quote of the day
    this.refreshQuote();
    this.listAuthors();
  }

  // lifecycle function
  render() {
    return (
      <>
        <h1>Quote of the day</h1>
        <p><b>Content:</b> {this.state.content} </p>
        <p><b>Author:</b> {this.state.author} </p>
        <p><b>Tags:</b> {this.state.tags.join(", ")}</p>  {/* spliting up the array */}

        <button disabled={this.state.fetching} onClick={() => this.refreshQuote()}>New Quote</button>

        <table>
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                No of quotes
              </th>
            </tr>
          </thead>
          <tbody>
            {this.makeAuthorTable()}
          </tbody>
        </table>
        <button onClick={() => this.refreshAuthors(true)}>Next</button>
        <br />Page size <br />
        <select onChange={(e) => this.refreshPagination(e)} value={this.state.pageSize}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </>
    )
  }
}

export default App;