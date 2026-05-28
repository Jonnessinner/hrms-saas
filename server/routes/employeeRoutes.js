const express = require('express')
const router = express.Router()

const Employee = require('../models/Employee')
const authMiddleware = require('../middleware/authMiddleware')

/*
====================================
GET ALL EMPLOYEES
====================================
*/

router.get('/', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find()
    res.json(employees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/*
====================================
ADD EMPLOYEE
====================================
*/

router.post('/', async (req, res) => {
  try {
    const newEmployee = new Employee({
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      salary: req.body.salary
    })

    const savedEmployee = await newEmployee.save()

    res.status(201).json(savedEmployee)

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

/*
====================================
DELETE EMPLOYEE
====================================
*/

router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Employee Deleted Successfully'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/*
====================================
UPDATE EMPLOYEE
====================================
*/

router.put('/:id', async (req, res) => {
  try {

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedEmployee)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router