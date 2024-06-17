import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const useRentalStats = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: stats = [] } = useQuery({
    queryKey: ["rentalStats", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/gears/rental-stats/${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  return [stats, refetch];
};

export default useRentalStats;
