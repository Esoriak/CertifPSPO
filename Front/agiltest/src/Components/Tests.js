import React, { Component } from 'react'
import axios from 'axios'
import Buttontest from './Buttontest'

export class Tests extends Component {
  state ={
    tests : [],
  }

 GetData = async() => {
   const result =  await axios.get('http://localhost:4000/quizzstep1/tests')
   console.log('yiiiiihhhhhaaaa',result.data)
     this.setState({
       tests : result.data
     })
 }

componentDidMount =() => {
  this.GetData()
}

  render() {

    const {
      tests,
    } = this.state

    return (
      <div>
        <h2>Shelbyby</h2>
        {tests.map( res => <Buttontest {...res} />)}
      </div>
    )
  }
}

export default Tests
