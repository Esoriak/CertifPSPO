import React, { Component } from 'react'
import axios from 'axios'
import Buttontest from './Buttontest'

export class Tests extends Component {
  state ={
    tests : [],
    questions: [],
    choices: [],
  }

 GetDataTests = async() => {
   const tests =  await axios.get('http://localhost:4000/quizzstep1/tests')
   console.log('voilà les tests',tests.data)
     this.setState({
       tests : tests.data
     })
 }

 GetDataQuestions = async() => {
   const questions = await axios.get('http://localhost:4000/quizzstep2/questions')
    console.log('ici les questions', questions.data)
    this.setState({
      questions : questions.data
    })
 }

 GoQuizz = (test) => {
   console.log("lequizz", test)
   const data = this.state.tests.map( res => {
      if (res.idTests === test) {
        const thistest = res
        console.log('cetestla', thistest)
    }})
 
  //  const numberQuestion = id.NbQuestions
  //  console.log("totorooo",numberQuestion)
  //  const res = axios.get('http://localhost:4000/quizzstep2/'+{idTests})
 }

componentDidMount =() => {
  this.GetDataTests()
  this.GetDataQuestions()
}

  render() {

    const {
      tests,
    } = this.state

    return (
      <div>
        {tests.map(res => <Buttontest {...res} onClick={this.GoQuizz(res.idTests)} />)}
      </div>
    )
  }
}

export default Tests
