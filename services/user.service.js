const UserRepository = require("../data/user.repository");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { errorMessages } = require("../utils/messages");
const CustomError = require("../utils/custom-error");
const { jwtSign } = require("../middleware/authentication.middleware");
const { createBSCTokenWallet } = require("../services/createWallet")

exports.isMatch = (password, user) => {
  return bcrypt.compareSync(password, user);
};

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// A method for logging in
exports.login = async (email, password) => {
  email = email.toLowerCase();
  const user = await User.findOne({ email: email });
  if (user) {
    // check user password with hashed password stored in the database
    if (await this.isMatch(password, user.hashedPassword)) {
      return jwtSign(user);
    } else {
      throw new CustomError(errorMessages.WRONG_PASSWORD, 400);
    }
  } else {
    throw new CustomError(errorMessages.ACCOUNT_NOT_FOUND, 400);
  }
};

// A method for getting a refresh token
exports.refreshToken = async (userId) => {
  try {
    const user = await UserRepository.get(userId);
    return jwtSign(user);
  } catch (err) {
    throw err;
  }
};

// A method for signing up
exports.register = async (fullName, email, password, phoneNumber, username) => {
  console.log('fullName', fullName);
  console.log('email', email);
  console.log('password', password);
  console.log('phoneNumber', phoneNumber);
  console.log('username', username);
  email = email.toLowerCase();

  if (await UserRepository.isUsernameTaken(username)) {
    throw new CustomError(errorMessages.USER_NAME_NON_DISPONIBLE, 400);
  }
  if (await UserRepository.isEmailTaken(email)) {
    throw new CustomError(errorMessages.EMAIL_TAKEN, 400);
  } else {

    // Creating wallet for user 
    const walletPublicKey = await createBSCTokenWallet();
    console.log('walletPublicKey', walletPublicKey);

    let newUser = new User({
      username,
      fullName,
      email,
      phoneNumber,
      walletPublicKey,
      agreedToTerms: true,
    });

    newUser.hashedPassword = await this.hashPassword(password);



    try {

      //creating User
      await UserRepository.create(newUser);

      return jwtSign(newUser);
    } catch (err) {
      throw err;
    }
  }
};

// a methoed to check if username taken or not
exports.checkUsername = async (username) => {
  username = username.toLowerCase();

  if (await UserRepository.isUsernameTaken(username)) {
    throw new CustomError(errorMessages.USER_NAME_NON_DISPONIBLE, 400);
  } else {
    return {
      message: 'Username is available',
      status: 200,
    };
  }
};

// A method for updating user's password
exports.updatePassword = async (userId, password) => {
  try {
    let hashedPassword = await this.hashPassword(password);
    await UserRepository.update(userId, { hashedPassword });
  } catch (err) {
    throw err;
  }
};

// A method for updating user's profile
exports.updateProfile = async (userId, fullName, email, phoneNumber) => {
  let existingUser = await UserRepository.get(userId);

  try {
    let userToUpdate = {};

    if (fullName) {
      userToUpdate = { ...userToUpdate, fullName };
    }

    if (email) {
      userToUpdate = { ...userToUpdate, email };
    }

    if (phoneNumber) {
      userToUpdate = { ...userToUpdate, phoneNumber };
    }

    if (Object.keys(userToUpdate).length) {
      await UserRepository.update(userId, userToUpdate);
    }
  } catch (err) {
    throw err;
  }
};
