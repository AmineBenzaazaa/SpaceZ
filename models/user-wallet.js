const mongoose = require('mongoose');

// Define a Mongoose schema for UserWallet
const UserPrivateKeySchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true,
        trim: true
    },
    encryptedPrivateKey: {
        type: String,
        required: true,
        trim: true
    }
});

// Create a Mongoose model based on the schema
const UserPrivateKey = mongoose.model('UserPrivateKey', UserPrivateKeySchema);

module.exports = UserPrivateKey;
