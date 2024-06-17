import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Signup from "../components/Signup";
import PrivateRoute from "../PrivateRouter/PrivateRouter";
import UserProfile from "../pages/UserProfile";
import ReservePage from "../pages/Profile/ReservePage";
import TrackRequestsPage from "../pages/TrackRequestsPage";
import Login from "../components/Login";
import DashboardLayout from "../layout/DashboardLayout";
import AdminDashboardLayout from "../layout/AdminDashboardLayout";
import DashboardLanding from "../pages/dashboard/DashboardLanding";
import Users from "../pages/dashboard/admin/Users";
import Addgears from "../pages/dashboard/Addgears";
import ManageItems from "../pages/dashboard/ManageItems";
import Updategears from "../pages/dashboard/Updategears";
import ManageBookings from "../pages/dashboard/ManageBookings";
import Gears from "../pages/Profile/Gears";
import SearchResults from "../components/searchResults";
import RentedPage from "../pages/RentedPage";
import RentalStats from "../pages/dashboard/RentalStats";
import TrackRentedGear from "../pages/dashboard/TrackRentedGear";
import AllRentals from "../pages/dashboard/admin/AllRentals";
import BookingRequests from "../pages/dashboard/admin/BookingRequests";
import UsersBalances from "../pages/dashboard/admin/UserBalances";
import AdminDashboardLanding from "../pages/dashboard/admin/AdminDashboardLanding";
import ErrorPage from "../pages/ErrorPage"; // Import the custom ErrorPage component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />, // Add ErrorPage here
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/gears",
        element: <Gears />
      },
      {
        path: "/search/:query",
        element: <SearchResults />,
      },
      {
        path: "/update-profile",
        element: <UserProfile />
      },
      {
        path: "/reserve-page",
        element: <ReservePage />
      },
      {
        path: "/track-requests",
        element: <TrackRequestsPage />
      },
      {
        path: "/rented/",
        element: <PrivateRoute><RentedPage /></PrivateRoute>
      }
    ]
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage /> // Add ErrorPage here
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage /> // Add ErrorPage here
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    errorElement: <ErrorPage />, // Add ErrorPage here
    children: [
      {
        path: '',
        element: <DashboardLanding />
      },
      {
        path: 'manage-bookings',
        element: <ManageBookings />
      },
      {
        path: 'add-gears',
        element: <Addgears />
      },
      {
        path: "manage-items",
        element: <ManageItems />
      },
      {
        path: "rental-stats",
        element: <RentalStats />
      },
      {
        path: "track-rented",
        element: <TrackRentedGear />
      },
      {
        path: "update-gears/:id",
        element: <Updategears />,
        loader: ({ params }) => fetch(`http://localhost:6001/gears/${params.id}`)
      },
    ]
  },
  {
    path: 'admin-dashboard',
    element: <PrivateRoute><AdminDashboardLayout /></PrivateRoute>,
    errorElement: <ErrorPage />, // Add ErrorPage here
    children: [
      {
        path: '',
        element: <AdminDashboardLanding />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: "all-rentals",
        element: <AllRentals />
      },
      {
        path: "booking-requests",
        element: <BookingRequests />
      },
      {
        path: "users-balances",
        element: <UsersBalances />
      }
    ]
  }
]);

export default router;
