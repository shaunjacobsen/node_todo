const { User } = require('./../models/user');

// authentication middleware
let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      // modify the request by adding some information to it
      req.user = user;
      req.token = token;
      next();
    })
    .catch((err) => {
      res.status(401).send();
    });
};

module.exports = { authenticate };
