import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthProvider';

const BookingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:6001/gears/booking-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking requests", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 30000); // Refetch every 30 seconds
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [token]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">All Booking Requests</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-deepblue text-white">
              <tr>
                <th>Gear Name</th>
                <th>Rented By</th>
                <th>Renter Email</th>
                <th>Owner Name</th>
                <th>Owner Email</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td>{request.gearName}</td>
                  <td>{request.userName}</td>
                  <td>{request.userEmail}</td>
                  <td>{request.ownerName}</td>
                  <td>{request.ownerEmail}</td>
                  <td className={`font-bold ${request.status === 'accepted' ? 'text-green-600' : request.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'N/A'}
                  </td>
                  <td>{request.startDate ? new Date(request.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{request.endDate ? new Date(request.endDate).toLocaleDateString() : 'N/A'}</td>
                  <td>${request.totalPrice ? request.totalPrice.toFixed(2) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
