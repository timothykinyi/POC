const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const { generateAlphanumericVerificationCode, generateVerificationCode } = require('../services/verificationcode');
const sendEmail = require('../services/emailService');
require('dotenv').config();


const registerUser = async (req, res) => {
    const { FirstName, SecondName, email, dateOfBirth, password, confirmPassword, phoneNumber, gender, idnumber, Nextofkin, Employment, surname} = req.body;
  
    const isDateWithinRange = (date, minYears, maxYears) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const enteredDate = new Date(date);
      const minAgeDate = new Date(today.setFullYear(today.getFullYear() - minYears));
      const maxAgeDate = new Date(today.setFullYear(today.getFullYear() - maxYears));
      return enteredDate <= minAgeDate && enteredDate >= maxAgeDate;
    };
  
    if (!isDateWithinRange(dateOfBirth, 18)) {
      return res.status(400).json({ message: 'Age must be at least 18 to join.' });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.' });
    }
  
    try {
      // Check if user already exists
      let user = await User.findOne({ $or: [{ email }, { idnumber }] });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Generate verification code and send email
      const alphanumericCode = generateAlphanumericVerificationCode(6);
      const formattedDateOfBirth = moment(dateOfBirth).format('YYYY-MM-DD');
      const memberId =  'MBR' + generateVerificationCode(4);

      user = new User({
        FirstName,
        SecondName,
        surname,
        email,
        dateOfBirth: formattedDateOfBirth,
        password,
        phoneNumber,
        gender,
        idnumber,
        memberId,
        Nextofkin,
        Employment,
        verificationCode: alphanumericCode,
        isVerified: false,
        active: false,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        loan: 0,
        savings: 0,
        shares: 0,
        dividents: 0,
        creditscore: 0,
      });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Server error during registration:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
const login = async (req, res) => {
const { Idnumber, password } = req.body;

try {
    const user = await User.findOne({ $or: [{ email: Idnumber }, { idnumber: Idnumber } ] });
    if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
    const subject = `Verification - ${user.verificationCode}`;
    const link = `https://www.bazelink.co.ke/auto?email=${user.email}&code=${user.verificationCode}`

    const vermessage = `Dear ${user.FirstName},

    🎉 Welcome to TH Sacco! We’re thrilled to have you onboard. To finalize your registration and unlock all the benefits of our trusted community, please verify your account using the details below:
    
    🔐 Verification Code: ${user.verificationCode}
    
    Or, you can verify instantly by clicking this secure link: ${link}
    
    If you didn’t sign up for TH Sacco, kindly disregard this email.
    
    Wishing you prosperity and success,
    🌿 The TH Sacco Team`;
    
    const htmlMessage = `
        <div style="font-family: 'Arial', sans-serif; color: #2d6a4f; line-height: 1.8; max-width: 650px; margin: auto; border: 1px solid #52b788; padding: 40px; border-radius: 20px; background-color: #f0fdf4; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);">
        <h1 style="color: #1b4332; text-align: center; font-size: 32px; font-weight: bold; margin-bottom: 15px;">
            🎊 Welcome to TH Sacco, ${user.FirstName}! 🎊
        </h1>
        <p style="font-size: 18px; color: #2d6a4f; text-align: center; margin: 0 15px;">
            You’re just one step away from joining a financial community that cares. Use the code below to verify your account and start your journey with us!
        </p>
        <div style="margin: 35px auto; padding: 30px; background-color: #d8f3dc; border: 3px solid #1b4332; text-align: center; border-radius: 15px; max-width: 85%;">
            <p style="font-size: 26px; font-weight: bold; color: #1b4332; margin: 0;">
            Your Exclusive Verification Code:
            </p>
            <p style="font-size: 32px; font-weight: bold; color: #52b788; letter-spacing: 3px; margin: 15px 0;">
            ${user.verificationCode}
            </p>
        </div>
        <p style="text-align: center;">
            <a href="${link}" style="display: inline-block; padding: 18px 40px; font-size: 20px; color: #ffffff; background-color: #52b788; text-decoration: none; border-radius: 12px; font-weight: bold; transition: background 0.3s ease-in-out; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
            ✅ Verify Your Account Now
            </a>
        </p>
        <p style="font-size: 15px; color: #52796f; text-align: center; margin-top: 30px;">
            If you didn’t request this, no worries! Simply ignore this email.
        </p>
        <p style="font-size: 18px; color: #1b4332; text-align: center; margin-top: 40px; font-weight: bold;">
            🌱 Together, we grow!<br>Warm regards, <br><strong>TH Sacco Support Team</strong>
        </p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">🌍 Visit our Website</a> |
            <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">📧 Contact Support</a> |
            <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">📖 Read our Policies</a>
        </div>
        </div>
    `;
    
    try {
        await sendEmail(user.email, subject, vermessage, htmlMessage);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending verification email' });
    }

    return res.status(401).json({ message: 'This being your first login. Please go to your email and verify your account first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.active = true;
    await user.save();

    const token = jwt.sign(
    {
        id: user._id,
        username: user.FirstName,
        ID: user.Idnumber,
        email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
    );

    // Handle `amount` field with proper checks
    let money;
    if (typeof user.amount === 'undefined') {
    money = undefined;
    } else {
    money = user.amount.toFixed(2);
    }

    console.log(user.amount);
    res.json({
    message: 'Login successful',
    token,
    FirstName: user.FirstName,
    amount: money,
    });
} catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
}
};

const verifyUser = async (req, res) => {
    const { email, verificationCode } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already verified' });
      }
  
      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
  
      user.isVerified = true;
      await user.save();
  
      res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
      console.error('Server error during verification:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

const updateEmail = async (req, res) => {
    const { oldEmail, newEmail } = req.body;
  
    try {
      const user = await User.findOne({ $or: [{ email: oldEmail }, { idnumber: oldEmail } ] });
      if (!user) { 
        return res.status(404).json({ message: 'User not found' });
      }
  
      const newuser = await User.findOne({ email: newEmail });
      if (newuser) {
        return res.status(409).json({ message: 'Email is in use, find a different one' });
      }
  
      // Ensure verificationCode exists
  
      const subject = "Verification - " + user.verificationCode;
  
      const link = `https://www.partner.bazelink.co.ke/auto?email=${newEmail}&code=${user.verificationCode}`;
  
      const vermessage = `Dear ${user.FirstName},

      🎉 Welcome to TH Sacco! We’re thrilled to have you onboard. To finalize your registration and unlock all the benefits of our trusted community, please verify your account using the details below:
      
      🔐 Verification Code: ${user.verificationCode}
      
      Or, you can verify instantly by clicking this secure link: ${link}
      
      If you didn’t sign up for TH Sacco, kindly disregard this email.
      
      Wishing you prosperity and success,
      🌿 The TH Sacco Team`;
      
      const htmlMessage = `
          <div style="font-family: 'Arial', sans-serif; color: #2d6a4f; line-height: 1.8; max-width: 650px; margin: auto; border: 1px solid #52b788; padding: 40px; border-radius: 20px; background-color: #f0fdf4; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);">
          <h1 style="color: #1b4332; text-align: center; font-size: 32px; font-weight: bold; margin-bottom: 15px;">
              🎊 Welcome to TH Sacco, ${user.FirstName}! 🎊
          </h1>
          <p style="font-size: 18px; color: #2d6a4f; text-align: center; margin: 0 15px;">
              You’re just one step away from joining a financial community that cares. Use the code below to verify your account and start your journey with us!
          </p>
          <div style="margin: 35px auto; padding: 30px; background-color: #d8f3dc; border: 3px solid #1b4332; text-align: center; border-radius: 15px; max-width: 85%;">
              <p style="font-size: 26px; font-weight: bold; color: #1b4332; margin: 0;">
              Your Exclusive Verification Code:
              </p>
              <p style="font-size: 32px; font-weight: bold; color: #52b788; letter-spacing: 3px; margin: 15px 0;">
              ${user.verificationCode}
              </p>
          </div>
          <p style="text-align: center;">
              <a href="${link}" style="display: inline-block; padding: 18px 40px; font-size: 20px; color: #ffffff; background-color: #52b788; text-decoration: none; border-radius: 12px; font-weight: bold; transition: background 0.3s ease-in-out; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
              ✅ Verify Your Account Now
              </a>
          </p>
          <p style="font-size: 15px; color: #52796f; text-align: center; margin-top: 30px;">
              If you didn’t request this, no worries! Simply ignore this email.
          </p>
          <p style="font-size: 18px; color: #1b4332; text-align: center; margin-top: 40px; font-weight: bold;">
              🌱 Together, we grow!<br>Warm regards, <br><strong>TH Sacco Support Team</strong>
          </p>
          <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">🌍 Visit our Website</a> |
              <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">📧 Contact Support</a> |
              <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">📖 Read our Policies</a>
          </div>
          </div>
      `;
  
      // Update email in the database
      user.email = newEmail;
      await user.save();
  
      // Send verification email
      await sendEmail(oldEmail, subject, vermessage, htmlMessage);
      console.log('Email sent successfully');
  
      // Generate new JWT token
      const token = jwt.sign(
        {
            id: user._id,
            username: user.FirstName,
            ID: user.Idnumber,
            email: newEmail
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
        );
  
      res.status(200).json({ message: 'Email updated successfully', token });
    } catch (error) {
      console.error('Error updating email:', error.message);
      res.status(500).json({ message: 'An error occurred while updating email' });
    }
  };
  
const resendVerificationCode = async (req, res) => {
const { email } = req.body;

try {
    const user = await User.findOne({ email});
    if (!user) {
    return res.status(404).json({ message: 'User not found register first and try again.' });
    }


    const subject = "Verification - " + user.verificationCode;
    
    const link = `https://www.partner.bazelink.co.ke/auto?email=${email}&code=${user.verificationCode}`;

    const vermessage = `Dear ${user.FirstName},

    🎉 Welcome to TH Sacco! We’re thrilled to have you onboard. To finalize your registration and unlock all the benefits of our trusted community, please verify your account using the details below:
    
    🔐 Verification Code: ${user.verificationCode}
    
    Or, you can verify instantly by clicking this secure link: ${link}
    
    If you didn’t sign up for TH Sacco, kindly disregard this email.
    
    Wishing you prosperity and success,
    🌿 The TH Sacco Team`;
    
    const htmlMessage = `
        <div style="font-family: 'Arial', sans-serif; color: #2d6a4f; line-height: 1.8; max-width: 650px; margin: auto; border: 1px solid #52b788; padding: 40px; border-radius: 20px; background-color: #f0fdf4; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);">
        <h1 style="color: #1b4332; text-align: center; font-size: 32px; font-weight: bold; margin-bottom: 15px;">
            🎊 Welcome to TH Sacco, ${user.FirstName}! 🎊
        </h1>
        <p style="font-size: 18px; color: #2d6a4f; text-align: center; margin: 0 15px;">
            You’re just one step away from joining a financial community that cares. Use the code below to verify your account and start your journey with us!
        </p>
        <div style="margin: 35px auto; padding: 30px; background-color: #d8f3dc; border: 3px solid #1b4332; text-align: center; border-radius: 15px; max-width: 85%;">
            <p style="font-size: 26px; font-weight: bold; color: #1b4332; margin: 0;">
            Your Exclusive Verification Code:
            </p>
            <p style="font-size: 32px; font-weight: bold; color: #52b788; letter-spacing: 3px; margin: 15px 0;">
            ${user.verificationCode}
            </p>
        </div>
        <p style="text-align: center;">
            <a href="${link}" style="display: inline-block; padding: 18px 40px; font-size: 20px; color: #ffffff; background-color: #52b788; text-decoration: none; border-radius: 12px; font-weight: bold; transition: background 0.3s ease-in-out; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
            ✅ Verify Your Account Now
            </a>
        </p>
        <p style="font-size: 15px; color: #52796f; text-align: center; margin-top: 30px;">
            If you didn’t request this, no worries! Simply ignore this email.
        </p>
        <p style="font-size: 18px; color: #1b4332; text-align: center; margin-top: 40px; font-weight: bold;">
            🌱 Together, we grow!<br>Warm regards, <br><strong>TH Sacco Support Team</strong>
        </p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">🌍 Visit our Website</a> |
            <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">📧 Contact Support</a> |
            <a href="#" style="margin: 0 8px; text-decoration: none; color: #2d6a4f; font-size: 16px;">📖 Read our Policies</a>
        </div>
        </div>
    `;

    try {
    await sendEmail(user.email, subject, vermessage, htmlMessage);
    console.log('Email sent successfully');
    } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(200).json({ message: 'Verification code sent successfully.' });
} catch (error) {
    res.status(500).json({ message: 'An error occurred while sending verification code.' });
}
};

const newrecoverPassword = async (req, res) => {
try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.passwordRecoveryToken = token;
    user.tokenExpiry = moment().add(1, 'hour').toDate();
    
    const userCategory = user.category.trim().toLowerCase();

    // Send the recovery email
    const subject = 'Password Reset Request';
    const link =`https://www.partner.bazelink.co.ke/reset-password`;


    const message = `Dear ${user.FirstName},

    We received a request to reset your password for your TH Sacco account. To proceed, please use the token provided below:
    
    Password Reset Token: ${user.passwordRecoveryToken}
    
    Alternatively, you can reset your password by clicking the link below:
    
    ${link}
    
    This token is valid for 1 hour. If you did not request a password reset, please ignore this message.
    
    Best regards,
    TH Sacco Support Team`;
    
    const htmlMessage = `
    <div style="font-family: 'Arial', sans-serif; color: #2d572c; line-height: 1.8; max-width: 600px; margin: auto; border: 1px solid #d4e9d4; padding: 25px; border-radius: 10px; background-color: #f6fff5;">
        <h2 style="color: #2d572c; text-align: center; font-size: 28px; margin-bottom: 10px;">
        Password Reset Request
        </h2>
        <p style="font-size: 16px; color: #3e7d34; text-align: center; margin-top: 0;">
        Dear ${user.FirstName},<br> We received a request to reset your password. To proceed, please use the token provided below:
        </p>
        <div style="margin: 25px 0; padding: 20px; background-color: #d4e9d4; border: 2px dashed #2d572c; text-align: center; border-radius: 8px;">
        <p style="font-size: 22px; font-weight: bold; color: #2d572c; letter-spacing: 1px;">
            Password Reset Token: <span style="color: #1a4314;">${user.passwordRecoveryToken}</span>
        </p>
        </div>
        <p style="text-align: center;">
        <a href="${link}" style="display: inline-block; padding: 14px 30px; font-size: 18px; color: #ffffff; background-color: #2d572c; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Your Password
        </a>
        </p>
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
        This token is valid for 1 hour. If you did not request a password reset, please disregard this email.
        </p>
        <p style="font-size: 16px; color: #3e7d34; text-align: center; margin-top: 30px;">
        Best regards,<br> <strong>TH Sacco Support Team</strong>
        </p>
        <footer style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        © 2025 TH Sacco. All rights reserved.
        </footer>
    </div>
    `;
    
    try {
    await sendEmail(user.email, subject, message, htmlMessage);
    await user.save();
    res.status(200).json({ message: 'Password recovery email sent successfully.' });
    } catch (error) {

    res.status(500).json({ message: 'Error sending password recovery email' });
    }
} catch (error) {
    res.status(500).json({ message: 'An error occurred during password recovery.' });
}
};

const resetPassword = async (req, res) => {
const { email, verificationCode, newPassword } = req.body;

try {
    const user = await User.findOne({ email });

    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordRecoveryToken !== verificationCode) {
    return res.status(400).json({ message: 'Invalid token' });
    }

    if (moment().isAfter(user.tokenExpiry)) {
    return res.status(400).json({ message: 'Token has expired' });
    }

    user.password = newPassword;
    user.passwordRecoveryToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
} catch (error) {
    res.status(500).json({ message: 'An error occurred during password reset.' });
}
};

const logout = async (req, res) => {
const { email } = req.body;

try {
    const user = await User.findOne({ email });

    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    user.active = false;
    await user.save();

    res.status(200).json({ message: 'User logged out successfully.' });
} catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({ message: 'Logout failed.' });
}
};

const changepassword = async (req, res) => {
const { lemail, newPassword } = req.body;

try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    const token = jwt.sign(
    {
        id: user._id,
        username: user.FirstName,
        ID: user.Idnumber,
        email: newEmail
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Password updated successfully', token});
} catch (error) {
    res.status(500).json({ message: 'An error occurred while updating password' });
}
};

module.exports = {
    registerUser,
    login,
    verifyUser,
    updateEmail,
    resendVerificationCode,
    newrecoverPassword,
    resetPassword,
    changepassword,
    logout,
  };
   