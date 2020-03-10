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

// Informations d'un candidat avec son id
router.get('/admin/:id', (req, res) => {
  const id = req.params.id
  connection.query('SELECT * from Admin WHERE idAdmin = ?', id, err => {
    if (err)
      res.status(500).send(`Erreur lors de la récupération des informations de l'admin ${id}`)
    else 
      res.status(200).send(`Requête éxécutée avec succés`)
  })
})


// Modification d'un élément dans la fiche de l'Administrateur
router.put('/admin/:id', (req, res) => {
  const idAdmin = req.params.id
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
  const id = req.params.id
  connection.query('DELETE FROM Admin WHERE idAdmin = ?', id, err => {
    if (err)
      res.status(500).send('Erreur lors de la supression')
    else
      res.sendStatus(200)
  })
})



module.exports = router