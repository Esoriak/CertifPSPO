const express = require('express')
const connection = require('../conf')
const router = express.Router()


// Récupération des résultats
router.get('/resultats', (req, res) => {
  connection.query('SELECT * FROM Resultats', (err, results) => {
    if (err)
      res.status(500).send('Erreur lors de la récupération des résultats')
    else 
      res.json(results)
  })
})

// Ajout d'un nouveau résultat
router.post('/resultats', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO Resultats SET ?', formData, err => {
    if (err)
      res.status(500).send(err)
    else
      res.sendStatus(200)
  })
})


// Suppression d'un choix
router.delete('/resultats/:id', (req, res) => {
  const idResultat = req.params.idResultat
  connection.query('DELETE FROM Resultat WHERE idResultat = ?', idResultat, err => {
    if (err)
      res.status(500).send('Erreur lors de la suppression d\'un résultat')
    else  
      res.sendStatus(200)
  })
})

module.exports = router