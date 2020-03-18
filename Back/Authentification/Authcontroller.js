const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../conf');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const bcrypt = require('bcryptjs');
const config = require('./config');
const jwt = require('jsonwebtoken');
const VerifyToken = require('./VerifyToken');

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1]
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

router.post("/protected", (req, res, next) => {
  const token = getToken(req);

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(200).send({auth: false, mess: "n'a pas accès aux données" })
    }
    return res.status(200).send({auth: true, mess: 'Donne du user' })
  })
})


// Register a new admin//
router.post('/register', (req, res) => {

  //Paswword crypting
  const hashedPassword = bcrypt.hashSync(req.body.Password, 8);

  const values = [req.body.Mail, hashedPassword, req.body.Firstname , req.body.Lastname]

  connection.query('INSERT INTO Admin (Mail, Password, Firstname, Lastname ) VALUES (?,?,?,?)', values, (err, user) => {

    if (err) return res.status(500).send("There was a problem registering the user.")
    
    // create a token
    const token = jwt.sign({ idAdmin: user.idAdmin }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});


// Login admin //
router.post('/login', (req, res) => {

  const values = [req.body.Mail]

  connection.query('SELECT * from Admin WHERE Mail = ?', values, (err, admin) => {
    if (err)
      return res.status(500).send('Error on the server.');
    if (!admin[0])
      return res.status(402).send('Admin not found.');

  //Verify the password is valid
    const passwordIsValid = bcrypt.compareSync(req.body.Password, admin[0].Password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });
      
      const token = jwt.sign({ idAdmin: admin[0].idAdmin }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
         });
    res.header("Access-Control-Expose-Headers", "x-access-token")
    res.set("x-access-token", token)
    res.status(200).send({ auth: true })
   });
  });


  
//login Candidat
router.post('/log/user',(req, res ) => {
  
  const mail = req.body.Mail

  connection.query('SELECT * from Candidat WHERE Mail = ? ', mail, (err, user) => {
    if (err){
      return res.status(500).send('Error on the server.');
    }    
    if (!user[0]) {
      // return res.status(402).send('User not found.');
      return res.status(401).send({ auth : false, tokenmail: null });
    }

      const id = user[0].idCandidat 
    res.header("Access-Control-Expose-Headers", "x-access-token")
    res.set("x-access-token", id)
    res.status(200).send({ auth : true })
  })
})


// // Verify Token //
router.get('/verify', VerifyToken, (req, res, next) => {

  const sql = "SELECT * FROM Admin WHERE idAdmin = ?"
  const token = req.headers['x-access-token'];

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(200).send({ mess: `N'a pas accés aux données` })
    }

    const values = [decoded.idAdmin]

    connection.query(sql, values, (err, user) => {
      if (err) {
        return res.status(500).send("There was a problem finding the user.")
      }
      else if (!user[0]) {
        return res.status(500).send("No user found.");
      }
      res.status(200).send(user);
    });
  })
});

// Logout user //
router.get('/logout', (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router