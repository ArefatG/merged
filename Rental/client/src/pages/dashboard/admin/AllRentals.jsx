import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const AllRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get('http://localhost:6001/rented/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRentals(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rentals", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchRentals();
    }
  }, [token]);

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">All Rentals</h2>
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
                <th>Owner Email</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Owner Name</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td>{rental.gearItems.map(item => item.name).join(', ')}</td>
                  <td>{rental.userName}</td>
                  <td>{rental.userEmail}</td>
                  <td>{rental.gearItems.map(item => item.ownerName).join(', ')}</td>
                  <td>{rental.gearItems.map(item => item.ownerEmail).join(', ')}</td>
                  <td>{new Date(rental.gearItems[0].startDate).toLocaleDateString()}</td>
                  <td>{new Date(rental.gearItems[0].endDate).toLocaleDateString()}</td>
                  <td>${rental.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRentals;
