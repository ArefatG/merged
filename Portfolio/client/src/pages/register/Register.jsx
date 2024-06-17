import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
  city: Yup.string().required("City is required"),
  phone: Yup.string().matches(/^\+251\d+$/, "Phone number must start with +251"),
  desc: Yup.string().optional(),
});

function Register() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      city: "",
      phone: "",
      desc: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
      setGeneralError(null);
      try {
        const url = file ? await upload(file) : "";
        await newRequest.post("/auth/register", {
          ...values,
          img: url,
        });
        navigate("/");
      } catch (err) {
        console.log(err.response.data); // Log the error response for debugging
        if (err.response && err.response.data) {
          const errorMessage = err.response.data.message || err.response.data.error;
          if (errorMessage.includes("E11000 duplicate key error")) {
            if (errorMessage.includes("email")) {
              setErrors({ email: "This email is already registered." });
            } else if (errorMessage.includes("username")) {
              setErrors({ username: "This username is already taken." });
            }
          } else {
            setGeneralError(errorMessage || "An unexpected error occurred. Please try again.");
          }
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="register">
      <form onSubmit={formik.handleSubmit}>
        <h1>Create a new account</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Your Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className={formik.touched.username && formik.errors.username ? "input-error" : ""}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error">{formik.errors.username}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={formik.touched.email && formik.errors.email ? "input-error" : ""}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={formik.touched.password && formik.errors.password ? "input-error" : ""}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="file">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Addis Ababa"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className={formik.touched.city && formik.errors.city ? "input-error" : ""}
          />
          {formik.touched.city && formik.errors.city && (
            <div className="error">{formik.errors.city}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Only +251"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className={formik.touched.phone && formik.errors.phone ? "input-error" : ""}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="error">{formik.errors.phone}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            name="desc"
            placeholder="A short description of yourself"
            cols="30"
            rows="10"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.desc}
          ></textarea>
        </div>
        <button type="submit" disabled={loading || formik.isSubmitting}>
          {loading ? "Registering..." : "Register"}
        </button>
        {generalError && <div className="general-error">{generalError}</div>}
      </form>
    </div>
  );
}

export default Register;
