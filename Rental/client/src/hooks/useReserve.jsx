import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const useReserve = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: reserve = [] } = useQuery({
    queryKey: ["reserves", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/reserves?email=${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  return [reserve, refetch];
};
export default useReserve;
