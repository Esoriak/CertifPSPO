const express = require('express');
const app = express()
const Auth = require('../Authentification/Authcontroller')
const Resultats = require('./Resultats')
const Candidat = require('./Candidat')
const Tests = require ('./Tests')
const Questions = require('./Questions')
const Choices = require('./Choices')
const Admin = require('./Admin')



module.exports = {
  Auth,
  Resultats,
  Candidat,
  Tests,
  Questions,
  Choices,
  Admin
}