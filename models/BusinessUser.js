const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BusinessUserSchema = new mongoose.Schema({username: {type: String,required: true,unique: true},password: {type: String,required: true},purchases: {type: Number,default: 0 },sales: {type: Number,default: 0 },profit: {type: Number,default: 0 },lastLogin: { type: Date, default: Date.now },
});
BusinessUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
BusinessUserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('BusinessUser', BusinessUserSchema);
