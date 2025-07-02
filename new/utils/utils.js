const crypto = require('crypto');

function generateUid(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

module.exports = generateUid;
