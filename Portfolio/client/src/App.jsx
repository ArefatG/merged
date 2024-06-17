import React from 'react';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Gigs from './pages/gigs/Gigs';
import Gig from "./pages/gig/gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Product from './pages/product/Product';
import Add from './pages/add/Add';
import Orders from './pages/orders/Orders';
import Message from './pages/message/Message';
import Messages from './pages/messages/Messages';
import MyGigs from './pages/myGigs/MyGigs';
import EditProfile from './components/eeditprofile/EditProfile';
import EditPortfolio from "./pages/EditPortfolio/EditPortfolio";
import Portfolio from './pages/portfolio/Portfolio'; // Import the Portfolio component
import './app.scss';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/gigs", element: <Gigs /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/forgot-password", element:<ForgotPassword /> },
        { path: "/reset-password/:token", element:<ResetPassword />},
        { path: "/edit-profile", element: <EditProfile /> },
        { path: "/product/:id", element: <Product /> },
        { path: "/orders", element: <Orders /> },
        { path: "/myGigs", element: <MyGigs /> },
        { path: "/add", element: <Add /> },
        { path: "/gig/:id", element: <Gig /> },
        { path: "/message/:id", element: <Message /> },
        { path: "/messages", element: <Messages /> },
        { path: "/editportfolio/:id", element: <EditPortfolio /> },
        { path: "/portfolio", element: <Portfolio /> }, // Add the Portfolio route
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
