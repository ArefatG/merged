import { useEffect, useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";

const useTrackBookingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [userData, , userId, error] = useUser();
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const token = localStorage.getItem("access-token");

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6001/gears/requests/user/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId, token]);

  const refetch = async () => {
    await fetchRequests();
  };

  const deleteRequest = async (gearId, requestId) => {
    setDeleting(true);
    setDeleteSuccess(false);
    try {
      await axios.delete(
        `http://localhost:6001/gears/requests/${gearId}/${requestId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      setDeleteSuccess(true);
      await refetch();
    } catch (error) {
      console.error("Error deleting booking request:", error);
    } finally {
      setDeleting(false);
    }
  };

  return [requests, error, deleteRequest, deleting, deleteSuccess, refetch];
};

export default useTrackBookingRequests;
