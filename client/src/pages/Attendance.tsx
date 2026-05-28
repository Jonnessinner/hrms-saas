import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  CheckCircle,
  XCircle,
  CalendarDays,
  User,
  Search,
  Trash2
} from 'lucide-react'

function Attendance() {

  const [attendance, setAttendance] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const [formData, setFormData] = useState({
    employeeName: '',
    status: '',
    date: ''
  })

  const token = localStorage.getItem('token')

  /*
  =========================
  FETCH ATTENDANCE
  =========================
  */

  const fetchAttendance = async () => {

    try {

      const res = await axios.get(
        'http://localhost:8000/api/attendance',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setAttendance(res.data)

    } catch (error) {

      console.log(error)
    }
  }

  /*
  =========================
  FETCH EMPLOYEES
  =========================
  */

  const fetchEmployees = async () => {

    try {

      const res = await axios.get(
        'http://localhost:8000/api/employees',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setEmployees(res.data)

    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {

    fetchAttendance()
    fetchEmployees()

  }, [])

  /*
  =========================
  HANDLE CHANGE
  =========================
  */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })
  }

  /*
  =========================
  ADD ATTENDANCE
  =========================
  */

  const markAttendance = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    try {

      await axios.post(
        'http://localhost:8000/api/attendance',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchAttendance()

      setFormData({
        employeeName: '',
        status: '',
        date: ''
      })

    } catch (error) {

      console.log(error)
    }
  }

  /*
  =========================
  DELETE ATTENDANCE
  =========================
  */

  const deleteAttendance = async (
    id: string
  ) => {

    try {

      await axios.delete(
        `http://localhost:8000/api/attendance/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchAttendance()

    } catch (error) {

      console.log(error)
    }
  }

  /*
  =========================
  ANALYTICS
  =========================
  */

  const presentCount =
    attendance.filter(
      (item: any) =>
        item.status === 'Present'
    ).length

  const absentCount =
    attendance.filter(
      (item: any) =>
        item.status === 'Absent'
    ).length

  /*
  =========================
  FILTER
  =========================
  */

  const filteredAttendance =
    attendance.filter((item: any) =>
      item.employeeName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )

  return (

    <div className="min-h-screen p-8 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">
          Attendance Management
        </h1>

        <div className="relative">

          <Search
            className="absolute left-4 top-4 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              bg-white/10
              border border-white/10
              backdrop-blur-lg
              rounded-2xl
              pl-12
              pr-5
              py-3
              w-72
              outline-none
            "
          />

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-2 gap-6 mb-10">

        <div className="bg-green-500/20 border border-green-500 p-6 rounded-3xl shadow-xl">

          <div className="flex items-center gap-4">

            <CheckCircle size={40} />

            <div>

              <h2 className="text-lg">
                Present
              </h2>

              <p className="text-4xl font-bold">
                {presentCount}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-red-500/20 border border-red-500 p-6 rounded-3xl shadow-xl">

          <div className="flex items-center gap-4">

            <XCircle size={40} />

            <div>

              <h2 className="text-lg">
                Absent
              </h2>

              <p className="text-4xl font-bold">
                {absentCount}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={markAttendance}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl mb-10"
      >

        <div className="grid grid-cols-3 gap-5">

          <select
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          >

            <option value="">
              Select Employee
            </option>

            {employees.map((emp: any) => (

              <option
                key={emp._id}
                value={emp.name}
              >
                {emp.name}
              </option>

            ))}

          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          >

            <option value="">
              Select Status
            </option>

            <option value="Present">
              Present
            </option>

            <option value="Absent">
              Absent
            </option>

          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          />

        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl text-lg font-bold hover:scale-[1.02] transition"
        >

          Mark Attendance

        </button>

      </form>

      {/* HISTORY */}

      <div className="grid grid-cols-3 gap-8">

        {filteredAttendance.map((item: any) => (

          <div
            key={item._id}
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl hover:scale-[1.02] transition"
          >

            <div className="flex justify-between items-start">

              <div className="flex items-center gap-4 mb-5">

                <div className="bg-purple-500 p-3 rounded-full">
                  <User />
                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    {item.employeeName}
                  </h2>

                  <p className="text-gray-400">
                    Employee
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  deleteAttendance(item._id)
                }
                className="bg-red-500 p-2 rounded-xl hover:bg-red-600"
              >

                <Trash2 size={18} />

              </button>

            </div>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <CalendarDays size={18} />

                <p>{item.date}</p>

              </div>

              <div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    item.status === 'Present'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                >

                  {item.status}

                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Attendance