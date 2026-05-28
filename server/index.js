const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

/*
=========================
MODELS
=========================
*/

const Employee = require("./models/Employee");
const Attendance = require("./models/Attendance");
const Leave = require("./models/Leave");
const Payroll = require("./models/Payroll");

/*
=========================
MIDDLEWARE
=========================
*/

app.use(cors());

app.use(express.json());

/*
=========================
DATABASE
=========================
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log(err);
  });

/*
=========================
AUTH MIDDLEWARE
=========================
*/

const authMiddleware = (req, res, next) => {

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {

    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {

    return res.status(401).json({
      message: "Invalid token"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      "SECRET123"
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

/*
=========================
ROLE MIDDLEWARE
=========================
*/

const roleMiddleware = (roles) => {

  return (req, res, next) => {

    if (
      !roles.includes(req.user.role)
    ) {

      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};

/*
=========================
HOME
=========================
*/

app.get("/", (req, res) => {

  res.send("HRMS Backend Running ✅");
});

/*
=========================
LOGIN
=========================
*/

app.post(
  "/api/auth/login",
  (req, res) => {

    const { email, password } =
      req.body;

    /*
    ADMIN
    */

    if (
      email === "admin@gmail.com" &&
      password === "123456"
    ) {

      const token = jwt.sign(
        {
          email,
          role: "Admin"
        },
        "SECRET123",
        {
          expiresIn: "7d"
        }
      );

      return res.json({

        success: true,

        token,

        user: {
          name: "Admin",
          email,
          role: "Admin"
        }
      });
    }

    /*
    HR
    */

    if (
      email === "hr@gmail.com" &&
      password === "123456"
    ) {

      const token = jwt.sign(
        {
          email,
          role: "HR"
        },
        "SECRET123",
        {
          expiresIn: "7d"
        }
      );

      return res.json({

        success: true,

        token,

        user: {
          name: "HR Manager",
          email,
          role: "HR"
        }
      });
    }

    /*
    EMPLOYEE
    */

    if (
      email === "employee@gmail.com" &&
      password === "123456"
    ) {

      const token = jwt.sign(
        {
          email,
          role: "Employee"
        },
        "SECRET123",
        {
          expiresIn: "7d"
        }
      );

      return res.json({

        success: true,

        token,

        user: {
          name: "Employee",
          email,
          role: "Employee"
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }
);

/*
=========================
EMPLOYEES
=========================
*/

app.get(
  "/api/employees",
  authMiddleware,
  async (req, res) => {

    try {

      const employees =
        await Employee.find();

      res.json(employees);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.post(
  "/api/employees",
  authMiddleware,
  roleMiddleware(["Admin", "HR"]),
  async (req, res) => {

    try {

      const employee =
        new Employee(req.body);

      await employee.save();

      res.status(201).json(employee);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.put(
  "/api/employees/:id",
  authMiddleware,
  roleMiddleware(["Admin", "HR"]),
  async (req, res) => {

    try {

      const updatedEmployee =
        await Employee.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after"
          }
        );

      res.json(updatedEmployee);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.delete(
  "/api/employees/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {

    try {

      await Employee.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Employee deleted"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
=========================
ATTENDANCE
=========================
*/

app.get(
  "/api/attendance",
  authMiddleware,
  async (req, res) => {

    try {

      const attendance =
        await Attendance.find();

      res.json(attendance);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.post(
  "/api/attendance",
  authMiddleware,
  roleMiddleware(["Admin", "HR"]),
  async (req, res) => {

    try {

      const attendance =
        new Attendance(req.body);

      await attendance.save();

      res.status(201).json(attendance);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.delete(
  "/api/attendance/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {

    try {

      await Attendance.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Attendance deleted"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
=========================
LEAVES
=========================
*/

app.get(
  "/api/leaves",
  authMiddleware,
  async (req, res) => {

    try {

      const leaves =
        await Leave.find();

      res.json(leaves);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.post(
  "/api/leaves",
  authMiddleware,
  async (req, res) => {

    try {

      const leave =
        new Leave(req.body);

      await leave.save();

      res.status(201).json(leave);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.put(
  "/api/leaves/:id",
  authMiddleware,
  roleMiddleware(["Admin", "HR"]),
  async (req, res) => {

    try {

      const updatedLeave =
        await Leave.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after"
          }
        );

      res.json(updatedLeave);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
=========================
PAYROLL
=========================
*/

app.get(
  "/api/payroll",
  authMiddleware,
  async (req, res) => {

    try {

      const payroll =
        await Payroll.find();

      res.json(payroll);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.post(
  "/api/payroll",
  authMiddleware,
  roleMiddleware(["Admin", "HR"]),
  async (req, res) => {

    try {

      const {
        employeeName,
        basicSalary,
        bonus,
        deductions,
        month
      } = req.body;

      const netSalary =
        Number(basicSalary)
        + Number(bonus)
        - Number(deductions);

      const payroll =
        new Payroll({

          employeeName,
          basicSalary,
          bonus,
          deductions,
          netSalary,
          month
        });

      await payroll.save();

      res.status(201).json(payroll);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.delete(
  "/api/payroll/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {

    try {

      await Payroll.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Payroll deleted"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
=========================
SERVER
=========================
*/

const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(
    `Backend running on ${PORT}`
  );
});