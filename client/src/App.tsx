import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Payroll from './pages/Payroll'
import Login from './pages/Login'
import LeaveManagement from './pages/Leave'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED APP */}

        <Route
          path="/*"
          element={

            <ProtectedRoute>

              <div className="flex bg-[#020617] text-white">

                {/* SIDEBAR */}

                <Sidebar />

                {/* MAIN CONTENT */}

                <div className="flex-1 min-h-screen overflow-y-auto">

                  <Routes>

                    <Route
                      path="/"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/employees"
                      element={<Employees />}
                    />

                    <Route
                      path="/attendance"
                      element={<Attendance />}
                    />

                    <Route
                      path="/leave"
                      element={<LeaveManagement />}
                    />

                    <Route
                      path="/payroll"
                      element={<Payroll />}
                    />

                  </Routes>

                </div>

              </div>

            </ProtectedRoute>

          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App