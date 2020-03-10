const express = require('express')
const connection = require('../conf')

const router = express.Router()

// Récupération des informations des administrateurs
router.get('/admin', (req, res) => {
  connection.query('SELECT idAdmin, Firstname, Lastname, Mail FROM Admin', (err, results) => {
    if(err) {
        res.status(500).send('Erreur lors de la reception des données des administrateurs')
    } else {
        res.json(results)
    }
})
})

// enregistrement d'un administrateur
router.post('/admin', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO Admin SET ?', formData, err => {
    if (err)
      res.status(500).send('Erreur lors de l\'enregistrement')
    else
      res.sendStatus(200)
  })
})

// Modification d'un élément dans la fiche de l'Administrateur
router.put('/admin/:id', (req, res) => {
  const idAdmin = req.params.idAdmin
  const formData = req.body
  connection.query('UPDATE Admin SET ? WHERE idAdmin = ?', [formData, idAdmin], err => {
    if (err)
      res.status(500).send('Erreur lors de la modification')
    else
      res.sendStatus(200)
  })
})


// Suppression d'un administrateur
router.delete('/admin/:id', (req, res) => {
  const idAdmin = req.params.idAdmin
  connection.query('DELETE FROM `Admin` WHERE `idAdmin` = ?', idAdmin, err => {
    if (err)
      res.status(500).send('Erreur lors de la supression')
    else
      res.sendStatus(200)
  })
})



module.exports = router