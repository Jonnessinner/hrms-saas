const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({

  employeeName: {
    type: String,
    required: true
  },

  basicSalary: {
    type: Number,
    required: true
  },

  bonus: {
    type: Number,
    default: 0
  },

  deductions: {
    type: Number,
    default: 0
  },

  netSalary: {
    type: Number
  },

  month: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model(
  "Payroll",
  payrollSchema
);