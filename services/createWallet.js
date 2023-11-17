const walletRepository = require("../data/wallet.repository");
const { Web3 } = require('web3');
const { Wallet } = require('ethers');
const UserWallet = require("../models/user-wallet");
const crypto = require('crypto');
require('dotenv').config()

// Connect to a BSC node
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_LINK));

exports.encryptPrivateKey = (privateKey) => {
    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex');
    encryptedPrivateKey += cipher.final('hex');
    return `${iv.toString('hex')}:${encryptedPrivateKey}`;
}

exports.decryptPrivateKey = (encryptedPrivateKey) => {
    const parts = encryptedPrivateKey.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = parts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let decryptedPrivateKey = decipher.update(encrypted, 'hex', 'utf8');

    try {
        decryptedPrivateKey += decipher.final('utf8');
        return decryptedPrivateKey;
    } catch (error) {
        throw new Error('Decryption failed. Invalid key or IV.');
    }
}


// Function to create a BSC wallet
exports.createBSCTokenWallet = async () => {
    // Generate a new Ethereum wallet using ethers.js
    //const wallet = Wallet.createRandom();
    const wallet = await web3.eth.accounts.create();
    const encryptedKey = await this.encryptPrivateKey(wallet.privateKey);
    console.log('encryptedKey', encryptedKey);

    console.log('wallet', wallet);

    let newUserWallet = new UserWallet({
        publicKey: wallet.address,
        encryptedPrivateKey: encryptedKey,
    });



    walletRepository.create(newUserWallet);

    // Get the BSC address from the Ethereum address
    //const bscAddress = Web3.utils.toChecksumAddress(wallet.address);
    console.log('Private Key:', wallet.privateKey);
    console.log('Tax', wallet.signTransaction);
    console.log('BSC Address:', wallet.address);

    return wallet.address;
}