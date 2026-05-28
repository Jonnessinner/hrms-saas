import logo from '../assets/logo.png'

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  LogOut,
  ClipboardList
} from 'lucide-react'

function Sidebar() {

  const navigate = useNavigate()

  const location = useLocation()

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  )

  const logout = () => {

    localStorage.removeItem('token')

    localStorage.removeItem('user')

    navigate('/login')
  }

  const menu = [

    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />
    },

    {
      name: 'Employees',
      path: '/employees',
      icon: <Users size={20} />
    },

    {
      name: 'Attendance',
      path: '/attendance',
      icon: <CalendarCheck size={20} />
    },

    {
      name: 'Leave Management',
      path: '/leave',
      icon: <ClipboardList size={20} />
    },

    {
      name: 'Payroll',
      path: '/payroll',
      icon: <Wallet size={20} />
    }

  ]

  return (

    <div className="w-72 min-h-screen bg-[#030712] border-r border-white/10 text-white flex flex-col justify-between shadow-2xl">

      {/* TOP */}

      <div>

        {/* LOGO */}

        <div className="flex flex-col items-center py-10 border-b border-white/10">

          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.7)]">

            <img
              src={logo}
              alt="Delluna"
              className="w-full h-full object-cover"
            />

          </div>

          <h1 className="text-3xl font-extrabold mt-5 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">

            Delluna HRMS

          </h1>

          <p className="text-gray-400 text-sm mt-2">

            Modern SaaS HR Platform

          </p>

        </div>

        {/* MENU */}

        <div className="p-5 space-y-3">

          {menu.map((item) => (

            <Link
              key={item.path}
              to={item.path}
              className={`

                flex items-center gap-4
                px-5 py-4
                rounded-2xl
                transition-all duration-300
                font-medium

                ${
                  location.pathname === item.path

                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'

                    : 'hover:bg-white/10'
                }

              `}
            >

              {item.icon}

              {item.name}

            </Link>

          ))}

        </div>

      </div>

      {/* BOTTOM */}

      <div className="p-5 border-t border-white/10">

        {/* USER CARD */}

        <div className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/10">

          <p className="text-gray-400 text-sm">
            Logged in as
          </p>

          <h2 className="text-xl font-bold mt-1">

            {user.name || 'Admin'}

          </h2>

          <p className="text-purple-400 text-sm mt-1">

            {user.role || 'Administrator'}

          </p>

        </div>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="

            w-full
            flex items-center justify-center gap-3
            bg-red-500 hover:bg-red-600
            py-4
            rounded-2xl
            font-semibold
            transition-all duration-300

          "
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </div>
  )
}

export default Sidebar