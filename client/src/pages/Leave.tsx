import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  CalendarClock,
  CheckCircle,
  XCircle,
  Clock3
} from 'lucide-react'

function LeaveManagement() {

  const [leaves, setLeaves] = useState<any[]>([])

  const [formData, setFormData] = useState({
    employeeName: '',
    reason: '',
    fromDate: '',
    toDate: ''
  })

  /*
  =========================
  TOKEN + USER
  =========================
  */

  const token = localStorage.getItem('token')

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  )

  /*
  =========================
  FETCH LEAVES
  =========================
  */

  const fetchLeaves = async () => {

    try {

      const res = await axios.get(
        'http://localhost:8000/api/leaves',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setLeaves(res.data)

    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {

    fetchLeaves()

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
      [e.target.name]: e.target.value
    })
  }

  /*
  =========================
  APPLY LEAVE
  =========================
  */

  const applyLeave = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    try {

      await axios.post(

        'http://localhost:8000/api/leaves',

        {
          ...formData,
          status: 'Pending'
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchLeaves()

      setFormData({
        employeeName: '',
        reason: '',
        fromDate: '',
        toDate: ''
      })

    } catch (error) {

      console.log(error)
    }
  }

  /*
  =========================
  UPDATE STATUS
  =========================
  */

  const updateStatus = async (
    id: string,
    status: string
  ) => {

    if (
      user.role !== 'Admin' &&
      user.role !== 'HR'
    ) {

      alert(
        'Only Admin or HR can approve/reject leaves'
      )

      return
    }

    try {

      await axios.put(

        `http://localhost:8000/api/leaves/${id}`,

        { status },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchLeaves()

    } catch (error) {

      console.log(error)
    }
  }

  /*
  =========================
  ANALYTICS
  =========================
  */

  const approved =
    leaves.filter(
      (item: any) =>
        item.status === 'Approved'
    ).length

  const rejected =
    leaves.filter(
      (item: any) =>
        item.status === 'Rejected'
    ).length

  const pending =
    leaves.filter(
      (item: any) =>
        item.status === 'Pending'
    ).length

  return (

    <div className="min-h-screen p-8 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white">

      <h1 className="text-5xl font-bold mb-10">
        Leave Management
      </h1>

      {/* ANALYTICS */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-yellow-500/20 border border-yellow-500 p-6 rounded-3xl">

          <div className="flex items-center gap-4">

            <Clock3 size={40} />

            <div>
              <h2>Pending</h2>

              <p className="text-4xl font-bold">
                {pending}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-green-500/20 border border-green-500 p-6 rounded-3xl">

          <div className="flex items-center gap-4">

            <CheckCircle size={40} />

            <div>
              <h2>Approved</h2>

              <p className="text-4xl font-bold">
                {approved}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-red-500/20 border border-red-500 p-6 rounded-3xl">

          <div className="flex items-center gap-4">

            <XCircle size={40} />

            <div>
              <h2>Rejected</h2>

              <p className="text-4xl font-bold">
                {rejected}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={applyLeave}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl mb-10"
      >

        <div className="grid grid-cols-2 gap-5">

          <input
            type="text"
            name="employeeName"
            placeholder="Employee Name"
            value={formData.employeeName}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={formData.reason}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          />

          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          />

          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          />

        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl text-lg font-bold hover:scale-[1.02] transition"
        >

          Apply Leave

        </button>

      </form>

      {/* LEAVE CARDS */}

      <div className="grid grid-cols-3 gap-8">

        {leaves.map((item: any) => (

          <div
            key={item._id}
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl"
          >

            <div className="flex items-center gap-4 mb-5">

              <div className="bg-purple-500 p-3 rounded-full">
                <CalendarClock />
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  {item.employeeName}
                </h2>

                <p className="text-gray-400">
                  Leave Request
                </p>

              </div>

            </div>

            <div className="space-y-3 text-gray-300">

              <p>
                Reason:
                <span className="ml-2 font-bold">
                  {item.reason}
                </span>
              </p>

              <p>
                From:
                <span className="ml-2 font-bold">
                  {item.fromDate}
                </span>
              </p>

              <p>
                To:
                <span className="ml-2 font-bold">
                  {item.toDate}
                </span>
              </p>

              <div className="pt-3">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    item.status === 'Approved'
                      ? 'bg-green-500'
                      : item.status === 'Rejected'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                >

                  {item.status}

                </span>

              </div>

            </div>

            {(user.role === 'Admin' ||
              user.role === 'HR') && (

              <div className="flex gap-3 mt-8">

                <button
                  onClick={() =>
                    updateStatus(
                      item._id,
                      'Approved'
                    )
                  }
                  className="flex-1 bg-green-500 hover:bg-green-600 p-3 rounded-2xl transition"
                >

                  Approve

                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      item._id,
                      'Rejected'
                    )
                  }
                  className="flex-1 bg-red-500 hover:bg-red-600 p-3 rounded-2xl transition"
                >

                  Reject

                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  )
}

export default LeaveManagement