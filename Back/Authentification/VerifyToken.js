const jwt = require('jsonwebtoken');
const config = require('./config');

// Check token is valid //
const verifyToken = (req, res, next) => {

  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
    
  jwt.verify(token, config.secret, (err) => {
    if (err){
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    // if everything good, save to request for use in other routes
    next();
  });
}

module.exports = verifyToken;