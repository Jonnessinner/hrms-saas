import { useEffect, useState } from 'react'
import axios from 'axios'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
  IndianRupee,
  Trash2,
  Download,
  Wallet
} from 'lucide-react'

function Payroll() {

  const [payroll, setPayroll] = useState<any[]>([])

  const [formData, setFormData] = useState({
    employeeName: '',
    basicSalary: '',
    bonus: '',
    deductions: '',
    month: ''
  })

  /*
  =========================
  USER + TOKEN
  =========================
  */

  const token =
    localStorage.getItem('token')

  const user =
    JSON.parse(
      localStorage.getItem('user') || '{}'
    )

  /*
  =========================
  FETCH PAYROLL
  =========================
  */

  const fetchPayroll =
    async () => {

      try {

        const res =
          await axios.get(
            'http://localhost:8000/api/payroll',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

        setPayroll(res.data)

      } catch (error) {

        console.log(error)
      }
    }

  useEffect(() => {

    fetchPayroll()

  }, [])

  /*
  =========================
  HANDLE CHANGE
  =========================
  */

  const handleChange =
    (e: any) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value

      })
    }

  /*
  =========================
  ADD PAYROLL
  =========================
  */

  const addPayroll =
    async (e: any) => {

      e.preventDefault()

      /*
      ONLY ADMIN + HR
      */

      if (
        user.role !== 'Admin' &&
        user.role !== 'HR'
      ) {

        alert(
          'Only Admin or HR can add payroll'
        )

        return
      }

      try {

        await axios.post(

          'http://localhost:8000/api/payroll',

          formData,

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        fetchPayroll()

        setFormData({

          employeeName: '',
          basicSalary: '',
          bonus: '',
          deductions: '',
          month: ''

        })

      } catch (error) {

        console.log(error)
      }
    }

  /*
  =========================
  DELETE PAYROLL
  =========================
  */

  const deletePayroll =
    async (id: string) => {

      /*
      ONLY ADMIN
      */

      if (
        user.role !== 'Admin'
      ) {

        alert(
          'Only Admin can delete payroll'
        )

        return
      }

      try {

        await axios.delete(

          `http://localhost:8000/api/payroll/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        fetchPayroll()

      } catch (error) {

        console.log(error)
      }
    }

  /*
  =========================
  DOWNLOAD PDF
  =========================
  */

  const downloadPDF =
    (item: any) => {

      const doc =
        new jsPDF()

      doc.setFontSize(22)

      doc.text(
        'Delluna HRMS Salary Slip',
        20,
        20
      )

      doc.setFontSize(12)

      doc.text(
        `Employee: ${item.employeeName}`,
        20,
        40
      )

      doc.text(
        `Month: ${item.month}`,
        20,
        50
      )

      autoTable(doc, {

        startY: 70,

        head: [[
          'Description',
          'Amount'
        ]],

        body: [

          [
            'Basic Salary',
            `₹ ${item.basicSalary}`
          ],

          [
            'Bonus',
            `₹ ${item.bonus}`
          ],

          [
            'Deductions',
            `₹ ${item.deductions}`
          ],

          [
            'Net Salary',
            `₹ ${item.netSalary}`
          ]

        ]

      })

      doc.save(
        `${item.employeeName}-salary-slip.pdf`
      )
    }

  /*
  =========================
  TOTAL PAYROLL
  =========================
  */

  const totalPayroll =
    payroll.reduce(

      (acc: number, item: any) =>

        acc + Number(item.netSalary),

      0
    )

  return (

    <div className="min-h-screen p-8 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white">

      <h1 className="text-5xl font-bold mb-10">

        Payroll Management

      </h1>

      {/* TOTAL */}

      <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl mb-10">

        <div className="flex items-center gap-5">

          <div className="bg-purple-600 p-5 rounded-full">

            <Wallet size={35} />

          </div>

          <div>

            <p className="text-gray-400">

              Total Payroll

            </p>

            <h2 className="text-5xl font-bold text-purple-400">

              ₹ {totalPayroll}

            </h2>

          </div>

        </div>

      </div>

      {/* FORM */}

      {(user.role === 'Admin' ||
        user.role === 'HR') && (

        <form
          onSubmit={addPayroll}
          className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl mb-10"
        >

          <div className="grid grid-cols-2 gap-5">

            <input
              type="text"
              name="employeeName"
              placeholder="Employee Name"
              value={formData.employeeName}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none"
            />

            <input
              type="text"
              name="month"
              placeholder="Month"
              value={formData.month}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none"
            />

            <input
              type="number"
              name="basicSalary"
              placeholder="Basic Salary"
              value={formData.basicSalary}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none"
            />

            <input
              type="number"
              name="bonus"
              placeholder="Bonus"
              value={formData.bonus}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none"
            />

            <input
              type="number"
              name="deductions"
              placeholder="Deductions"
              value={formData.deductions}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none col-span-2"
            />

          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl text-lg font-bold hover:scale-[1.02] transition"
          >

            Add Payroll

          </button>

        </form>

      )}

      {/* PAYROLL CARDS */}

      <div className="grid grid-cols-3 gap-8">

        {payroll.map((item: any) => (

          <div
            key={item._id}
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl"
          >

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-2xl font-bold">

                  {item.employeeName}

                </h2>

                <p className="text-gray-400">

                  {item.month}

                </p>

              </div>

              <div className="bg-purple-600 p-3 rounded-full">

                <IndianRupee />

              </div>

            </div>

            <div className="space-y-3 text-gray-300">

              <p>
                Basic Salary:
                <span className="font-bold text-white ml-2">
                  ₹ {item.basicSalary}
                </span>
              </p>

              <p>
                Bonus:
                <span className="font-bold text-green-400 ml-2">
                  ₹ {item.bonus}
                </span>
              </p>

              <p>
                Deductions:
                <span className="font-bold text-red-400 ml-2">
                  ₹ {item.deductions}
                </span>
              </p>

              <div className="pt-4 border-t border-white/10">

                <p className="text-lg">

                  Net Salary:

                </p>

                <h3 className="text-4xl font-bold text-purple-400">

                  ₹ {item.netSalary}

                </h3>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex gap-3 mt-8">

              <button
                onClick={() =>
                  downloadPDF(item)
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded-2xl flex items-center justify-center gap-2 transition"
              >

                <Download size={18} />

                PDF

              </button>

              {user.role === 'Admin' && (

                <button
                  onClick={() =>
                    deletePayroll(item._id)
                  }
                  className="flex-1 bg-red-500 hover:bg-red-600 p-3 rounded-2xl flex items-center justify-center gap-2 transition"
                >

                  <Trash2 size={18} />

                  Delete

                </button>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Payroll