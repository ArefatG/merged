import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUser from '../hooks/useUser';
import { AuthContext } from "../context/AuthProvider";

const RentedPage = () => {
  const [userData, refetchUserData, userId, userError] = useUser();
  const location = useLocation();
  const [rented, setRented] = useState([]);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const [showOwnerInfo, setShowOwnerInfo] = useState({});

  useEffect(() => {
    const fetchRented = async () => {
      try {
        const response = await axios.get(`http://localhost:6001/rented/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Sort the rented items by createdAt in descending order
        const sortedRented = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRented(sortedRented);
      } catch (error) {
        console.error('Error fetching rented items:', error);
      }
    };

    if (userId) {
      fetchRented();
    }
  }, [userId]);

  useEffect(() => {
    if (location.search.includes('success=true')) {
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Your payment was processed successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }, [location.search]);

  const toggleOwnerInfo = (gearItemId) => {
    setShowOwnerInfo((prevState) => ({
      ...prevState,
      [gearItemId]: !prevState[gearItemId],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-4xl text-center mt-6 font-bold mb-8">Your Rented Items</h2>
      {rented.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-deepblue text-white">
                <th>#</th>
                <th>Gear Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price</th>
                <th>Transaction Reference</th>
                <th>Collection Code</th>
                <th>Owner Info</th>
              </tr>
            </thead>
            <tbody>
              {rented.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.gearItems.map(gear => gear.name).join(', ')}</td>
                  <td>{new Date(item.gearItems[0].startDate).toLocaleDateString()}</td>
                  <td>{new Date(item.gearItems[0].endDate).toLocaleDateString()}</td>
                  <td>${item.totalPrice.toFixed(2)}</td>
                  <td>{item.txRef}</td>
                  <td>{item.gearItems.map(gear => gear.uniqueCode).join(', ')}</td>
                  <td>
                    {item.gearItems.map((gear, idx) => (
                      <div key={idx}>
                        <button
                          onClick={() => toggleOwnerInfo(gear._id)}
                          className="btn bg-deepblue text-white mt-3"
                        >
                          Show Owner Info
                        </button>
                        {showOwnerInfo[gear._id] && (
                          <div className="mt-2">
                            <p>Name: {gear.ownerName}</p>
                            <p>Address: {gear.ownerAddress}</p>
                            <p>Phone Number: {gear.ownerPhoneNumber}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No rented items found.</p>
      )}
      <div className="text-center mt-20">
        <Link to="/track-requests">
          <button className="btn bg-deepblue text-white mt-3">
            Track requests
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RentedPage;
