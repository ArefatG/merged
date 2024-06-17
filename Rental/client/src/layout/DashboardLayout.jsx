import React from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import { FaEdit, FaPlusCircle, FaRegUser, FaShoppingBag, FaChartBar, FaBalanceScale, FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import logo from "/logo.png";
import Login from "../components/Login";
import useAuth from "../hooks/useAuth";

const sharedLinks = (
  <>
    <li className="mt-3">
      <Link to="/">
        <FaHome /> Home
      </Link>
    </li>
    <li>
      <Link to="/gears">
        <FaCartShopping /> Gears
      </Link>
    </li>
  </>
);

const DashboardLayout = () => {
  const { loading } = useAuth();

  return (
    <div>
      {loading ? (
        <Login />
      ) : (
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
              <button className="btn rounded-full px-6 bg-deepblue flex items-center gap-2 text-white sm:hidden">
                <FaRegUser /> Logout
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
                <Link to="/dashboard" className="flex justify-start mb-3">
                  <img src={logo} alt="Logo" className="w-20" />
                  <span className="badge bg-deepblue text-white">User</span>
                </Link>
              </li>
              <hr />
              <li>
                <Link to="/dashboard">
                  <MdDashboard /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-bookings">
                  <FaShoppingBag /> Manage Bookings
                </Link>
              </li>
              <li>
                <Link to="/dashboard/add-gears">
                  <FaPlusCircle /> Add Gears
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-items">
                  <FaEdit /> Manage Gears
                </Link>
              </li>
              <li>
                <Link to="/dashboard/rental-stats">
                  <FaChartBar /> Rental Statistics
                </Link>
              </li>
              <li>
                <Link to="/dashboard/track-rented">
                  <FaBalanceScale /> Track Rented Gear
                </Link>
              </li>
              <hr />
              {sharedLinks}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
