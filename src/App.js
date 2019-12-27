import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import AddBookmark from './AddBookmark/AddBookmark'
import BookmarkList from './BookmarkList/BookmarkList'
import Nav from './Nav/Nav'
import config from './config'
import Rating from './Rating/Rating'
import './App.css'
import BookmarksContext from './BookmarksContext'
import UpdateBookmark from './UpdateBookmark/UpdateBookmark'

const bookmarks = []

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    })
  }

  deleteBookmark = bookmarkId => {    
    const newBookmarks = this.state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
    this.setState({
      bookmarks: newBookmarks
    })
  }

  updateBookmark = updatedBookmark => {
   this.setState({
     bookmarks: this.state.bookmarks.map(bm => 
      (bm.id !== updatedBookmark.id) 
        ? bm 
        : updatedBookmark
      )
   })    
   }

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookark: this.deleteBookmark,
      updateBookmark: this.updateBookmark
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route
              path='/add-bookmark'
              component={AddBookmark}
            />
            <Route
              exact
              path='/'
              component={BookmarkList}
            />
            <Route
              exact
              path='/edit/:bookmarkId'
              component={UpdateBookmark}
            />
          </div>
        </BookmarksContext.Provider>
        <Rating />
      </main>
    );
  }
}

export default App;
