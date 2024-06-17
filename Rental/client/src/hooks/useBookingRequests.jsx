import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";

const useBookingRequests = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: bookingRequests = [] } = useQuery({
    queryKey: ["bookingRequests", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:6001/gears/requests/${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
  });

  const updateRequestStatus = async (gearId, requestId, status) => {
    await axios.patch(
      `http://localhost:6001/gears/requests/${gearId}/${requestId}`,
      { status },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    refetch();
  };

  return [bookingRequests, refetch, updateRequestStatus];
};

export default useBookingRequests;
