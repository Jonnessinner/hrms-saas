import express from "express";

const router = express.Router();

// GET Payroll
router.get("/", async (req, res) => {
  try {
    const payroll = [
      {
        _id: "1",
        employeeName: "John Doe",
        salary: 50000,
        status: "Paid",
      },
      {
        _id: "2",
        employeeName: "Jane Smith",
        salary: 60000,
        status: "Pending",
      },
    ];

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;