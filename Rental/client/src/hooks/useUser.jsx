import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";

const useUser = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    console.log("User Email:", user?.email);
    console.log("Access Token:", token);
  }, [user, token]);

  const {
    refetch,
    data: userData = [],
    error,
  } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      try {
        const res = await fetch(
          `http://localhost:6001/users/email/${user?.email}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await res.json();
        console.log("User Data:", userData);
        setUserId(userData?.[0]?._id || null);
        return userData;
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    },
    onError: (err) => {
      console.error("Error fetching user data:", err);
    },
  });

  return [userData, refetch, userId, error];
};

export default useUser;
