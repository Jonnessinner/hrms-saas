import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

import { motion } from 'framer-motion'

const COLORS = [
  '#9333EA',
  '#2563EB'
]

function Dashboard() {

  const [employees, setEmployees] = useState<any[]>([])
  const [leaves, setLeaves] = useState<any[]>([])
  const [payroll, setPayroll] = useState<any[]>([])

  const [darkMode, setDarkMode] =
    useState(true)

  const token =
    localStorage.getItem('token')

  /*
  =========================
  AXIOS CONFIG
  =========================
  */

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  /*
  =========================
  FETCH DATA
  =========================
  */

  const fetchData = async () => {

    try {

      const empRes =
        await axios.get(
          'http://localhost:8000/api/employees',
          config
        )

      setEmployees(empRes.data)

    } catch (error) {

      console.log(
        'Employee Error:',
        error
      )
    }

    try {

      const leaveRes =
        await axios.get(
          'http://localhost:8000/api/leaves',
          config
        )

      setLeaves(leaveRes.data)

    } catch (error) {

      console.log(
        'Leave Error:',
        error
      )
    }

    try {

      const payrollRes =
        await axios.get(
          'http://localhost:8000/api/payroll',
          config
        )

      setPayroll(payrollRes.data)

    } catch (error) {

      console.log(
        'Payroll Error:',
        error
      )
    }
  }

  useEffect(() => {

    fetchData()

  }, [])

  /*
  =========================
  ANALYTICS
  =========================
  */

  const totalEmployees =
    employees.length

  const totalLeaves =
    leaves.length

  const approvedLeaves =
    leaves.filter(
      (leave: any) =>
        leave.status === 'Approved'
    ).length

  const pendingLeaves =
    leaves.filter(
      (leave: any) =>
        leave.status === 'Pending'
    ).length

  const totalPayroll =
    payroll.reduce(
      (
        acc: number,
        item: any
      ) =>
        acc +
        Number(
          item.netSalary || 0
        ),
      0
    )

  /*
  =========================
  CHART DATA
  =========================
  */

  const employeeChartData =
    employees.map(
      (emp: any) => ({

        name: emp.name,

        salary: Number(
          emp.salary || 0
        )

      })
    )

  const leaveChartData = [

    {
      name: 'Approved',
      value: approvedLeaves
    },

    {
      name: 'Pending',
      value: pendingLeaves
    }

  ]

  return (

    <div
      className={`

        min-h-screen
        p-3 sm:p-5 lg:p-8
        transition-all duration-500

        ${darkMode

          ? 'bg-gradient-to-br from-[#09122F] via-[#0F172A] to-[#020617] text-white'

          : 'bg-gray-100 text-black'
        }

      `}
    >

      {/* TOP BAR */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">

        <h1 className="text-3xl md:text-5xl font-bold">

          HRMS Dashboard

        </h1>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="
            bg-white/10
            backdrop-blur-lg
            border border-white/10
            px-5
            py-3
            rounded-2xl
            hover:bg-white/20
            transition
          "
        >

          {darkMode

            ? '☀️ Light Mode'

            : '🌙 Dark Mode'
          }

        </button>

      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        {/* EMPLOYEES */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            bg-white/10
            backdrop-blur-lg
            border border-white/10
            p-6
            rounded-3xl
            shadow-2xl
          "
        >

          <h2 className="text-lg text-gray-400">

            Total Employees

          </h2>

          <p className="text-5xl font-bold mt-3 text-purple-400">

            {totalEmployees}

          </p>

        </motion.div>

        {/* LEAVES */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            bg-white/10
            backdrop-blur-lg
            border border-white/10
            p-6
            rounded-3xl
            shadow-2xl
          "
        >

          <h2 className="text-lg text-gray-400">

            Leave Requests

          </h2>

          <p className="text-5xl font-bold mt-3 text-blue-400">

            {totalLeaves}

          </p>

        </motion.div>

        {/* APPROVED */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            bg-white/10
            backdrop-blur-lg
            border border-white/10
            p-6
            rounded-3xl
            shadow-2xl
          "
        >

          <h2 className="text-lg text-gray-400">

            Approved Leaves

          </h2>

          <p className="text-5xl font-bold mt-3 text-green-400">

            {approvedLeaves}

          </p>

        </motion.div>

        {/* PENDING */}

        <motion.div
          whileHover={{
            scale: 1.03
          }}
          className="
            bg-white/10
            backdrop-blur-lg
            border border-white/10
            p-6
            rounded-3xl
            shadow-2xl
          "
        >

          <h2 className="text-lg text-gray-400">

            Pending Leaves

          </h2>

          <p className="text-5xl font-bold mt-3 text-yellow-400">

            {pendingLeaves}

          </p>

        </motion.div>

      </div>

      {/* PAYROLL */}

      <div className="
        bg-white/10
        backdrop-blur-lg
        border border-white/10
        p-8
        rounded-3xl
        shadow-2xl
        mb-10
      ">

        <h2 className="text-2xl font-bold mb-4">

          Total Payroll

        </h2>

        <p className="text-4xl md:text-6xl font-bold text-purple-400">

          ₹ {totalPayroll}

        </p>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

        {/* BAR */}

        <div className="
          bg-white/10
          backdrop-blur-lg
          border border-white/10
          p-6
          rounded-3xl
          shadow-2xl
        ">

          <h2 className="text-2xl font-bold mb-6">

            Employee Salary Chart

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={
                employeeChartData
              }
            >

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="salary"
                fill="#9333EA"
                radius={[
                  10,
                  10,
                  0,
                  0
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE */}

        <div className="
          bg-white/10
          backdrop-blur-lg
          border border-white/10
          p-6
          rounded-3xl
          shadow-2xl
        ">

          <h2 className="text-2xl font-bold mb-6">

            Leave Analytics

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={
                  leaveChartData
                }
                dataKey="value"
                outerRadius={100}
                label
              >

                {leaveChartData.map(
                  (
                    _: any,
                    index: number
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* TABLE */}

      <div className="
        bg-white/10
        backdrop-blur-lg
        border border-white/10
        rounded-3xl
        overflow-x-auto
        shadow-2xl
      ">

        <div className="p-6 border-b border-slate-700">

          <h2 className="text-2xl font-bold">

            Recent Employees

          </h2>

        </div>

        <table className="w-full min-w-[700px]">

          <thead className="bg-white/10">

            <tr>

              <th className="p-4 text-left">

                Image

              </th>

              <th className="p-4 text-left">

                Name

              </th>

              <th className="p-4 text-left">

                Email

              </th>

              <th className="p-4 text-left">

                Department

              </th>

              <th className="p-4 text-left">

                Salary

              </th>

            </tr>

          </thead>

          <tbody>

            {employees.map(
              (emp: any) => (

                <tr
                  key={emp._id}
                  className="
                    border-b
                    border-slate-700
                    hover:bg-white/5
                    transition
                  "
                >

                  <td className="p-4">

                    <img
                      src={
                        emp.image ||

                        'https://i.pravatar.cc/150?img=3'
                      }
                      alt={emp.name}
                      className="
                        w-14
                        h-14
                        rounded-full
                        object-cover
                        border-2
                        border-purple-500
                      "
                    />

                  </td>

                  <td className="p-4">

                    {emp.name}

                  </td>

                  <td className="p-4">

                    {emp.email}

                  </td>

                  <td className="p-4">

                    {emp.department}

                  </td>

                  <td className="p-4">

                    ₹ {emp.salary}

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Dashboard