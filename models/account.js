const mongoose = require('mongoose')
const Schema = mongoose.Schema

const device = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  device_unique_id: {
    type: String
  },
  name: {
    type: String,
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ['removed', 'pending', 'registered'],
  },
  created_at: {
    type: Date,
    timezone: "Asia/Ho_Chi_Minh"
  },
  last_modified: {
    type: Date,
    default: Date.now,
    timezone: "Asia/Ho_Chi_Minh"
  }
})

const notification = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  title: {
    type: String
  },
  message: {
    type: String
  },
  status: {
    type: Number,
    enum: [0, 1]
  },
  type: {
    type: Number
  },
  created_at: {
    type: Date
  },
  last_modified: {
    type: Date,
    default: Date.now
  },
})

const accountSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    // default: new ObjectId()
  },
  userId: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  // password: {
  //   type: String,
  //   require: true
  // },
  fullName: {
    type: String,
  },
  email: {
    type: String
  },
  device: [device],
  // role: {
  //   type: String,
  //   enum: ['employee', 'manager', 'HR']
  // },
  manager_approver_email: {
    type: String,
    default: null
  },
  device_approver_id: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    default: null
  },
  status: {
    type: Number,
    enum: [0, 1]
  },
  notificationToken: {
    type: String,
    default: null
  },
  notifications: [notification],
  created_at: {
    type: Date,
    timezone: "Asia/Ho_Chi_Minh"
  },
  last_modified: {
    type: Date,
    default: Date.now,
    timezone: "Asia/Ho_Chi_Minh"
  }
})

const Account = mongoose.model('Account', accountSchema, 'Account')

module.exports = Account