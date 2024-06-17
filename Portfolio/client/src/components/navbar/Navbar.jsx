import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);

    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <NavLink className="link" to="/">
            <img src="./img/logo.png" alt="Gearstream Logo" />
          </NavLink>
        </div>
        <div className="menu">
          <NavLink exact to="/" className="link" activeClassName="active">
            Home
          </NavLink>
         
         
          <NavLink to="/portfolio" className="link" activeClassName="active">
            Category
          </NavLink>
          <NavLink to="/gigs?cat=" className="link" activeClassName="active">
            Portfolio
          </NavLink>
          <a
            onClick={() => (window.location.href = "http://localhost:3000")}
            style={{ cursor: "pointer" }}
          >
            Gears
          </a>
        </div>
        <div className="links">
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  <NavLink className="link" to="/mygigs">
                    My Portfolios
                  </NavLink>
                  <NavLink className="link" to="/add">
                    Add New Portfolio
                  </NavLink>
                  <NavLink className="link" to="/edit-profile">
                    Edit Profile
                  </NavLink>
                  <span className="link" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="link">
                <button> Sign in </button>
              </NavLink>
              <NavLink className="link" to="/register">
                <button> Join </button>
              </NavLink>
            </>
          )}
        </div>
      </div>
      {active || pathname !== "/" ? <hr /> : null}
    </div>
  );
};

export default Navbar;
