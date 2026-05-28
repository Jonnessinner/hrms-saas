const express = require('express')

const router = express.Router()

const Attendance = require('../models/Attendance')

/*
=========================
GET ALL
=========================
*/

router.get('/', async (req, res) => {

  try {

    const attendance = await Attendance.find()

    res.json(attendance)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
})

/*
=========================
ADD
=========================
*/

router.post('/', async (req, res) => {

  try {

    const newAttendance = new Attendance(
      req.body
    )

    await newAttendance.save()

    res.status(201).json(newAttendance)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
})

module.exports = router