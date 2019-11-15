const express = require('express')
const connection = require('../conf')
// const VerifyToken = require('../auth/VerifyToken');

const router = express.Router()


// Récupération des résultats
router.get('/resultat', (req, res) => {
  connection.query('SELECT * FROM Resultats', (err, results) => {
    if (err)
      res.status(500).send('Erreur lors de la récupération des résultats')
    else 
      res.json(results)
  })
})

// Ajout d'un nouveau résultat
router.post('/resultat', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO Resultats SET ?', formData, err => {
    if (err)
      res.status(500).send('Erreur lors de l\'enregistrement d\'un resultat')
    else
      res.sendStatus(200)
  })
})


// Suppression d'un choix
router.delete('/resultat/:id', (req, res) => {
  const idResultat = req.params.idResultat
  connection.query('DELETE FROM Resultat WHERE idResultat = ?', idResultat, err => {
    if (err)
      res.status(500).send('Erreur lors de la suppression d\'un résultat')
    else  
      res.sendStatus(200)
  })
})

module.exports = router