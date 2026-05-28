import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    email: '',
    password: ''

  })

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  /*
  =========================
  HANDLE CHANGE
  =========================
  */

  const handleChange = (
    e: any
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    })
  }

  /*
  =========================
  LOGIN
  =========================
  */

  const handleLogin = async (
    e: any
  ) => {

    e.preventDefault()

    setLoading(true)

    setError('')

    try {

      const res =
        await axios.post(

          'http://localhost:8000/api/auth/login',

          formData
        )

      console.log(res.data)

      /*
      =========================
      SAVE TOKEN
      =========================
      */

      if (res.data.token) {

        localStorage.setItem(
          'token',
          res.data.token
        )

        localStorage.setItem(
          'user',
          JSON.stringify(
            res.data.user
          )
        )

        alert('Login Success')

        navigate('/')

      } else {

        setError(
          'Invalid Email or Password'
        )
      }

    } catch (error: any) {

      console.log(error)

      setError(

        error.response?.data?.message ||

        'Login Failed'
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E1B4B] overflow-hidden relative">

      {/* BACKGROUND GLOW */}

      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-30 top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-20 bottom-[-100px] right-[-100px]" />

      {/* LOGIN CARD */}

      <div className="relative z-10 w-full max-w-md">

        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10">

          {/* TITLE */}

          <div className="text-center mb-10">

            <h1 className="text-5xl font-bold text-white mb-3">

              Delluna HRMS

            </h1>

            <p className="text-gray-300">

              Modern HR Management System

            </p>

          </div>

          {/* ERROR */}

          {error && (

            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-xl mb-5 text-center">

              {error}

            </div>

          )}

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            {/* EMAIL */}

            <div>

              <label className="block text-gray-300 mb-2">

                Email

              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-gray-300 mb-2">

                Password

              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="123456"
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition duration-300 p-4 rounded-2xl font-bold text-lg shadow-lg"
            >

              {loading
                ? 'Logging in...'
                : 'Login'}

            </button>

          </form>

          {/* DEMO */}

          <div className="mt-8 text-center text-gray-400 text-sm">

            <p>

              Demo Credentials

            </p>

            <p className="mt-2 text-purple-300">

              admin@gmail.com

            </p>

            <p className="text-purple-300">

              123456

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login