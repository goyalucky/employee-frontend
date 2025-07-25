import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/EmployeeDashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';

const EmployeeDashboard = () =>{
    return (
        <div className='flex'>
            <Sidebar/>
            <div className='flex-1 ml-64 bg-gray-100 h-screen'>
                <Navbar/>
                <Outlet/>
            </div>
        </div>
    )
}

export default EmployeeDashboard;