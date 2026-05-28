const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

  employeeName: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);