import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const usegears = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: gear = [] } = useQuery({
    queryKey: ["gears", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/gears/email/${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  return [gear, refetch];
};
export default usegears;
