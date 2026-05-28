import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Mail,
  Building2,
  IndianRupee,
  Trash2,
  Pencil
} from 'lucide-react'

interface EmployeeType {
  _id: string
  name: string
  email: string
  department: string
  salary: number
  image: string
}

function Employees() {

  const [employees, setEmployees] =
    useState<EmployeeType[]>([])

  const [editingId, setEditingId] =
    useState<string>('')

  const [search, setSearch] =
    useState<string>('')

  const [formData, setFormData] =
    useState({

      name: '',
      email: '',
      department: '',
      salary: '',
      image: ''

    })

  /*
  =========================
  TOKEN + USER
  =========================
  */

  const token =
    localStorage.getItem('token')

  const user =
    JSON.parse(
      localStorage.getItem('user') || '{}'
    )

  const role = user?.role || ''

  /*
  =========================
  FETCH EMPLOYEES
  =========================
  */

  const fetchEmployees =
    async () => {

      try {

        const res =
          await axios.get(

            'http://localhost:8000/api/employees',

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        setEmployees(res.data)

      } catch (error) {

        console.log(error)
      }
    }

  useEffect(() => {

    fetchEmployees()

  }, [])

  /*
  =========================
  HANDLE CHANGE
  =========================
  */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    })
  }

  /*
  =========================
  EDIT EMPLOYEE
  =========================
  */

  const editEmployee = (
    emp: EmployeeType
  ) => {

    setFormData({

      name: emp.name,
      email: emp.email,
      department: emp.department,
      salary: String(emp.salary),
      image: emp.image

    })

    setEditingId(emp._id)
  }

  /*
  =========================
  ADD / UPDATE
  =========================
  */

  const addEmployee =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault()

      try {

        if (editingId) {

          await axios.put(

            `http://localhost:8000/api/employees/${editingId}`,

            formData,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

          setEditingId('')

        } else {

          await axios.post(

            'http://localhost:8000/api/employees',

            formData,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )
        }

        fetchEmployees()

        setFormData({

          name: '',
          email: '',
          department: '',
          salary: '',
          image: ''

        })

      } catch (error) {

        console.log(error)
      }
    }

  /*
  =========================
  DELETE
  =========================
  */

  const deleteEmployee =
    async (id: string) => {

      try {

        await axios.delete(

          `http://localhost:8000/api/employees/${id}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        fetchEmployees()

      } catch (error) {

        console.log(error)
      }
    }

  /*
  =========================
  FILTER
  =========================
  */

  const filteredEmployees =
    employees.filter((emp) =>

      emp.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  return (

    <div className="min-h-screen p-8 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white">

      {/* TITLE */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">

          Employees

        </h1>

        <input
          type="text"
          placeholder="Search Employee..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-80 p-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
        />

      </div>

      {/* FORM */}

      {(role === 'Admin' ||
        role === 'HR') && (

        <form
          onSubmit={addEmployee}
          className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl mb-10"
        >

          <div className="grid grid-cols-2 gap-5">

            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={formData.name}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10"
            />

            <input
              type="email"
              name="email"
              placeholder="Employee Email"
              value={formData.email}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10"
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10"
            />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10"
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-slate-800 border border-white/10 col-span-2"
            />

          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition p-4 rounded-2xl font-bold text-lg"
          >

            {editingId
              ? 'Update Employee'
              : 'Add Employee'}

          </button>

        </form>

      )}

      {/* EMPLOYEE CARDS */}

      <div className="grid grid-cols-3 gap-8">

        {filteredEmployees.map(
          (emp) => (

            <div
              key={emp._id}
              className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl hover:scale-105 transition duration-300"
            >

              <div className="flex justify-center">

                <img
                  src={
                    emp.image ||
                    'https://i.pravatar.cc/150?img=8'
                  }
                  alt={emp.name}
                  className="w-28 h-28 rounded-full border-4 border-purple-500 object-cover"
                />

              </div>

              <h2 className="text-2xl font-bold text-center mt-5">

                {emp.name}

              </h2>

              <div className="mt-6 space-y-4 text-gray-300">

                <div className="flex items-center gap-3">

                  <Mail size={18} />

                  <p>{emp.email}</p>

                </div>

                <div className="flex items-center gap-3">

                  <Building2 size={18} />

                  <p>{emp.department}</p>

                </div>

                <div className="flex items-center gap-3">

                  <IndianRupee size={18} />

                  <p>₹ {emp.salary}</p>

                </div>

              </div>

              <div className="flex gap-3 mt-8">

                {(role === 'Admin' ||
                  role === 'HR') && (

                  <button
                    onClick={() =>
                      editEmployee(emp)
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600 p-3 rounded-2xl flex items-center justify-center gap-2 transition"
                  >

                    <Pencil size={18} />

                    Edit

                  </button>

                )}

                {role === 'Admin' && (

                  <button
                    onClick={() =>
                      deleteEmployee(emp._id)
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 p-3 rounded-2xl flex items-center justify-center gap-2 transition"
                  >

                    <Trash2 size={18} />

                    Delete

                  </button>

                )}

              </div>

            </div>
          )
        )}

      </div>

    </div>
  )
}

export default Employees