import express from "express";

const router = express.Router();

/*
========================
GET PAYROLL
========================
*/

router.get("/", async (req, res) => {

  res.json([
    {
      employeeName: "Demo Employee",
      salary: 50000,
      bonus: 5000,
      deductions: 2000,
      netSalary: 53000
    }
  ]);

});

export default router;