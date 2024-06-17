import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const useBalance = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: balanceData = { balance: 0 } } = useQuery({
    queryKey: ["balance", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/users/Tbalance/${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  return [balanceData, refetch];
};

export default useBalance;
