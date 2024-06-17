import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const useRentedGear = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: rentedGear = [] } = useQuery({
    queryKey: ["rentedGear", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/rented/rented-by-owner/${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  return [rentedGear, refetch];
};

export default useRentedGear;
