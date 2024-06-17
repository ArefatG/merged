import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const useBalanceHistory = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: balanceHistory = [] } = useQuery({
    queryKey: ["balanceHistory", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/users/balance/history/${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  return [balanceHistory, refetch];
};

export default useBalanceHistory;
