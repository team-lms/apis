const crypto = require('crypto');

module.exports = {
  randomBytes: (size) => crypto.randomBytes(size).toString('hex'),

  encrypt: (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      process.env.ALGORITHM_KEY,
      process.env.CRYPTO_KEY,
      iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}.${encrypted.toString('hex')}`;
  }
};
