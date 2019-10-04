import React from 'react'
import Header from './containers/header'
import DiffView from './containers/diff-view'
import './app.css'

const App = () => {
  return (
    <div className="app">
      <Header />
      <DiffView />
    </div>
  )
}

export default App