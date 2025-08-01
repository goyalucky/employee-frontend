import React, { useEffect, useState } from 'react';
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: '',
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: '',
  });

  const [departments, setDepartments] = useState([]);  
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  // Fetch departments
  useEffect(() => {
    const getDepartments = async () => {
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);
    };
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value);
    setEmployees(emps);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit salary data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://employee-api-sable.vercel.app/api/salary/add`,
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        navigate('/admin-dashboard/employees');
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div>
      {departments.length > 0 ? (  
        <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
          <h2 className='text-2xl font-bold mb-6'>Add Salary</h2>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Department</label>
                <select
                  name='department'
                  onChange={handleDepartment}
                  className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dep => (
                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Employee</label>
                <select
                  name='employeeId'
                  onChange={handleChange}
                  className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Basic Salary</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name='basicSalary'
                  placeholder='basic salary'
                  className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Allowances</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name='allowances'
                  placeholder='allowances'
                  className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Deductions</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name='deductions'
                  placeholder='deductions'
                  className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Pay Date</label>
                <input
                  type="date"
                  onChange={handleChange}
                  name='payDate'
                  className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                  required
                />
              </div>

            </div>

            <button
              type='submit'
              className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md'
            >
              Add Salary
            </button>

          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Add;