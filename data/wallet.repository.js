const userWallet = require('../models/user-wallet');
const CustomError = require('../utils/custom-error');
const { errorMessages } = require('../utils/messages');
const _ = require('lodash');

// A method for getting a user private key instance by Id
exports.get = async (walletPublicKey) => {
    let existingUserPrivateKey = await userWallet.findOne({ publicKey: walletPublicKey });
    if (!existingUserPrivateKey)
        throw new CustomError('Wallet not found', 400);
    return existingUserPrivateKey;
};

// A method for creating a user private key instance
exports.create = async ({ publicKey, encryptedPrivateKey }) => {
    const newUserPrivateKey = new userWallet({
        publicKey,
        encryptedPrivateKey,
    });
    await newUserPrivateKey.save();
};

