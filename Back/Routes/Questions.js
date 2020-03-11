const express = require('express')
const connection = require('../conf')

const router = express.Router()

// Récupération des Questions
router.get('/questions', (req, res) => {
  connection.query('SELECT * FROM Questions', (err, results) => {
    if(err)
      res.status(500).send('Erreur lors de la récupération des questions')
    else
      res.json(results)
  })
})

// Ajout d'une nouvelle question
router.post('/questions', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO Questions SET ?', formData, err => {
  if (err)
    res.status(500).send('Erreur lros de l\'enregistrement d\'une question')
  else
    res.sendStatus(200)
  })
})

// Modification d'une question
router.put('/question/:id', (req, res) => {
  const idQuestion = req.params.id
  const formData = req.body
  connection.query('UPDATE Questions SET ? WHERE idQuestions = ?', [formData, idQuestion], err => {
    if (err)
      res.status(500).send(err)
    else
      res.sendStatus(200)
  })
})

// Suppression d'une question
router.delete('/question/:id', (req, res) => {
  const id = req.params.id
  connection.query('DELETE FROM Questions WHERE idQuestions = ?', id, err => {
    if (err)
      res.status(500).send('Erreur lors de la suppression d\'une question')
    else  
      res.sendStatus(200)
  })
})


module.exports = router