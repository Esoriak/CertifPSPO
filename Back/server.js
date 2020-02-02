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

// const corsOptions = {
//   origin: 'http://training.monsieurguiz.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


app.use(cors())

app.get('/', (request, response) => {
  response.send('Bienvenue à l\'entrainement');
});

app.use('/infosres', Routes.Resultats)
app.use('/admin', Routes.Admin)
app.use('/infos', Routes.Candidat)
app.use('/quizz', Routes.Tests)
app.use('/quizzquestions', Routes.Questions)
app.use('/quizzchoices', Routes.Choices)


app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  } else {
    console.log(`Server is listening on ${port}`);
  }
 })
