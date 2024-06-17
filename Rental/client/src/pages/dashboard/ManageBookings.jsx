import React, { useState, useEffect } from "react";
import axios from "axios";
import useBookingRequests from "../../hooks/useBookingRequests";

const BookingRequests = () => {
  const [bookingRequests, refetch, updateRequestStatus] = useBookingRequests();
  const [usersInfo, setUsersInfo] = useState({});
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    const fetchUsersInfo = async () => {
      try {
        const userIds = bookingRequests.map((request) => request.userId);
        const usersPromises = userIds.map((userId) =>
          axios.get(`http://localhost:6001/users/${userId}`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
        );
        const usersData = await Promise.all(usersPromises);
        const usersInfo = usersData.reduce((acc, user) => {
          acc[user.data._id] = user.data;
          return acc;
        }, {});
        setUsersInfo(usersInfo);
      } catch (error) {
        console.error("Error fetching users information:", error);
      }
    };

    if (bookingRequests.length > 0) {
      fetchUsersInfo();
    }
  }, [bookingRequests]);

  const handleUpdateStatus = (gearId, requestId, status) => {
    updateRequestStatus(gearId, requestId, status);
  };

  // Sort the booking requests by createdAt in descending order
  const sortedBookingRequests = bookingRequests.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Manage <span className="text-deepblue">Booking Requests</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Gear Name</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookingRequests.map((request, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{request.gearName}</td>
                <td>{usersInfo[request.userId]?.name || "Loading..."}</td>
                <td>{usersInfo[request.userId]?.email || "Loading..."}</td>
                <td>{new Date(request.startDate).toLocaleDateString()}</td>
                <td>{new Date(request.endDate).toLocaleDateString()}</td>
                <td>{request.status}</td>
                <td>
                  <button
                    className="btn btn-xs btn-success mr-2"
                    onClick={() =>
                      handleUpdateStatus(
                        request.gearId,
                        request._id,
                        "accepted"
                      )
                    }
                    disabled={request.status === "accepted"}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-xs btn-danger"
                    onClick={() =>
                      handleUpdateStatus(
                        request.gearId,
                        request._id,
                        "rejected"
                      )
                    }
                    disabled={request.status === "rejected"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingRequests;
