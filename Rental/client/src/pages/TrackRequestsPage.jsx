import React, { useEffect, useState } from 'react';
import useTrackBookingRequests from '../hooks/useTrackBookingRequests';
import useUser from '../hooks/useUser';
import Swal from "sweetalert2";
import axios from "axios";

const TrackRequestsPage = () => {
  const [requests, error, deleteRequest, deleting, deleteSuccess, refetch] = useTrackBookingRequests();
  const [userData, refetchUserData, userId, userError] = useUser();
  const [localDeleteSuccess, setLocalDeleteSuccess] = useState(false);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    if (deleteSuccess) {
      setLocalDeleteSuccess(true);
      const timer = setTimeout(() => {
        setLocalDeleteSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = (gearId, requestId) => {
    deleteRequest(gearId, requestId);
  };

  const generateTxRef = (firstName) => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `${firstName}_${date}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const initiatePayment = async (request) => {
    setInitiatingPayment(true);
    try {
      const txRef = generateTxRef(userData[0].name.split(" ")[0]);

      const response = await axios.post(`http://localhost:6001/gears/payment`, {
        amount: request.totalPrice,
        email: userData[0].email,
        firstName: userData[0].name.split(" ")[0],
        lastName: userData[0].name.split(" ").slice(1).join(" "),
        requestId: request._id,
        userId: userId,
        txRef: txRef // ensure txRef is passed
      }, {
        headers: {
          authorization: `Bearer ${token}`,
        }
      });

      if (response.data.status === 'success') {
        window.location.href = response.data.data.checkout_url;
        await refetch(); // Refetch requests after initiating payment
      } else {
        Swal.fire("Error!", "Failed to initiate payment.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to initiate payment.", "error");
    } finally {
      setInitiatingPayment(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="text-center space-y-5">
          <h2 className="text-4xl font-bold leading-snug">
            Track Your <span className="text-deepblue">Booking Requests</span>
          </h2>
        </div>
      </div>

      {error ? (
        <div className="text-center mt-20">
          <p className="text-error">Error: {error.message}</p>
        </div>
      ) : (
        <>
          {localDeleteSuccess && (
            <div className="alert alert-success shadow-lg mb-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2l4-4m2 0a9 9 0 11-6.34-3.34"
                  />
                </svg>
                <span>Booking request deleted successfully!</span>
              </div>
            </div>
          )}

          {requests.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th>#</th>
                    <th>Item Name</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td>{index + 1}</td>
                      <td>{request.gearName}</td>
                      <td>
                        <span
                          className={`badge ${
                            request.status === 'pending'
                              ? 'badge-warning'
                              : request.status === 'accepted'
                              ? 'badge-success'
                              : 'badge-error'
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td className="space-x-2">
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDelete(request.gearId, request._id)}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                        {request.status === 'accepted' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => initiatePayment(request)}
                            disabled={initiatingPayment}
                          >
                            {initiatingPayment ? 'Processing...' : 'Proceed to Checkout'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center mt-20">
              <p className="text-black">No booking requests found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrackRequestsPage;
