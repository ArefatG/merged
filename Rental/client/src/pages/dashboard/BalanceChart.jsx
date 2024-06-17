import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BalanceChart = () => {
  const { user } = useContext(AuthContext);
  const [balanceData, setBalanceData] = useState([]);
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:6001/users/balance/${user?.email}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setBalanceData(response.data);
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };

    fetchBalanceData();
  }, [user?.email]);

  const data = {
    labels: balanceData.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: "Balance Over Time",
        data: balanceData.map((entry) => entry.balance),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="w-full px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">Balance Over Time</h2>
      <Line data={data} />
    </div>
  );
};

export default BalanceChart;
