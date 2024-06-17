import React from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import { FaEdit, FaPlusCircle, FaShoppingBag, FaUser } from "react-icons/fa";
import logo from "/logo.png";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

const AdminDashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  if (isAdminLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <p>Unauthorized access</p>;
  }

  const handleLogout = () => {
    logOut().then(() => {
      // You can add any additional logic here after logout
    });
  };

  return (
    <div>
      <div className="drawer sm:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
          <div className="flex items-center justify-between mx-4">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              <MdDashboardCustomize />
            </label>
            <button onClick={handleLogout} className="btn rounded-full px-6 bg-deepblue flex items-center gap-2 text-white sm:hidden">
              Logout
            </button>
          </div>
          <div className="mt-5 md:mt-2 mx-4">
            <Outlet />
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li>
              <Link to="/admin-dashboard" className="flex justify-start mb-3">
                <img src={logo} alt="Logo" className="w-20" />
                <span className="badge bg-deepblue text-white">Admin</span>
              </Link>
            </li>
            <hr />
            <li>
              <Link to="/admin-dashboard">
                <MdDashboard /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/all-rentals">
                <FaShoppingBag /> All Rentals
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/booking-requests">
                <FaShoppingBag /> All Booking Requests
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/users-balances">
                <FaUser /> Users & Balances
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/users">
                <FaUser /> All Users
              </Link>
            </li>
            <hr />
            <li>
              <button onClick={handleLogout} className="btn w-full mt-4 bg-deepblue text-white">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
