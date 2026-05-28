const express = require('express')

const router = express.Router()

const Leave = require('../models/Leave')

const authMiddleware =
  require('../middleware/authMiddleware')

const transporter =
  require('../config/mail')

/*
====================================
GET ALL LEAVES
====================================
*/

router.get(
  '/',
  authMiddleware,
  async (req, res) => {

    try {

      const leaves =
        await Leave.find()

      res.json(leaves)

    } catch (error) {

      res.status(500).json({
        message: error.message
      })
    }
  }
)

/*
====================================
APPLY LEAVE
====================================
*/

router.post(
  '/',
  authMiddleware,
  async (req, res) => {

    try {

      const leave =
        new Leave({

          employeeName:
            req.body.employeeName,

          employeeEmail:
            req.body.employeeEmail,

          reason:
            req.body.reason,

          fromDate:
            req.body.fromDate,

          toDate:
            req.body.toDate,

          status:
            'Pending'
        })

      const savedLeave =
        await leave.save()

      /*
      ====================================
      SEND EMAIL AFTER APPLY
      ====================================
      */

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          leave.employeeEmail,

        subject:
          'Leave Request Submitted',

        html: `

          <div style="
            background:#0f172a;
            padding:30px;
            color:white;
            border-radius:20px;
            font-family:sans-serif;
          ">

            <h1 style="
              color:#8b5cf6;
            ">
              Delluna HRMS
            </h1>

            <h2>
              Leave Request Submitted
            </h2>

            <p>
              Hello
              <b>
                ${leave.employeeName}
              </b>
            </p>

            <p>
              Your leave request has been submitted successfully.
            </p>

            <p>
              Status:
              <span style="
                color:orange;
                font-weight:bold;
              ">
                Pending
              </span>
            </p>

          </div>
        `
      })

      res.status(201).json(
        savedLeave
      )

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: error.message
      })
    }
  }
)

/*
====================================
UPDATE LEAVE STATUS
====================================
*/

router.put(
  '/:id',
  authMiddleware,
  async (req, res) => {

    try {

      const leave =
        await Leave.findById(
          req.params.id
        )

      if (!leave) {

        return res.status(404).json({
          message:
            'Leave not found'
        })
      }

      leave.status =
        req.body.status

      await leave.save()

      /*
      ====================================
      SEND STATUS EMAIL
      ====================================
      */

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          leave.employeeEmail,

        subject:
          `Leave ${leave.status}`,

        html: `

          <div style="
            background:#020617;
            padding:30px;
            color:white;
            border-radius:20px;
            font-family:sans-serif;
          ">

            <h1 style="
              color:#8b5cf6;
            ">
              Delluna HRMS
            </h1>

            <h2>
              Leave ${leave.status}
            </h2>

            <p>
              Hello
              <b>
                ${leave.employeeName}
              </b>
            </p>

            <p>
              Your leave request status has been updated.
            </p>

            <p>
              Current Status:
              <span style="
                color:
                ${
                  leave.status ===
                  'Approved'
                    ? 'lightgreen'
                    : 'red'
                };
                font-weight:bold;
              ">
                ${leave.status}
              </span>
            </p>

          </div>
        `
      })

      res.json(leave)

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: error.message
      })
    }
  }
)

/*
====================================
DELETE LEAVE
====================================
*/

router.delete(
  '/:id',
  authMiddleware,
  async (req, res) => {

    try {

      await Leave.findByIdAndDelete(
        req.params.id
      )

      res.json({
        message:
          'Leave deleted successfully'
      })

    } catch (error) {

      res.status(500).json({
        message: error.message
      })
    }
  }
)

module.exports = router