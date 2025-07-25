import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { columns, LeaveButtons } from '../../utils/LeaveHelper';

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;

        // Only process leaves having complete nested properties
        const validLeaves = response.data.leaves.filter(
          (leave) =>
            leave.employeeId &&
            leave.employeeId.employeeId &&
            leave.employeeId.userId &&
            leave.employeeId.userId.name &&
            leave.employeeId.department &&
            leave.employeeId.department.dep_name
        );

        const data = validLeaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days:
            (new Date(leave.endDate) - new Date(leave.startDate)) /
              (1000 * 60 * 60 * 24) +
            1,
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));

        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        console.error("Error fetching leaves:", error);
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const value = e.target.value.toLowerCase();
    const data = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(value)
    );
    setFilteredLeaves(data);
  };

  const filterByButton = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  return (
    <div>
      {filteredLeaves.length > 0 ? (
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Leaves</h3>
          </div>
          <div className="flex justify-between items-center my-4">
            <input
              type="text"
              placeholder="Search By Emp Id"
              className="px-4 py-1 border rounded"
              onChange={filterByInput}
            />
            <div className="space-x-3">
              <button
                className="px-2 py-1 bg-yellow-500 text-white hover:bg-yellow-600 rounded"
                onClick={() => filterByButton("Pending")}
              >
                Pending
              </button>
              <button
                className="px-2 py-1 bg-green-600 text-white hover:bg-green-700 rounded"
                onClick={() => filterByButton("Approved")}
              >
                Approved
              </button>
              <button
                className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded"
                onClick={() => filterByButton("Rejected")}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="mt-3">
            <DataTable columns={columns} data={filteredLeaves} pagination />
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 text-lg">No data found or Loading...</div>
      )}
    </div>
  );
};

export default Table;
