import React from 'react'


const Buttontest = ({Duration, Language, NbQuestions, Scale, Title, idTests }) => {
    return (
      <div>
        <button>
          <h5>{Title}</h5>
          <p>{NbQuestions} questions en {Language}</p>
          <p>{Duration} minutes</p>
        </button>
        
      </div>
    )
  }

export default Buttontest
