
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  SecondName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  memberId: {type: String, required: true,  unique: true},
  idnumber: {type: Number, required: true, unique: true },
  Nextofkin: 
  {
    FirstName: { type: String, required: true},
    MiddleNAme: { type: String,  required: true},
    LastName: { type: String, required: true},
    relationship: { type: String, required: true },
    Idnumber: { type: String, required: true },
    phonenumber: { type: String, required: true },
  },
  Employment: 
  {
    Organization: { type: String, required: true},
    Position: { type: String,  required: true},
  },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false },
  passwordRecoveryToken: { type: String, default: undefined },
  tokenExpiry: { type: Date, default: undefined },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },

  loan: { type: Number, default: 0},
  savings: { type: Number, default: 0},
  shares: { type: Number, default: 0},
  dividents: { type: Number, default: 0},
  creditscore: {type: Number, default: 0},

}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('Member', UserSchema);
