const express = require('express')
const connection = require('../conf')

const router = express.Router()


// Récupération des choix liés aux questions
router.get('/choices', (req, res) => {
  connection.query('SELECT * FROM Choice', (err, results) => {
    if (err)
      res.status(500).send('Erreur lors de la récupération des choix')
    else 
      res.json(results)
  })
})

// Ajout d'un nouveau choix
router.post('/choices', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO Choice SET ?', formData, err => {
    if (err)
      res.status(500).send('Erreur lors de l\'enregistrement d\'un choix')
    else
      res.sendStatus(200)
  })
})

// Modification d'un choix
router.put('/choices/:id', (req, res) => {
  const idChoice = req.params.idChoice
  const formData = req.body
  connection.query('UPDATE Choice SET ? WHERE idChoice = ?', [formData, idChoice], err => {
    if (err)
      res.status(500).send('Erreur lors de la modification d\'un choix')
    else
      res.sendStatus(200)
  })
})

// Suppression d'un choix
router.delete('/choices/:id', (req, res) => {
  const idChoice = req.params.idChoice
  connection.query('DELETE FROM Choice WHERE idChoice = ?', idChoice, err => {
    if (err)
      res.status(500).send('Erreur lors de la suppression d\'un choix')
    else  
      res.sendStatus(200)
  })
})

module.exports = router