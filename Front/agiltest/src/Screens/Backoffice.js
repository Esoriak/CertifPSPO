import React, { Component } from 'react'
import AddCandidat from '../Components/AddCandidat'
import ListCandidat from '../Components/ListCandidat'
import AddAdmin from '../Components/Adddmin'

class Backoffice extends Component {
  render() {
    return (
      <>
        <ListCandidat />
        <AddCandidat />
        <AddAdmin />
      </>
    )
  }
}

export default Backoffice
