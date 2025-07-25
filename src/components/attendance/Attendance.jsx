import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { columns } from '../../utils/AttendanceHelper';
import AttendanceHelper from '../../utils/AttendanceHelper';
import DataTable from 'react-data-table-component';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  const statusChange = () => {
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/attendance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.attendance.map((att) => ({
          employeeId: att.employeeId.employeeId,
          sno: sno++,
          department: att.employeeId.department.dep_name,
          name: att.employeeId.userId.name,
          action: (
            <AttendanceHelper
              status={att.status}
              employeeId={att.employeeId.employeeId}
              statusChange={statusChange}
            />
          ),
        }));

        setAttendance(data);
        setFilteredAttendance(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("Failed to fetch attendance.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const records = attendance.filter((emp) =>
      emp.department.toLowerCase().includes(searchValue)
    );
    setFilteredAttendance(records);
  };

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Attendance</h3>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search By Dept Name"
          onChange={handleFilter}
          className="px-4 py-1 border rounded"
        />

        <p className="text-xl">
          Mark Employees for{" "}
          <span className="font-bold underline">
            {new Date().toISOString().split("T")[0]}
          </span>
        </p>

        <Link
          to="/admin-dashboard/attendance-report"
          className="px-4 py-1 bg-teal-600 rounded text-white hover:bg-teal-700 transition"
        >
          Attendance Report
        </Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-lg font-semibold text-pink-600">Loading Attendance Data...</div>
        ) : (
          <DataTable columns={columns} data={filteredAttendance} pagination />
        )}
      </div>
    </div>
  );
};

export default Attendance;
