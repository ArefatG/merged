import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useGears = (currentUserEmail) => {
  const axiosPublic = useAxiosPublic();

  const { data: gears = [], refetch } = useQuery({
    queryKey: ["gears"],
    queryFn: async () => {
      const res = await axiosPublic.get("/gears");
      const gears = res.data.filter(
        (gear) => gear.isAvailable && gear.owner !== currentUserEmail
      );
      return gears;
    },
  });

  return [gears, refetch];
};

export default useGears;
