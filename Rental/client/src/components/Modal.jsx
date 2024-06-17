import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const Modal = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { signUpWithGmail, login, resetPassword, signInWithGmail } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    login(email, password)
      .then((result) => {
        const user = result.user;
        axios
          .get(`http://localhost:6001/users/email/${user.email}`)
          .then((response) => {
            const userData = response.data[0];
            if (userData.role === "admin") {
              Swal.fire("Success", "Signin successful!", "success");
              navigate("/admin-dashboard");
            } else {
              Swal.fire("Success", "Signin successful!", "success");
              navigate(from, { replace: true });
            }
          })
          .catch((error) => {
            console.error("Error fetching user data: ", error);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (errorMessage === "Email not verified") {
          setErrorMessage("Email not verified. Please verify your email.");
        } else {
          setErrorMessage("Please provide valid email & password!");
        }
      });
    reset();
  };

  const handleForgotPassword = (data) => {
    const email = data.email;
    resetPassword(email)
      .then(() => {
        Swal.fire("Success", "Password reset email sent!", "success");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        setErrorMessage(
          "Error sending password reset email. Please try again."
        );
      });
  };

  const handleRegister = async () => {
    try {
      const result = await signInWithGmail();
      const user = result.user;

      const response = await axios.get(
        `http://localhost:6001/users/email/${user.email}`
      );
      if (response.data.length === 0) {
        await Swal.fire({
          title: "Please Signup First",
          text: "You need to create an account before signing in with Google.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Signup",
        });
        navigate("/signup");
      } else {
        const userData = response.data[0];
        Swal.fire("Success", "Signin successful!", "success");
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex-col justify-center mt-0">
          <form
            className="card-body"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg">Please Login!</h3>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email")}
              />
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
              <label className="label">
                <a
                  href="#"
                  className="label-text-alt link link-hover mt-2"
                  onClick={() => {
                    const email = document.querySelector(
                      "input[type='email']"
                    ).value;
                    if (email) {
                      handleForgotPassword({ email });
                    } else {
                      Swal.fire(
                        "Error",
                        "Please enter your email first",
                        "error"
                      );
                    }
                  }}
                >
                  Forgot password?
                </a>
              </label>
            </div>

            {/* show errors */}
            {errorMessage ? (
              <p className="text-red text-xs italic">{errorMessage}</p>
            ) : (
              ""
            )}

            {/* submit btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-deepblue text-white"
                value="Login"
              />
            </div>

            {/* close btn */}
            <div
              htmlFor="my_modal_5"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_5").close()}
            >
              ✕
            </div>

            <p className="text-center my-2">
              Donot have an account?
              <Link to="/signup" className="underline text-red ml-1">
                Signup Now
              </Link>
            </p>
          </form>
          <div className="text-center space-x-3 mb-5">
            <button
              onClick={handleRegister}
              className="btn btn-circle hover:bg-deepblue hover:text-white"
            >
              <FaGoogle />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
