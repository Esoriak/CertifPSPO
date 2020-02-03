const express = require('express')
const connection = require('../conf')
const router = express.Router()


// Récupération des tests
router.get('/tests', (req, res) => {
  connection.query('SELECT * from tests', (err, results) => {
    if (err)
      res.status(500).send('Erreur lors de la récupération des tests')
    else
      res.json(results)
  })
})

// Ajout d'un nouveau test
router.post('/tests', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO Tests SET ?', formData, err => {
    if (err)
     res.status(500).send('Erreur de l\'enregistrement du test')
    else
      res.sendStatus(200)
  })
})

// Modification d'un test
router.put('/tests/:id', (req, res) => {
  const idTest = req.params.idTest
  const formData = req.body
  connection.query('UPDATE Tests SET ? HWERE idTest = ?', [formData, idTest], err => {
    if (err)
      res.status(500).send('Erreur lord de la modification du test')
    else
      res.sendStatus(200)
  })
})

// Suppression d'un test
router.delete('/tests/:id', (req, res) => {
  const idTest = req.params.idTest
  connection.query('DELETE FROM Tests WHERE idTest= ?', idTest, err => {
    if (err)
      res.status(500).send('Erreur lors de la suppression du test')
    else
      res.sendStatus(200)
  })
})

module.exports = router