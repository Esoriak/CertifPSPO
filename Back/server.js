const express = require('express');
const cors = require ('cors')
const app = express();
const routes = require('./Routes/index');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const port = 3000;


const connection = require('./conf')


app.use(morgan('dev'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) 



app.get('/', (request, response) => {
  response.send('Bienvenue à l\'entrainement');
});



app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  } else {
    console.log(`Server is listening on ${port}`);
  }
 })

app.listen(port, console.log(`hhtp://localhost ${port}`))