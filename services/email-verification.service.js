const nodemailer = require("nodemailer");
const Token = require("../models/token");
const User = require("../models/user");
const { isMatch, hashPassword } = require("../services/user.service");
const { errorMessages } = require("../utils/messages");
const CustomError = require("../utils/custom-error");
const UserRepository = require("../data/user.repository");

const transporter = nodemailer.createTransport({
  host: 'mail.konbor.com',
  port: 465,
  auth: {
    user: 'contact@konbor.com',
    pass: 'omarazer99'
  }
});

const sendEmail = ({ to, subject, text, html }) => {
  const mailOptions = {
    from: 'contact@konbor.com',
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

// compare two value and return true if they are equal
exports.compare = async (value1, value2) => {
  return value1 === value2;
};

exports.sendResetToken = async (email) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email: email });
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  if (user) {
    // create a four digit code
    const code = Math.floor(1000 + Math.random() * 9000);

    const resetToken = await Token.create({
      userId: user._id,
      token: code,
      createdAt: Date.now(),
    });

    const link = `http://localhost:3000/reset-password/${resetToken.token}`;
    const html = `Hi ${user.fullName}, <br><br> Please enter the code to reset your password.<br><br> <p>${code}</p> <br><br> If you did not request this, please ignore this email and your password will remain unchanged.`;

    sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: "Password Reset",
      html: html,
    });

    return true;
  }
};

exports.sendVerifyToken = async (email) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email: email });
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  if (user) {
    // create a four digit code
    const code = Math.floor(100000 + Math.random() * 900000);

    const resetToken = await Token.create({
      userId: user._id,
      token: code,
      createdAt: Date.now(),
    });

    const link = `http://localhost:3000/verify-email/${resetToken.token}`;
    const html = `Hi ${user.fullName}, <br><br> Please enter the code to Verify Your E-mail <br><br> <p>${code}</p> <br><br>`;

    sendEmail({
      to: user.email,
      subject: "Verify E-mail",
      text: "Verify E-mail",
      html: html,
    });

    return true;
  }
};

exports.resetForgotPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });

  const isValid = await this.compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new CustomError(errorMessages.INVALID_TOKEN, 400);
  }

  let hashedPassword = await hashPassword(password);

  await UserRepository.update(userId, { hashedPassword });

  const user = await User.findById({ _id: userId });

  // send confirmation mail
  const html = `Hi ${user.fullName}, <br><br> Your password has been successfully reset. <br><br> If you did not request this, please contact us immediately.`;

  sendEmail({
    to: user.email,
    subject: "Password Reset",
    text: "Password Reset",
    html: html,
  });

  await passwordResetToken.deleteOne();

  return true;
};

exports.verifyEmail = async (userId, token) => {
  let verifyEmailToken = await Token.findOne({ userId });

  const isValid = await this.compare(token, verifyEmailToken.token);

  if (!isValid) {
    throw new CustomError(errorMessages.INVALID_TOKEN, 400);
  }
  await UserRepository.update(userId, { isEmailVerified: true });
  const user = await User.findById({ _id: userId });

  // send confirmation mail
  const html = `Hi ${user.fullName}, <br><br> Your Email has been verifried <br><br> If you did not request this, please contact us immediately.`;

  sendEmail({
    to: user.email,
    subject: "E-mail Verified",
    text: "E-mail Verified",
    html: html,
  });

  await verifyEmailToken.deleteOne();

  return true;
};



