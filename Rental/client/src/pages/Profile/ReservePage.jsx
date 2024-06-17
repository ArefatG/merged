import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useReserve from "../../hooks/useReserve";
import useUser from "../../hooks/useUser";
import { AuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReservePage.css"; // custom CSS to style DatePicker with DaisyUI

const ReservePage = () => {
  const { user } = useContext(AuthContext);
  const [userData, refetchUserData, userId, error] = useUser(); // Fetch user data including user ID
  const [reserve, refetch] = useReserve();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [startDate, setStartDate] = useState(new Date()); // Start date for rental
  const [endDate, setEndDate] = useState(null); // End date for rental
  const [reservation, setReservation] = useState([]); // State to manage reservation

  useEffect(() => {
    if (error) {
      console.error('Error fetching user data:', error);
    }
  }, [error]);

  useEffect(() => {
    setReservation(reserve);
  }, [reserve]);

  // Calculate the total price for each item in the reservation
  const calculateTotalPrice = (item) => {
    if (!endDate) return 0;
    const diffInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24)); // Convert time difference to days
    return item.price * diffInDays;
  };

  // Calculate the reservation subtotal
  const reservationSubtotal = reservation.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  // Calculate the order total
  const orderTotal = reservationSubtotal;

  // delete an item
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:6001/reserves/${item._id}`).then(response => {
          if (response) {
            refetch();
            Swal.fire("Deleted!", "Your reservation has been deleted.", "success");
          }
        })
        .catch(error => {
          console.error(error);
        });
      }
    });
  };

  const sendBookRequestForAll = async () => {
    if (!endDate) {
      Swal.fire("Error!", "Please select an end date for the rental period.", "error");
      return;
    }

    try {
      const txRef = `tx_${Date.now()}`;

      const requests = reservation.map(async (item) => {
        await axios.post(`http://localhost:6001/gears/book/${item.gearsItemId}`, {
          userId: userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          txRef,
          totalPrice: calculateTotalPrice(item)
        });
      });

      await Promise.all(requests);

      // Delete all reserve items
      const deleteRequests = reserve.map(async (item) => {
        await axios.delete(`http://localhost:6001/reserves/${item._id}`);
      });

      // Wait for all delete requests to complete
      await Promise.all(deleteRequests);

      // Refetch reserve items to clear the list
      refetch();

      Swal.fire("Success!", "Booking requests submitted successfully.", "success");

      // Redirect to track requests page

      // Redirect to track requests page
      navigate("/track-requests");
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to submit booking requests.", "error");
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      {/* banner */}
      <div className=" bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Items Added to The<span className="text-deepblue"> Reserve List</span>
            </h2>
          </div>
        </div>
      </div>

      {/* reserve table */}
      {reservation.length > 0 ? (
        <div>
          <div className="">
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead className="bg-deepblue text-white rounded-sm">
                  <tr>
                    <th>#</th>
                    <th>Gear</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reservation.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={item.image}
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="font-medium">{item.name}</td>
                      <td>${calculateTotalPrice(item).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm border-none text-red bg-transparent"
                          onClick={() => handleDelete(item)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* foot */}
              </table>
            </div>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Customer Details</h3>
              <p>Name: {user?.displayName || "None"}</p>
              <p>Email: {user?.email}</p>
              <p>
                User_id: <span className="text-sm">{user?.uid}</span>
              </p>
            </div>
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Total Gear Rental Price</h3>
              <p>Total Items: {reservation.length}</p>
              <p>
                Total Price:{" "}
                <span id="total-price">${orderTotal.toFixed(2)}</span>
              </p>
              <div className="flex flex-col space-y-3">
                <h3 className="text-lg font-semibold">Select Rental Dates</h3>
                <div className="flex items-center space-x-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Start Date</span>
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">End Date</span>
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      minDate={startDate}
                      dateFormat="yyyy-MM-dd"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                </div>
              </div>
              <button
                className="btn btn-md bg-deepblue text-white px-8 py-1 mt-3"
                onClick={sendBookRequestForAll}
              >
                Send book request
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>Reserve is empty. Please add gears.</p>
          <Link to="/gears">
            <button className="btn bg-deepblue text-white mt-3">Back to gears</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReservePage;
