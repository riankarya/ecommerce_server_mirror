const crypto = require('crypto');

function hashPassword(password){
    const hash = crypto.createHmac('sha256', "hacktiv")
                       .update(password)
                       .digest('hex');
    return hash
}

module.exports = hashPassword