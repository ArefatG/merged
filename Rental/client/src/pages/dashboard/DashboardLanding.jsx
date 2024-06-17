import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBalance from "../../hooks/useBalance";
import useBookingRequests from "../../hooks/useBookingRequests";
import useOwnerGears from "../../hooks/useGearsByEmail";
import useBalanceHistory from "../../hooks/useBalanceHistory";
import useRentedGear from "../../hooks/useRentedGear";
import useRentalStats from "../../hooks/useRentalStats";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaDollarSign, FaShoppingBag, FaChartBar } from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';

const DashboardLanding = () => {
  const [balanceData, refetchBalance] = useBalance();
  const [requests, refetchRequests] = useBookingRequests();
  const [gears, refetchGears] = useOwnerGears();
  const [balanceHistory, refetchBalanceHistory] = useBalanceHistory();
  const [rentedGear, refetchRentedGear] = useRentedGear();
  const [stats, refetchRentalStats] = useRentalStats();
  const navigate = useNavigate();

  useEffect(() => {
    refetchBalance();
    refetchRequests();
    refetchGears();
    refetchBalanceHistory();
    refetchRentedGear();
    refetchRentalStats();
  }, [
    refetchBalance,
    refetchRequests,
    refetchGears,
    refetchBalanceHistory,
    refetchRentedGear,
    refetchRentalStats,
  ]);

  // Sort stats by totalRented in descending order and take the top 3
  const popularGears = stats.sort((a, b) => b.totalRented - a.totalRented).slice(0, 3);

  const balanceChartData = {
    labels: balanceHistory.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Balance Over Time',
        data: balanceHistory.map(entry => entry.balance),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const totalProfit = balanceData.balance * 0.95;

  return (
    <div className="w-full px-4 mx-auto">
      <h2 className="text-3xl font-bold my-6 text-center">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card shadow-lg bg-white p-6 rounded-lg flex items-center cursor-pointer" onClick={() => navigate('/dashboard/manage-bookings')}>
          <FaShoppingBag className="text-secondary w-10 h-10 mr-4" />
          <div>
            <h3 className="text-xl font-bold text-gray-700">Booking Requests</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{requests.length}</p>
          </div>
        </div>
        <div className="card shadow-lg bg-white p-6 rounded-lg flex items-center cursor-pointer" onClick={() => navigate('/dashboard/rental-stats')}>
          <MdTrendingUp className="text-accent w-10 h-10 mr-4" />
          <div>
            <h3 className="text-xl font-bold text-gray-700">Popular Gears</h3>
            <ul className="mt-4 space-y-2">
              {popularGears.map((gear, index) => (
                <li key={gear._id} className="text-lg text-gray-900">
                  {index + 1}. {gear.name} ({gear.totalRented} rentals)
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card shadow-lg bg-white p-6 rounded-lg flex items-center cursor-pointer" onClick={() => navigate('/dashboard/track-rented')}>
          <FaChartBar className="text-primary w-10 h-10 mr-4" />
          <div>
            <h3 className="text-xl font-bold text-gray-700">Total Rented</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{rentedGear.length}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card shadow-lg bg-white p-6 rounded-lg flex items-center">
          <FaDollarSign className="text-primary w-10 h-10 mr-4" />
          <div>
            <h3 className="text-xl font-bold text-gray-700">Total Balance</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">${balanceData.balance.toFixed(2)}</p>
          </div>
        </div>
        <div className="card shadow-lg bg-white p-6 rounded-lg flex items-center">
          <FaDollarSign className="text-green-500 w-10 h-10 mr-4" />
          <div>
            <h3 className="text-xl font-bold text-gray-700">Net Profit</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">${totalProfit.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Balance Over Time</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Line data={balanceChartData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
