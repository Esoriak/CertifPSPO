const express = require('express')
const connection = require('../conf')

const router = express.Router()

// Récupération des informations des Candidats
router.get('/candidat', (req, res) => {
  connection.query('SELECT Firstname, Lastname, Mail, Company, Position FROM Candidat', (err, results) => {
    if(err) {
        res.status(500).send('Erreur lors de la reception des données du candidat')
    } else {
        res.json(results)
    }
})
})

// enregistrement d'un candidat
router.post('/candidat', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO Candidat SET ?', formData, err => {
    if (err)
      res.status(500).send('Erreur lors de l\'enregistrement')
    else
      res.sendStatus(200)
  })
})

// Modification d'un élément dans la fiche du candidat
router.put('/candidat/:id', (req, res) => {
  const idCandidat = req.params.idCandidat
  const formData = req.body
  connection.query('UPDATE Candidat SET ? WHERE idCandidat = ?', [formData, idCandidat], err => {
    if (err)
      res.status(500).send('Erreur lors de la modification')
    else
      res.sendStatus(200)
  })
})


// Suppression d'un candidat
router.delete('/candidat/:id', (req, res) => {
  const idCandidat = req.params.idCandidat
  connection.query('DELETE FROM Candidat WHERE idCandidat = ?', idCandidat, err => {
    if (err)
      res.status(500).send('Erreur lors de la supression')
    else
      res.sendStatus(200)
  })
})



module.exports = router