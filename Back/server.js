const express = require('express');
const cors = require ('cors')
const app = express();
const Routes = require('./Routes/index');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const port = 4000;


app.use(morgan('dev'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) 


app.options('*', cors())

app.get('/', (request, response) => {
  response.send('Bienvenue à l\'entrainement');
});

app.use('/auth', cors(),Routes.Auth)
app.use('/infosres', cors(), Routes.Resultats)
app.use('/bco',cors(), Routes.Admin)
app.use('/infos',cors(), Routes.Candidat)
app.use('/quizz', cors() , Routes.Tests)
app.use('/quizzquestions',cors (), Routes.Questions)
app.use('/quizzchoices',cors(), Routes.Choices)


app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  } else {
    console.log(`Server is listening on ${port}`);
  }
 })
