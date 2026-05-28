const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  salary: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    default:
      'https://i.pravatar.cc/150?img=3'
  }

})

module.exports = mongoose.model(
  'Employee',
  EmployeeSchema
)