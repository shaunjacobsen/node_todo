const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// let message = 'I am user #3';
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// let data = {
//   id: 4,
// };
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString(),
// };
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed, do not trust.');
// }

// let data = {
//   id: 10,
// };
//
// let token = jwt.sign(data, '123abc');
// console.log(token);
// let decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

let password = 'abc456';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashedPassword =
  '$2a$10$r0pqkOaMTPVytIcx75a68OH4b/jpTHOH1G8Y/zEGLbnWOgFpxMHZe';

bcrypt.compare('password', hashedPassword, (err, res) => {
  console.log(res);
});
