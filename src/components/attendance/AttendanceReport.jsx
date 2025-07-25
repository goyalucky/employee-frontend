import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceReport = () => {
  const [report, setReport] = useState({});
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ limit, skip });
      if (dateFilter) {
        query.append("date", dateFilter);
      }

      const response = await axios.get(
        `http://localhost:3000/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const newData = response.data.groupData;

        if (skip === 0) {
          setReport(newData);
        } else {
          setReport((prevData) => {
            const merged = { ...prevData };
            for (const [date, records] of Object.entries(newData)) {
              if (merged[date]) {
                merged[date] = [...merged[date], ...records];
              } else {
                merged[date] = records;
              }
            }
            return merged;
          });
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  const handleLoadMore = () => {
    setSkip((prev) => prev + limit);
  };

  const handleFilterChange = (e) => {
    setDateFilter(e.target.value);
    setSkip(0);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-teal-50 to-sky-100">
      <h2 className="text-center text-4xl font-extrabold text-teal-800 mb-10 animate-fade-in">
        📊 Attendance Report
      </h2>

      <div className="mb-8 flex flex-col md:flex-row items-center gap-4 justify-center">
        <label className="text-lg font-semibold text-gray-800">📅 Filter by Date</label>
        <input
          type="date"
          className="border border-gray-300 bg-white p-2 rounded shadow hover:shadow-md transition"
          value={dateFilter}
          onChange={handleFilterChange}
        />
      </div>

      {loading && skip === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : Object.keys(report).length === 0 ? (
        <div className="text-center text-gray-600 text-xl">😕 No records found.</div>
      ) : (
        Object.entries(report).map(([date, record]) => (
          <div
            className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-teal-200 animate-slide-in"
            key={date}
          >
            <h3 className="text-2xl font-bold text-teal-700 mb-4">{date}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th className="p-3 border border-teal-600">S.No</th>
                  <th className="p-3 border border-teal-600">Employee ID</th>
                  <th className="p-3 border border-teal-600">Name</th>
                  <th className="p-3 border border-teal-600">Department</th>
                  <th className="p-3 border border-teal-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {record.map((data, i) => (
                  <tr
                    key={data.employeeId + i}
                    className="text-center hover:bg-teal-50 transition"
                  >
                    <td className="border border-gray-300 p-2">{i + 1}</td>
                    <td className="border border-gray-300 p-2">{data.employeeId}</td>
                    <td className="border border-gray-300 p-2">{data.employeeName}</td>
                    <td className="border border-gray-300 p-2">{data.departmentName}</td>
                    <td
                      className={`border p-2 font-semibold ${
                        data.status === "Present"
                          ? "text-green-600"
                          : data.status === "Absent"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {data.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {Object.keys(report).length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-bold shadow transition transform ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-400 to-sky-400 text-white hover:scale-105 hover:shadow-lg"
            }`}
          >
            {loading ? "Loading..." : "⬇️ Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
