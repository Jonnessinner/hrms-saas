import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  CalendarClock,
  CheckCircle,
  XCircle,
  Clock3,
  User,
  Search
} from 'lucide-react'

function LeaveManagement() {

  const user =
    JSON.parse(
      localStorage.getItem('user') || '{}'
    )

  const token =
    localStorage.getItem('token')

  const [leaves, setLeaves] =
    useState<any[]>([])

  const [search, setSearch] =
    useState('')

  const [formData, setFormData] =
    useState({

      employeeName:
        user.name || '',

      employeeEmail:
        user.email || '',

      reason: '',

      fromDate: '',

      toDate: ''

    })

  /*
  ====================================
  AXIOS CONFIG
  ====================================
  */

  const config = {

    headers: {

      Authorization:
        `Bearer ${token}`

    }
  }

  /*
  ====================================
  FETCH LEAVES
  ====================================
  */

  const fetchLeaves =
    async () => {

      try {

        const res =
          await axios.get(

            'http://localhost:8000/api/leaves',

            config
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
  ====================================
  HANDLE CHANGE
  ====================================
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
  ====================================
  APPLY LEAVE
  ====================================
  */

  const applyLeave =
    async (e: any) => {

      e.preventDefault()

      try {

        await axios.post(

          'http://localhost:8000/api/leaves',

          {

            ...formData,

            employeeName:
              user.name,

            employeeEmail:
              user.email,

            status:
              'Pending'

          },

          config
        )

        fetchLeaves()

        setFormData({

          employeeName:
            user.name || '',

          employeeEmail:
            user.email || '',

          reason: '',

          fromDate: '',

          toDate: ''

        })

        alert(
          'Leave applied successfully'
        )

      } catch (error) {

        console.log(error)
      }
    }

  /*
  ====================================
  UPDATE STATUS
  ====================================
  */

  const updateStatus =
    async (
      id: string,
      status: string
    ) => {

      try {

        await axios.put(

          `http://localhost:8000/api/leaves/${id}`,

          { status },

          config
        )

        fetchLeaves()

      } catch (error) {

        console.log(error)
      }
    }

  /*
  ====================================
  ANALYTICS
  ====================================
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

  /*
  ====================================
  SEARCH FILTER
  ====================================
  */

  const filteredLeaves =
    leaves.filter((item: any) =>

      item.employeeName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  return (

    <div className="min-h-screen p-8 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold">

            Leave Management

          </h1>

          <p className="text-gray-400 mt-2">

            Manage employee leave requests

          </p>

        </div>

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
              pl-11
              p-4
              rounded-2xl
              bg-white/10
              border
              border-white/10
              w-72
              outline-none
            "
          />

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-yellow-500/20 border border-yellow-500 p-6 rounded-3xl shadow-2xl">

          <div className="flex items-center gap-4">

            <Clock3 size={40} />

            <div>

              <h2 className="text-lg">
                Pending
              </h2>

              <p className="text-4xl font-bold">

                {pending}

              </p>

            </div>

          </div>

        </div>

        <div className="bg-green-500/20 border border-green-500 p-6 rounded-3xl shadow-2xl">

          <div className="flex items-center gap-4">

            <CheckCircle size={40} />

            <div>

              <h2 className="text-lg">
                Approved
              </h2>

              <p className="text-4xl font-bold">

                {approved}

              </p>

            </div>

          </div>

        </div>

        <div className="bg-red-500/20 border border-red-500 p-6 rounded-3xl shadow-2xl">

          <div className="flex items-center gap-4">

            <XCircle size={40} />

            <div>

              <h2 className="text-lg">
                Rejected
              </h2>

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

        <h2 className="text-2xl font-bold mb-6">

          Apply Leave

        </h2>

        <div className="grid grid-cols-2 gap-5">

          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            readOnly
            className="p-4 rounded-2xl bg-slate-800 border border-white/10"
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={formData.reason}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none"
          />

          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none"
          />

          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-slate-800 border border-white/10 outline-none"
          />

        </div>

        <button
          type="submit"
          className="
            mt-6
            w-full
            bg-gradient-to-r
            from-purple-600
            to-blue-600
            p-4
            rounded-2xl
            text-lg
            font-bold
          "
        >

          Apply Leave

        </button>

      </form>

      {/* LEAVE CARDS */}

      <div className="grid grid-cols-3 gap-8">

        {filteredLeaves.map((item: any) => (

          <div
            key={item._id}
            className="
              bg-white/10
              backdrop-blur-lg
              border
              border-white/10
              rounded-3xl
              p-6
              shadow-2xl
            "
          >

            <div className="flex items-center gap-4 mb-6">

              <div className="bg-purple-500 p-4 rounded-full">

                <User />

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

            <div className="space-y-4 text-gray-300">

              <div>

                <p className="text-sm text-gray-400">

                  Reason

                </p>

                <p className="font-bold text-white">

                  {item.reason}

                </p>

              </div>

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-gray-400">

                    From

                  </p>

                  <p className="font-bold text-white">

                    {item.fromDate}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">

                    To

                  </p>

                  <p className="font-bold text-white">

                    {item.toDate}

                  </p>

                </div>

              </div>

              <div className="pt-2">

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

            {/* ACTIONS */}

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
                  className="
                    flex-1
                    bg-green-500
                    hover:bg-green-600
                    p-3
                    rounded-2xl
                    font-bold
                  "
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
                  className="
                    flex-1
                    bg-red-500
                    hover:bg-red-600
                    p-3
                    rounded-2xl
                    font-bold
                  "
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
