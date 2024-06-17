import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaShoppingBag, FaDollarSign } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const AdminDashboardLanding = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalRentals: 0,
    totalBalance: 0,
    netProfit: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [topGears, setTopGears] = useState([]);
  const token = localStorage.getItem("access-token");

  const fetchStats = async () => {
    try {
      const [users, requests, rentals, activities, topUsersRes, topGearsRes] = await Promise.all([
        axios.get('http://localhost:6001/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:6001/gears/booking-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:6001/rented/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:6001/users/recent-activities', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:6001/users/top-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:6001/users/top-gears', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const totalBalance = users.data.reduce((acc, user) => acc + user.balance, 0);
      const netProfit = totalBalance * 0.05;

      setStats({
        totalUsers: users.data.length,
        totalRequests: requests.data.length,
        totalRentals: rentals.data.length,
        totalBalance,
        netProfit,
      });
      setRecentActivities(activities.data.slice(0, 3));
      setTopUsers(topUsersRes.data.slice(0, 3));
      setTopGears(topGearsRes.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link to="/admin-dashboard/users" className="bg-white p-8 rounded-lg shadow-lg flex items-center">
          <div className="text-primary">
            <FaUser className="inline-block w-10 h-10 mr-6" />
          </div>
          <div>
            <div className="text-gray-500 text-lg">Total Users</div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </div>
        </Link>

        <Link to="/admin-dashboard/booking-requests" className="bg-white p-8 rounded-lg shadow-lg flex items-center">
          <div className="text-secondary">
            <FaShoppingBag className="inline-block w-10 h-10 mr-6" />
          </div>
          <div>
            <div className="text-gray-500 text-lg">Total Requests</div>
            <div className="text-3xl font-bold">{stats.totalRequests}</div>
          </div>
        </Link>

        <Link to="/admin-dashboard/all-rentals" className="bg-white p-8 rounded-lg shadow-lg flex items-center">
          <div className="text-accent">
            <FaCartShopping className="inline-block w-10 h-10 mr-6" />
          </div>
          <div>
            <div className="text-gray-500 text-lg">Total Rentals</div>
            <div className="text-3xl font-bold">{stats.totalRentals}</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-8 rounded-lg shadow-lg flex items-center">
          <div className="text-green-500">
            <FaDollarSign className="inline-block w-10 h-10 mr-6" />
          </div>
          <div>
            <div className="text-gray-500 text-lg">Total Balance</div>
            <div className="text-3xl font-bold">${stats.totalBalance.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg flex items-center">
          <div className="text-blue-500">
            <FaDollarSign className="inline-block w-10 h-10 mr-6" />
          </div>
          <div>
            <div className="text-gray-500 text-lg">Net Profit</div>
            <div className="text-3xl font-bold">${stats.netProfit.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Recent Activities</h3>
          <ul className="list-disc pl-5">
            {recentActivities.map(activity => (
              <li key={activity._id} className="mb-2">
                {activity.gearItems.map(item => item.gearId.name).join(', ')} rented by {activity.userName}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Top Users</h3>
          <ul className="list-disc pl-5">
            {topUsers.map(user => (
              <li key={user._id} className="mb-2">
                {user.name} ({user.email}) - {user.rentalsCount} rentals
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Top Gears</h3>
          <ul className="list-disc pl-5">
            {topGears.map(gear => (
              <li key={gear._id} className="mb-2">
                {gear.name} - Rented {gear.totalRented} times
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLanding;
