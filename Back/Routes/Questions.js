const express = require('express')
const connection = require('../conf')
//const VerifyToken = require('../auth/VerifyToken');

const router = express.Router()

// Récupération des Questions
router.get('/question', (req, res) => {
  connection.query('SELECT * FROM Questions', (err, results) => {
    if(err)
      res.status(500).send('Erreur lors de la récupération des questions')
    else
      res.json(results)
  })
})

// Ajout d'une nouvelle question
router.post('/question', (req, res) => {
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
  const idQuestion = req.params.idQuestion
  const formData = req.body
  connection.query('UPDATE Questions SET ? WHERE idQuestion = ?', [formData, idQuestion], err => {
    if (err)
      res.status(500).send('Erreur lors de la modification d\'une question')
    else
      res.sendStatus(200)
  })
})

// Suppression d'une question
router.delete('/question/:id', (req, res) => {
  const idQuestion = req.params.idQuestion
  connection.query('DELETE FROM Questions WHERE idQuestion = ?', idQuestion, err => {
    if (err)
      res.status(500).send('Erreur lors de la suppression d\'une question')
    else  
      res.sendStatus(200)
  })
})


module.exports = router