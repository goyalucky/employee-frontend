import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import AuthProvider from './context/authContext'
import PrivateRoutes from './utils/PrivateRoutes'
import RoleBaseRoutes from './utils/RoleBaseRoutes'
import AdminSummary from './components/dashboard/AdminSummary'
import DepartmentList from './components/department/DepartmentList'
import AddDepartment from './components/department/AddDepartment'
import EditDepartment from './components/department/EditDepartment'
import List from './components/employee/List'
import Add from './components/employee/Add'
import View from './components/employee/View'
import Edit from './components/employee/Edit'
import AddSalary from './components/salary/Add'
import ViewSalary from './components/salary/View'
import Summary from './components/EmployeeDashboard/Summary'
import LeaveList from './components/leave/List'
import AddLeave from './components/leave/Add'
import Setting from './components/EmployeeDashboard/Setting'
import Table from './components/leave/Table'
import Detail from './components/leave/Detail'
import Attendance from './components/attendance/Attendance'
import AttendanceReport from './components/attendance/AttendanceReport'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/admin-dashboard" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin-dashboard" element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }>
            <Route index element={<AdminSummary />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="add-department" element={<AddDepartment />} />
            <Route path="add-employee" element={<Add />} />
            <Route path="employees/:id" element={<View />} />
            <Route path="employee/edit/:id" element={<Edit />} />
            <Route path="employees/salary/:id" element={<ViewSalary />} />
            <Route path="salary/add" element={<AddSalary />} />
            <Route path="leaves" element={<Table />} />
            <Route path="leaves/:id" element={<Detail />} />
            <Route path="employees/leaves/:id" element={<LeaveList />} />
            <Route path="department/:id" element={<EditDepartment />} />
            <Route path="employees" element={<List />} />
            <Route path="setting" element={<Setting />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attendance-report" element={<AttendanceReport />} />
          </Route>

          {/* Employee Dashboard Routes */}
          <Route path="/employee-dashboard" element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }>
            <Route index element={<Summary />} />
            <Route path="profile/:id" element={<View />} />
            <Route path="leaves/:id" element={<LeaveList />} />
            <Route path="add-leave" element={<AddLeave />} />
            <Route path="salary/:id" element={<ViewSalary />} />
            <Route path="setting" element={<Setting />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
